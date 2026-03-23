import { NextRequest } from "next/server";

const DARK_TILE_HOSTS = [
  "https://a.basemaps.cartocdn.com/dark_all",
  "https://b.basemaps.cartocdn.com/dark_all",
  "https://c.basemaps.cartocdn.com/dark_all",
  "https://d.basemaps.cartocdn.com/dark_all",
];

const FALLBACK_TILE_HOSTS = [
  "https://tile.openstreetmap.org",
  "https://a.tile.openstreetmap.org",
  "https://b.tile.openstreetmap.org",
  "https://c.tile.openstreetmap.org",
];

const USER_AGENT = "BCN-Mobility-Assistant/1.0 (+local-dev)";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ z: string; x: string; y: string }>;
}

function parseTileCoord(value: string) {
  if (!/^\d+$/.test(value)) return null;
  return Number.parseInt(value, 10);
}

function isValidTile(z: number, x: number, y: number) {
  if (!Number.isInteger(z) || !Number.isInteger(x) || !Number.isInteger(y)) return false;
  if (z < 0 || z > 20) return false;
  const max = 2 ** z;
  return x >= 0 && x < max && y >= 0 && y < max;
}

async function fetchTile(url: string, signal: AbortSignal) {
  return fetch(url, {
    method: "GET",
    signal,
    headers: {
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      "User-Agent": USER_AGENT,
    },
    cache: "force-cache",
    next: { revalidate: 60 * 60 },
  });
}

async function tryHosts(hosts: string[], z: number, x: number, y: number) {
  for (const host of hosts) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const url = `${host}/${z}/${x}/${y}.png`;

    try {
      const upstream = await fetchTile(url, controller.signal);
      if (!upstream.ok) continue;

      const contentType = upstream.headers.get("content-type") ?? "image/png";
      const cacheControl = upstream.headers.get("cache-control") ?? "public, max-age=300";
      const data = await upstream.arrayBuffer();

      return new Response(data, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": cacheControl,
        },
      });
    } catch {
      // try next host
    } finally {
      clearTimeout(timeout);
    }
  }

  return null;
}

export async function GET(_request: NextRequest, context: RouteParams) {
  const { z: zRaw, x: xRaw, y: yRaw } = await context.params;

  const z = parseTileCoord(zRaw);
  const x = parseTileCoord(xRaw);
  const y = parseTileCoord(yRaw);

  if (z === null || x === null || y === null || !isValidTile(z, x, y)) {
    return new Response("Invalid tile coordinates", { status: 400 });
  }

  const darkResponse = await tryHosts(DARK_TILE_HOSTS, z, x, y);
  if (darkResponse) return darkResponse;

  const fallbackResponse = await tryHosts(FALLBACK_TILE_HOSTS, z, x, y);
  if (fallbackResponse) return fallbackResponse;

  return new Response("Basemap tile unavailable", { status: 502 });
}
