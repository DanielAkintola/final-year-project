import { Map } from "lucide-react";
import { GlassCard } from "./GlassCard";

type MapOverlay = {
  title: string;
  votes: number;
  leader: string;
  percentage: number;
  color: "primary" | "tertiary";
};

type VoteDistributionMapProps = {
  mapImageUrl?: string;
  overlays: MapOverlay[];
};

export function VoteDistributionMap({
  mapImageUrl,
  overlays,
}: VoteDistributionMapProps) {
  const colorClasses = {
    primary: "border-primary text-primary",
    tertiary: "border-tertiary text-tertiary",
  };

  return (
    <GlassCard className="rounded-xl overflow-hidden flex flex-col h-[600px]">
      <div className="p-gutter border-b border-outline-variant flex justify-between items-center bg-white/50">
        <h3 className="font-headline-sm text-on-background flex items-center gap-2">
          <Map size={20} className="text-primary" />
          Vote Distribution by LGA
        </h3>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-primary/10 text-primary text-label-md rounded-full border border-primary/20">
            Live Sync
          </span>
          <span className="px-3 py-1 bg-surface-container text-on-surface-variant text-label-md rounded-full">
            Ondo State
          </span>
        </div>
      </div>

      <div className="flex-1 relative bg-slate-50 overflow-hidden">
        {mapImageUrl ? (
          <img
            src={mapImageUrl}
            alt="Ondo State Map"
            className="w-full h-full object-cover opacity-80 grayscale-[0.5] hover:grayscale-0 transition-all duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
            Map visualization would appear here
          </div>
        )}

        {/* Map Overlays */}
        <div className="absolute top-4 left-4 space-y-2">
          {overlays.map((overlay, idx) => (
            <div
              key={idx}
              className={`bg-white/80 backdrop-blur-[12px] border border-slate-200/80 p-3 rounded-lg shadow-sm border-l-4 ${
                colorClasses[overlay.color]
              }`}
            >
              <p className="text-label-md font-bold">{overlay.title}</p>
              <p
                className={`text-body-md font-bold ${
                  overlay.color === "primary" ? "text-primary" : "text-tertiary"
                }`}
              >
                {overlay.votes.toLocaleString()} Votes
              </p>
              <p className="text-label-sm text-outline">
                Leading: {overlay.leader} ({overlay.percentage}%)
              </p>
            </div>
          ))}
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-[12px] border border-slate-200/80 p-4 rounded-xl max-w-xs">
          <p className="font-label-lg font-bold mb-2">Map Legend</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-label-md">High Density (90%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary-container"></div>
              <span className="text-label-md">Medium Density (50-90%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-surface-variant"></div>
              <span className="text-label-md">Reporting In Progress</span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
