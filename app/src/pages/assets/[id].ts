import type { APIRoute } from "astro";
import { readAssetRaw, type AssetsQuery } from "@directus/sdk";

import { Client } from "@/lib/directus";

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

  try {
    return new Response(await Client.request(readAssetRaw(id, query)));
  } catch {
    return new Response("Not Found", { status: 404 });
  }
};