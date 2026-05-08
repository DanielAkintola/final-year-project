import { GlassCard } from "./GlassCard";

type TurnoutProgressChartProps = {
  percentage: number;
  votesCast: number;
  totalVoters: number;
};

export function TurnoutProgressChart({
  percentage,
  votesCast,
  totalVoters,
}: TurnoutProgressChartProps) {
  const circumference = 2 * Math.PI * 15.9155;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  return (
    <GlassCard className="p-gutter" title="Turnout Progress">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative w-32 h-32">
          <svg
            className="w-full h-full"
            viewBox="0 0 36 36"
            style={{ transform: "rotateZ(-90deg)" }}
          >
            <path
              className="text-surface-container"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray="100, 100"
              strokeWidth="4"
            ></path>
            <path
              className="text-primary"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray={`${percentage}, 100`}
              strokeLinecap="round"
              strokeWidth="4"
            ></path>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-headline-md font-bold">{percentage}%</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-body-md font-bold">
            {votesCast.toLocaleString()} / {totalVoters.toLocaleString()}
          </p>
          <p className="text-label-md text-outline">Registered Voters</p>
        </div>
      </div>
    </GlassCard>
  );
}
