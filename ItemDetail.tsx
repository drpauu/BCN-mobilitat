"use client";

import { X, MapPin, Clock, AlertTriangle, CheckCircle, Calendar } from "lucide-react";
import type { MobilityItem } from "@/data/mobility";
import { layerConfig, severityColors } from "@/data/mobility";
import { cn } from "@/lib/utils";

interface ItemDetailProps {
  item: MobilityItem;
  onClose: () => void;
}

const severityLabel = {
  high: "Alta",
  medium: "Mitjana",
  low: "Baixa",
};

const statusLabel = {
  active: "Actiu",
  scheduled: "Programat",
  resolved: "Resolt",
};

const StatusIcon = ({ status }: { status: MobilityItem["status"] }) => {
  if (status === "active") return <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse inline-block" />;
  if (status === "scheduled") return <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />;
  return <CheckCircle className="w-3 h-3 text-green-400" />;
};

export function ItemDetail({ item, onClose }: ItemDetailProps) {
  const cfg = layerConfig[item.type];
  const sColor = item.severity ? severityColors[item.severity] : cfg.color;

  const formatDate = (d?: string) => {
    if (!d) return null;
    return new Date(d).toLocaleString("ca-ES", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[340px] rounded-2xl overflow-hidden shadow-2xl animate-fade-in"
      style={{
        background: "hsl(220 16% 12%)",
        border: `1px solid ${sColor}44`,
        boxShadow: `0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px ${sColor}22`,
      }}
    >
      {/* Header strip */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ background: `${sColor}18`, borderBottom: `1px solid ${sColor}30` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{cfg.emoji}</span>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: sColor }}>
              {cfg.label}
            </div>
            <div className="text-sm font-bold text-white leading-tight">{item.title}</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 text-white/60" />
        </button>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-3">
        <p className="text-sm text-white/75 leading-relaxed">{item.description}</p>

        {/* Meta row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <StatusIcon status={item.status} />
            <span className="text-xs text-white/50">{statusLabel[item.status]}</span>
          </div>

          {item.severity && (
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3" style={{ color: sColor }} />
              <span className="text-xs text-white/50">Gravetat: {severityLabel[item.severity]}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-white/30" />
            <span className="text-xs text-white/50">{item.district}</span>
          </div>
        </div>

        {/* Dates */}
        {(item.startDate || item.endDate) && (
          <div className="flex items-start gap-1.5">
            <Calendar className="w-3 h-3 text-white/30 mt-0.5" />
            <div className="text-xs text-white/50 space-y-0.5">
              {item.startDate && <div>Inici: {formatDate(item.startDate)}</div>}
              {item.endDate && <div>Fi: {formatDate(item.endDate)}</div>}
            </div>
          </div>
        )}

        {/* Affected streets */}
        {item.affectedStreets && item.affectedStreets.length > 0 && (
          <div className="flex items-start gap-1.5">
            <Clock className="w-3 h-3 text-white/30 mt-0.5" />
            <div>
              <div className="text-xs text-white/30 mb-1">Carrers afectats</div>
              <div className="flex flex-wrap gap-1">
                {item.affectedStreets.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] px-2 py-0.5 rounded-full"
                    style={{ background: `${sColor}18`, color: sColor, border: `1px solid ${sColor}33` }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
