"use client";

import { AlertTriangle, Activity } from "lucide-react";
import type { MobilityItem } from "@/data/mobility";
import { layerConfig } from "@/data/mobility";

interface StatsBarProps {
  items: MobilityItem[];
}

export function StatsBar({ items }: StatsBarProps) {
  const active = items.filter((i) => i.status === "active");
  const highSeverity = active.filter((i) => i.severity === "high");

  const byType = active.reduce(
    (acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="flex items-center gap-3 text-xs text-white/50">
      <div className="flex items-center gap-1.5">
        <Activity className="w-3 h-3 text-green-400" />
        <span className="text-white/70">{active.length} incidents actius</span>
      </div>
      {highSeverity.length > 0 && (
        <div className="flex items-center gap-1 text-orange-400/80">
          <AlertTriangle className="w-3 h-3" />
          <span>{highSeverity.length} alta gravetat</span>
        </div>
      )}
      <div className="hidden sm:flex items-center gap-2">
        {Object.entries(byType).map(([type, count]) => {
          const cfg = layerConfig[type as keyof typeof layerConfig];
          if (!cfg) return null;
          return (
            <span key={type} className="flex items-center gap-1">
              <span>{cfg.emoji}</span>
              <span>{count}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
