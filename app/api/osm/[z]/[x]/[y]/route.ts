import { NextRequest } from "next/server";

const TILE_HOSTS = [
  "https://tile.openstreetmap.org",
  "https://a.tile.openstreetmap.org",
  "https://b.tile.openstreetmap.org",
  "https://c.tile.openstreetmap.org",
];

const USER_AGENT = "BCN-Mobility-Assistant/1.0 (+local-dev)";
const HOST_TIMEOUT_MS = 3500;

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ z: string; x: string; y: string }>;
}

function parseTileCoord(value: string, allowPngSuffix = false) {
  const match = allowPngSuffix
    ? value.match(/^(\d+)(?:\.png)?$/i)
    : value.match(/^(\d+)$/);
  if (!match) return null;
  return Number.parseInt(match[1], 10);
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
      Referer: "https://www.openstreetmap.org/",
    },
    cache: "force-cache",
    next: { revalidate: 60 * 60 },
  });
}

function rotatedHosts(seed: number) {
  if (TILE_HOSTS.length === 0) return TILE_HOSTS;
  const offset = seed % TILE_HOSTS.length;
  return [...TILE_HOSTS.slice(offset), ...TILE_HOSTS.slice(0, offset)];
}

export async function GET(_request: NextRequest, context: RouteParams) {
  const { z: zRaw, x: xRaw, y: yRaw } = await context.params;

  const z = parseTileCoord(zRaw);
  const x = parseTileCoord(xRaw);
  const y = parseTileCoord(yRaw, true);

  if (z === null || x === null || y === null || !isValidTile(z, x, y)) {
    return new Response("Invalid tile coordinates", { status: 400 });
  }

  const hosts = rotatedHosts((x + y + z) >>> 0);
  const errors: string[] = [];

  for (const host of hosts) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), HOST_TIMEOUT_MS);
    const url = `${host}/${z}/${x}/${y}.png`;

    try {
      const upstream = await fetchTile(url, controller.signal);
      if (!upstream.ok) {
        errors.push(`${host}: HTTP ${upstream.status}`);
        continue;
      }

      const contentType = upstream.headers.get("content-type") ?? "image/png";
      const cacheControl =
        upstream.headers.get("cache-control") ?? "public, max-age=300, s-maxage=300";
      const data = await upstream.arrayBuffer();

      return new Response(data, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": cacheControl,
          "X-Tile-Host": host,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        errors.push(`${host}: ${error.name}`);
      } else {
        errors.push(`${host}: unknown error`);
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  return new Response(
    `OpenStreetMap tile unavailable (${errors.slice(0, 3).join(" | ")})`,
    { status: 502 }
  );
}
