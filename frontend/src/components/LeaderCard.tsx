import { Award } from "lucide-react";

type LeaderCardProps = {
  candidateName: string;
  partyName: string;
  votes: number;
  percentage: number;
  avatarUrl?: string;
};

export function LeaderCard({
  candidateName,
  partyName,
  votes,
  percentage,
  avatarUrl,
}: LeaderCardProps) {
  return (
    <div className="bg-primary rounded-xl p-gutter text-on-primary shadow-xl relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="px-3 py-1 bg-white/20 rounded-full text-label-md flex items-center gap-2 backdrop-blur-sm w-fit">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              LIVE LEADER
            </span>
          </div>
          <Award size={48} className="opacity-50" />
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-full border-4 border-on-primary/30 overflow-hidden bg-white">
            {avatarUrl ? (
              <img
                alt="Leading Candidate"
                src={avatarUrl}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-primary">
                {candidateName.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-headline-md leading-tight">{candidateName}</h3>
            <p className="text-body-md opacity-80">{partyName}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
            <p className="text-label-sm opacity-80">Votes</p>
            <p className="text-headline-sm font-bold">
              {votes.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
            <p className="text-label-sm opacity-80">Percentage</p>
            <p className="text-headline-sm font-bold">
              {percentage.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
    </div>
  );
}
