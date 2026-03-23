"use client";

import { type EventType, layerConfig } from "@/data/mobility";
import { cn } from "@/lib/utils";

interface LayerToggleProps {
  visibleLayers: Set<EventType>;
  onToggle: (type: EventType) => void;
  counts: Record<EventType, number>;
}

export function LayerToggle({ visibleLayers, onToggle, counts }: LayerToggleProps) {
  const layers = Object.entries(layerConfig) as [EventType, typeof layerConfig[EventType]][];

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {layers.map(([type, cfg]) => {
        const active = visibleLayers.has(type);
        const count = counts[type] || 0;
        return (
          <button
            key={type}
            onClick={() => onToggle(type)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
              "border transition-all duration-200 select-none",
              active
                ? "border-transparent text-white shadow-lg"
                : "border-white/10 text-white/40 bg-white/5 hover:text-white/60"
            )}
            style={
              active
                ? {
                    background: `${cfg.color}22`,
                    borderColor: `${cfg.color}66`,
                    color: cfg.color,
                    boxShadow: `0 0 12px ${cfg.color}33`,
                  }
                : {}
            }
            title={cfg.label}
          >
            <span>{cfg.emoji}</span>
            <span>{cfg.label}</span>
            {count > 0 && (
              <span
                className={cn(
                  "w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold",
                  active ? "bg-white/20" : "bg-white/10"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
