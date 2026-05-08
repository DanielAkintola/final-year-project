import { GlassCard } from "./GlassCard";

type Party = {
  name: string;
  percentage: number;
  votes: number;
  color: "primary" | "tertiary" | "secondary" | "outline";
};

type PartyPerformanceChartProps = {
  parties: Party[];
};

const colorClasses = {
  primary: "bg-primary",
  tertiary: "bg-tertiary",
  secondary: "bg-secondary",
  outline: "bg-outline",
};

export function PartyPerformanceChart({ parties }: PartyPerformanceChartProps) {
  return (
    <GlassCard className="p-gutter" title="Party-wise Performance">
      <div className="space-y-6">
        {parties.map((party, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between text-label-md font-bold">
              <span>{party.name}</span>
              <span>{party.percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
              <div
                className={`h-full ${colorClasses[party.color]}`}
                style={{ width: `${party.percentage}%` }}
              ></div>
            </div>
            <p className="text-label-sm text-outline">
              {party.votes.toLocaleString()} Votes
            </p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
