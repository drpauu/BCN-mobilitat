"use client";

import { useState, useCallback } from "react";
import { MapPin } from "lucide-react";
import { mobilityData, layerConfig, type EventType, type MobilityItem } from "@/data/mobility";
import { BCNMap } from "@/components/map/BCNMap";
import { LayerToggle } from "@/components/map/LayerToggle";
import { ItemDetail } from "@/components/map/ItemDetail";
import { StatsBar } from "@/components/map/StatsBar";
import { ChatPanel } from "@/components/chat/ChatPanel";

const ALL_LAYERS = new Set(Object.keys(layerConfig) as EventType[]);

export default function HomePage() {
  const [visibleLayers, setVisibleLayers] = useState<Set<EventType>>(ALL_LAYERS);
  const [selectedItem, setSelectedItem] = useState<MobilityItem | null>(null);
  const [chatOpen, setChatOpen] = useState(true);

  const toggleLayer = useCallback((type: EventType) => {
    setVisibleLayers((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }, []);

  const handleMarkerClick = useCallback((item: MobilityItem) => {
    setSelectedItem((prev) => (prev?.id === item.id ? null : item));
  }, []);

  const counts = Object.keys(layerConfig).reduce(
    (acc, type) => {
      acc[type as EventType] = mobilityData.filter(
        (i) => i.type === (type as EventType) && i.status !== "resolved"
      ).length;
      return acc;
    },
    {} as Record<EventType, number>
  );

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <BCNMap
        items={mobilityData}
        visibleLayers={visibleLayers}
        onMarkerClick={handleMarkerClick}
      />

      <div className="absolute top-4 left-4 right-4 z-10 flex items-start gap-3 pointer-events-none">
        <div
          className="flex-1 rounded-2xl p-3 flex flex-col gap-3 pointer-events-auto"
          style={{
            background: "hsl(220 16% 11% / 0.92)",
            backdropFilter: "blur(16px)",
            border: "1px solid hsl(220 14% 20%)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #1d4ed8, #2563eb)" }}
              >
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight">
                  BCN Mobility Assistant
                </h1>
                <div className="text-[11px] text-white/40">
                  Fase 2 ·{" "}
                  {new Date().toLocaleDateString("ca-ES", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </div>
              </div>
            </div>
            <StatsBar items={mobilityData} />
          </div>

          <LayerToggle
            visibleLayers={visibleLayers}
            onToggle={toggleLayer}
            counts={counts}
          />
        </div>

        {chatOpen && <div className="w-[376px] flex-shrink-0" />}
      </div>

      {selectedItem && (
        <ItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}

      <ChatPanel isOpen={chatOpen} onToggle={() => setChatOpen((v) => !v)} />
    </div>
  );
}
