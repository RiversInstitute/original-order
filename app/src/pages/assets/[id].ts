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

  let assetId = id;
  let query: AssetsQuery = {};

  // decode b64 if it is validly encoded
  try {
    const decoded = atob(id);
    const req = JSON.parse(decoded) as AssetRequest;

    query = {
      width: req.width,
      height: req.height,
      fit: req.fit,
    };
    assetId = req.id
  } catch { }

  const queryString = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      queryString.append(key, String(value));
    }
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/assets/${assetId}?${queryString.toString()}`)
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