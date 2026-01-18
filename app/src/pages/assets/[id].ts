import type { APIRoute } from "astro";
import { type AssetsQuery } from "@directus/sdk";
import { type AssetRequest } from "@/lib/consts";

type ValidParam = 'width' | 'height' | 'quality' | 'fit';
const validParams: ValidParam[] = ['width', 'height', 'quality', 'fit'];

export const GET: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  // decode
  const decoded = atob(id);
  const req = JSON.parse(decoded) as AssetRequest;

  const query: AssetsQuery = {
    width: req.width,
    height: req.height,
    fit: req.fit,
  };

  const queryString = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      queryString.append(key, String(value));
    }
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/assets/${req.id}?${queryString.toString()}`)
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