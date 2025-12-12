import type { APIRoute } from "astro";
import { type AssetsQuery } from "@directus/sdk";

type ValidParam = 'width' | 'height' | 'quality' | 'fit';
const validParams: ValidParam[] = ['width', 'height', 'quality', 'fit'];

export const GET: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const reqParams = new URL(request.url).searchParams;
  const query: AssetsQuery = {};

  for (const key of validParams) {
    const value = reqParams.get(key);
    if (!value) continue;

    if (key === 'width' || key === 'height' || key === 'quality') {
      const num = parseInt(value, 10);
      if (!isNaN(num)) {
        query[key] = num;
      }
    } else if (key === 'fit') {
      if (['cover', 'contain', 'inside', 'outside'].includes(value)) {
        query[key] = value as 'cover' | 'contain' | 'inside' | 'outside';
      }
    }
  }

  const queryString = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    queryString.append(key, String(value));
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/assets/${id}?${queryString.toString()}`)
    if (!res.ok) {
      throw new Error("Asset not found");
    }
    const arrayBuffer = await res.arrayBuffer();
    return new Response(arrayBuffer, {
      headers: res.headers,
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
};