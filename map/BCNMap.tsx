"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { MapPin } from "lucide-react";
import type { EventType, MobilityItem } from "@/data/mobility";
import { layerConfig, severityColors } from "@/data/mobility";

interface BCNMapProps {
  items: MobilityItem[];
  visibleLayers: Set<EventType>;
  onMarkerClick: (item: MobilityItem) => void;
}

const DIRECT_OSM_TILES = [
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
  "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
  "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
];

const PROXY_OSM_TILES = ["/api/osm/{z}/{x}/{y}"];

type TileMode = "direct" | "proxy";
type LoadState = "loading" | "ready" | "fallback" | "error";

function createStyle(mode: TileMode): maplibregl.StyleSpecification {
  return {
    version: 8,
    sources: {
      osm: {
        type: "raster",
        tiles: mode === "direct" ? DIRECT_OSM_TILES : PROXY_OSM_TILES,
        tileSize: 256,
        attribution: "OpenStreetMap contributors",
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
        id: "osm",
        type: "raster",
        source: "osm",
        minzoom: 0,
        maxzoom: 19,
        paint: {
          // Force a dark look even when the source is standard OSM tiles.
          "raster-saturation": -0.78,
          "raster-contrast": 0.28,
          "raster-brightness-min": 0.05,
          "raster-brightness-max": 0.46,
        },
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

  const currentModeLabel = tileMode === "direct" ? "OSM directe" : "OSM proxy";

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
      if (event.sourceId !== "osm") return;
      if (event.sourceDataType === "content") {
        sawTileContentRef.current = true;
      }
      if (!event.isSourceLoaded) return;
      if (!sawTileContentRef.current) return;
      markReady();
    };

    const handleIdle = () => {
      if (!sawTileContentRef.current) return;
      if (map.areTilesLoaded()) {
        markReady();
      }
    };

    const handleError = (event: { error?: Error }) => {
      if (isReadyRef.current) return;
      lastErrorRef.current =
        event.error?.message ?? "No s'ha pogut carregar el mapa amb OpenStreetMap";
    };

    map.on("sourcedata", handleSourceData);
    map.on("idle", handleIdle);
    map.on("error", handleError);

    // Keep the app responsive even if the network blocks one of the tile strategies.
    const timeoutMs = tileMode === "direct" ? 4000 : 10000;
    loadTimeoutRef.current = setTimeout(() => {
      if (!isReadyRef.current) {
        if (tileMode === "direct") {
          setDiagnostic(lastErrorRef.current ?? "Temps d'espera superat amb OSM directe.");
          setLoadState("fallback");
          setTileMode("proxy");
          return;
        }

        setDiagnostic(lastErrorRef.current ?? "Temps d'espera superat amb OSM proxy.");
        setLoadState("error");
      }
    }, timeoutMs);

    mapRef.current = map;

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
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
    if (loadState !== "ready" || !mapRef.current) return;

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
        <div className="absolute inset-0 flex items-center justify-center bg-[hsl(220_16%_8%)]/85 pointer-events-none">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping" />
              <div className="absolute inset-2 rounded-full bg-blue-500/20 border border-blue-500/50" />
              <MapPin className="absolute inset-0 m-auto w-5 h-5 text-blue-400" />
            </div>
            <div className="text-sm text-white/40 font-medium tracking-wide">
              {loadState === "fallback"
                ? "Canviant a mode proxy..."
                : "Carregant el mapa..."}
            </div>
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
