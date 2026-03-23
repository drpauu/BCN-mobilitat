"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import type { EventType, MobilityItem } from "@/data/mobility";
import { layerConfig, severityColors } from "@/data/mobility";

interface BCNMapProps {
  items: MobilityItem[];
  visibleLayers: Set<EventType>;
  onMarkerClick: (item: MobilityItem) => void;
}

const DIRECT_DARK_TILES = [
  "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
  "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
  "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
  "https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
];
const PROXY_DARK_TILES = ["/api/basemap/{z}/{x}/{y}"];

type TileMode = "direct" | "proxy";
type LoadState = "loading" | "ready" | "fallback" | "error";

function createStyle(mode: TileMode): maplibregl.StyleSpecification {
  const rasterPaint = mode === "direct"
    ? {
        // CARTO dark is already tuned, so keep a very soft correction.
        "raster-saturation": -0.12,
        "raster-contrast": 0.1,
        "raster-brightness-min": 0.13,
        "raster-brightness-max": 0.9,
      }
    : {
        // Proxy might fallback to OSM, so keep stronger dark treatment.
        "raster-saturation": -0.4,
        "raster-contrast": 0.18,
        "raster-brightness-min": 0.08,
        "raster-brightness-max": 0.72,
      };

  return {
    version: 8,
    sources: {
      basemap: {
        type: "raster",
        tiles: mode === "direct" ? DIRECT_DARK_TILES : PROXY_DARK_TILES,
        tileSize: 256,
        attribution: "OpenStreetMap contributors, CARTO",
      },
    },
    layers: [
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": "#0f172a",
        },
      },
      {
        id: "basemap",
        type: "raster",
        source: "basemap",
        minzoom: 0,
        maxzoom: 19,
        paint: rasterPaint,
      },
    ],
  };
}

