import { GlassCard } from "./GlassCard";

type VotingPaceData = {
  time: string;
  votes: number;
};

type VotingPaceChartProps = {
  data: VotingPaceData[];
  maxVotes?: number;
};

export function VotingPaceChart({
  data,
  maxVotes = 250000,
}: VotingPaceChartProps) {
  return (
    <GlassCard className="p-gutter" title="Voting Pace (Last 6 Hours)">
      <div className="h-48 flex items-end gap-2 px-2">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="flex-1 bg-surface-container rounded-t-lg relative group hover:bg-primary-container/20 transition-colors"
            style={{
              height: `${(item.votes / maxVotes) * 100}%`,
            }}
          >
            {item.votes === Math.max(...data.map((d) => d.votes)) && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-label-md font-bold text-primary bg-primary rounded-full px-2 py-1">
                {(item.votes / 1000).toFixed(0)}k
              </div>
            )}
            {item.votes !== Math.max(...data.map((d) => d.votes)) && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-label-md font-bold opacity-0 group-hover:opacity-100">
                {(item.votes / 1000).toFixed(0)}k
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4 text-label-sm text-outline px-2">
        {data.map((item, idx) => (
          <span key={idx}>{item.time}</span>
        ))}
      </div>
    </GlassCard>
  );
}