function createMarkerElement(item: MobilityItem) {
  const cfg = layerConfig[item.type];
  const color = item.severity ? severityColors[item.severity] : cfg.color;

  const root = document.createElement("button");
  root.type = "button";
  root.setAttribute("aria-label", item.title);
  root.style.cssText = `
    border: 0;
    padding: 0;
    background: transparent;
    cursor: pointer;
    display: block;
  `;

  // Keep marker visuals in an inner wrapper so we don't override
  // the absolute positioning MapLibre applies to the root element.
  const content = document.createElement("div");
  content.style.cssText = `
    position: relative;
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  if (item.status === "active" && item.severity === "high") {
    const pulse = document.createElement("div");
    pulse.style.cssText = `
      position: absolute;
      inset: -4px;
      border-radius: 9999px;
      border: 2px solid ${color};
      opacity: 0.55;
      animation: ring-pulse 2s ease-out infinite;
    `;
    content.appendChild(pulse);
  }

  const circle = document.createElement("div");
  circle.style.cssText = `
    position: relative;
    z-index: 1;
    width: 34px;
    height: 34px;
    border-radius: 9999px;
    background: ${color}22;
    border: 2.5px solid ${color};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    box-shadow: 0 2px 12px ${color}55;
    backdrop-filter: blur(4px);
    transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease, filter 0.15s ease;
  `;
  circle.textContent = cfg.emoji;

  if (item.status === "resolved") {
    circle.style.opacity = "0.45";
    circle.style.filter = "grayscale(0.6)";
  }

  content.appendChild(circle);
  root.appendChild(content);

  return { root, circle, color };
}

export function BCNMap({ items, visibleLayers, onMarkerClick }: BCNMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const isReadyRef = useRef(false);
  const sawTileContentRef = useRef(false);
  const lastErrorRef = useRef<string | null>(null);
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [tileMode, setTileMode] = useState<TileMode>("direct");
  const [retryNonce, setRetryNonce] = useState(0);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [diagnostic, setDiagnostic] = useState<string | null>(null);

  const currentModeLabel = tileMode === "direct" ? "CARTO dark directe" : "Proxy /api/basemap";

  useEffect(() => {
    if (!mapContainer.current) return;
    if (tileMode === "direct") {
      setLoadState("loading");
      setDiagnostic(null);
    }
    isReadyRef.current = false;
    sawTileContentRef.current = false;
    lastErrorRef.current = null;

    let map: maplibregl.Map;
    try {
      map = new maplibregl.Map({
        container: mapContainer.current,
        style: createStyle(tileMode),
        center: [2.1734, 41.3851],
        zoom: 12.7,
        minZoom: 9.5,
        maxZoom: 18.5,
        attributionControl: false,
        renderWorldCopies: false,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No s'ha pogut inicialitzar el mapa amb OpenStreetMap";
      setDiagnostic(message);
      setLoadState("error");
      return;
    }

    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), "bottom-left");

    const markReady = () => {
      if (isReadyRef.current) return;
      isReadyRef.current = true;
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
      setDiagnostic(null);
      setLoadState("ready");
    };

    const handleSourceData = (event: maplibregl.MapSourceDataEvent) => {
      if (event.sourceId !== "basemap") return;
      if (event.sourceDataType === "content") {
        sawTileContentRef.current = true;
        markReady();
        return;
      }
      if (event.isSourceLoaded && map.areTilesLoaded()) {
        markReady();
      }
    };

    const handleLoad = () => {
      if (map.isStyleLoaded()) {
        markReady();
      }
    };

    const handleIdle = () => {
      if (sawTileContentRef.current || map.areTilesLoaded()) {
        markReady();
      }
    };

    const handleError = (event: { error?: Error }) => {
      if (isReadyRef.current) return;
      lastErrorRef.current =
        event.error?.message ?? "No s'ha pogut carregar el mapa amb OpenStreetMap";
    };

    map.on("load", handleLoad);
    map.on("sourcedata", handleSourceData);
    map.on("idle", handleIdle);
    map.on("error", handleError);

    // Keep the app responsive even if the network blocks one of the tile strategies.
    const timeoutMs = tileMode === "direct" ? 2800 : 6500;
    loadTimeoutRef.current = setTimeout(() => {
      if (!isReadyRef.current) {
        if (tileMode === "direct") {
          setDiagnostic(lastErrorRef.current ?? "Temps d'espera superat amb mode directe.");
          setLoadState("fallback");
          setTileMode("proxy");
          return;
        }

        setDiagnostic(lastErrorRef.current ?? "Temps d'espera superat amb proxy.");
        setLoadState("error");
      }
    }, timeoutMs);

    mapRef.current = map;

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
      map.off("load", handleLoad);
      map.off("sourcedata", handleSourceData);
      map.off("idle", handleIdle);
      map.off("error", handleError);
      isReadyRef.current = false;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
    };
  }, [tileMode, retryNonce]);

  useEffect(() => {
    if (!mapRef.current || loadState === "error") return;

    const map = mapRef.current;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    items.forEach((item) => {
      if (!visibleLayers.has(item.type)) return;

      const { root, circle, color } = createMarkerElement(item);

      root.addEventListener("mouseenter", () => {
        circle.style.transform = "scale(1.2)";
        circle.style.boxShadow = `0 4px 20px ${color}88`;
      });

      root.addEventListener("mouseleave", () => {
        circle.style.transform = "scale(1)";
        circle.style.boxShadow = `0 2px 12px ${color}55`;
      });

      root.addEventListener("click", (e) => {
        e.stopPropagation();
        onMarkerClick(item);
      });

      const marker = new maplibregl.Marker({
        element: root,
        anchor: "center",
      })
        .setLngLat([item.lng, item.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [items, visibleLayers, loadState, onMarkerClick]);

  const retryMapLoad = () => {
    setDiagnostic(null);
    setLoadState("loading");
    setTileMode("direct");
    setRetryNonce((prev) => prev + 1);
  };

  return (
    <div className="absolute inset-0">
      <div ref={mapContainer} className="absolute inset-0" />

      {(loadState === "loading" || loadState === "fallback") && (
        <div className="absolute top-4 right-4 z-20 pointer-events-none">
          <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[hsl(220_16%_11%_/_0.85)] px-3 py-2 text-xs text-white/70 backdrop-blur-md">
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-blue-300/30 border-t-blue-300" />
            <span>
              {loadState === "fallback"
                ? "Canviant a proxy de seguretat..."
                : "Carregant base map..."}
            </span>
          </div>
        </div>
      )}

      {loadState === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-[hsl(220_16%_8%)]/90 text-center px-6">
          <div className="max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-100 shadow-2xl">
            <div className="font-semibold">No s'ha pogut carregar el mapa</div>
            <div className="mt-2 text-red-100/75">
              Mode: {currentModeLabel}
              {diagnostic ? ` - ${diagnostic}` : ""}
            </div>
            <button
              type="button"
              onClick={retryMapLoad}
              className="mt-4 inline-flex items-center justify-center rounded-xl border border-blue-400/40 bg-blue-500/20 px-3 py-1.5 text-sm font-medium text-blue-100 transition-colors hover:bg-blue-500/30"
            >
              Reintenta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
