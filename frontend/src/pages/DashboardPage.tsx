import { useEffect, useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";

import { Button } from "../components/ui/Button";
import { SectionCard } from "../components/SectionCard";
import { useAuth } from "../contexts/AuthContext";
import { getNavigationForRole } from "../data/adminNavigation";
import { dashboardActivities } from "../data/dashboard";
import {
  mockAuditLogs,
  mockBiometricProfiles,
  mockCandidates,
  mockElections,
  mockLGAs,
  mockParties,
  mockPollingUnits,
  mockTurnoutStats,
  mockVoters,
  mockWards,
} from "../mocks/data";
import { HeroSection } from "../components/HeroSection";
import { VoteDistributionMap } from "../components/VoteDistributionMap";
import { VotingPaceChart } from "../components/VotingPaceChart";
import { TurnoutProgressChart } from "../components/TurnoutProgressChart";
import { PartyPerformanceChart } from "../components/PartyPerformanceChart";
import { LeaderCard } from "../components/LeaderCard";
import {
  SecurityMonitoringCard,
  type SecurityAlert,
} from "../components/SecurityMonitoringCard";

type CounterSnapshot = {
  votesCast: number;
  failedBiometricAttempts: number;
  duplicateVoteAttempts: number;
  lastUpdatedAt: string;
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function loadArray<T>(key: string, fallback: T[]): T[] {
  return safeParse<T[]>(localStorage.getItem(key), fallback);
}

function loadGeographyCounts() {
  const state = safeParse<{
    lgas?: unknown[];
    wards?: unknown[];
    pollingUnits?: unknown[];
  }>(localStorage.getItem("ondo-vote-geography-state"), {});
  return {
    lgas: Array.isArray(state.lgas) ? state.lgas.length : mockLGAs.length,
    wards: Array.isArray(state.wards) ? state.wards.length : mockWards.length,
    pollingUnits: Array.isArray(state.pollingUnits)
      ? state.pollingUnits.length
      : mockPollingUnits.length,
  };
}

export function DashboardPage() {
  const { user } = useAuth();
  const visibleNavigation = getNavigationForRole(user?.role);

  const [liveCounters, setLiveCounters] = useState<CounterSnapshot>({
    votesCast: mockTurnoutStats.totalVotesCast,
    failedBiometricAttempts: mockTurnoutStats.failedBiometricAttempts,
    duplicateVoteAttempts: mockTurnoutStats.duplicateVoteAttempts,
    lastUpdatedAt: new Date().toISOString(),
  });

  const elections = loadArray("ondo-vote-elections", mockElections);
  const voters = loadArray("voters", mockVoters);
  const parties = loadArray("ondo-vote-parties", mockParties);
  const candidates = loadArray("ondo-candidates", mockCandidates);
  const biometricQueue = loadArray(
    "ondo-biometric-review",
    mockBiometricProfiles,
  );
  const ballots = loadArray<{ status: "DRAFT" | "PUBLISHED" }>(
    "ondo-ballots",
    [],
  );
  const auditLogs = loadArray("ondo-audit-logs", mockAuditLogs);
  const geography = loadGeographyCounts();

  const approvedVoters = voters.filter(
    (voter) => voter.status === "APPROVED",
  ).length;
  const pendingVoters = voters.filter(
    (voter) => voter.status === "PENDING",
  ).length;
  const turnoutPercentage = Math.round(
    (liveCounters.votesCast / mockTurnoutStats.totalRegisteredVoters) * 100,
  );

  const votingPaceData = useMemo(
    () => [
      { time: "08:00", votes: 80000 },
      { time: "10:00", votes: 120000 },
      { time: "12:00", votes: 210000 },
      { time: "14:00", votes: 245000 },
      { time: "16:00", votes: 160000 },
      { time: "18:00", votes: 110000 },
    ],
    [],
  );

  const partyPerformanceData = useMemo(
    () => [
      {
        name: "APC",
        percentage: 50.4,
        votes: 945302,
        color: "primary" as const,
      },
      {
        name: "PDP",
        percentage: 42.1,
        votes: 789122,
        color: "tertiary" as const,
      },
      {
        name: "LP",
        percentage: 5.2,
        votes: 97566,
        color: "secondary" as const,
      },
      {
        name: "Others",
        percentage: 2.3,
        votes: 44297,
        color: "outline" as const,
      },
    ],
    [],
  );

  const mapOverlays = useMemo(
    () => [
      {
        title: "Akure South",
        votes: 245012,
        leader: "APC",
        percentage: 52,
        color: "primary" as const,
      },
      {
        title: "Ondo West",
        votes: 188432,
        leader: "PDP",
        percentage: 48,
        color: "tertiary" as const,
      },
    ],
    [],
  );

  const securityAlerts = useMemo(
    (): SecurityAlert[] => [
      {
        type: "warning",
        title: "Suspicious Activity",
        description: "Multiple login attempts detected in Owo Unit 04.",
        timestamp: "2 mins ago",
      },
      {
        type: "success",
        title: "Batch Verified",
        description: "Results from Ifedore LGA successfully signed to ledger.",
        timestamp: "15 mins ago",
      },
    ],
    [],
  );

  function refreshLiveCounters() {
    const votesDelta = Math.floor(Math.random() * 1200) + 200;
    const biometricDelta = Math.floor(Math.random() * 3);
    const duplicateDelta = Math.random() > 0.82 ? 1 : 0;

    setLiveCounters((current) => ({
      votesCast: Math.min(
        current.votesCast + votesDelta,
        Math.max(mockTurnoutStats.totalRegisteredVoters, current.votesCast),
      ),
      failedBiometricAttempts: current.failedBiometricAttempts + biometricDelta,
      duplicateVoteAttempts: current.duplicateVoteAttempts + duplicateDelta,
      lastUpdatedAt: new Date().toISOString(),
    }));
  }

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      refreshLiveCounters();
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-stack-lg">
      {/* Hero Section with Stats */}
      <HeroSection
        eyebrow="Ondo State Governorship Election"
        title="Admin control center for monitoring live results."
        description="Real-time telemetry from across 18 Local Government Areas. Data integrity verified by blockchain audit logs."
        stats={[
          {
            label: "Total Votes",
            value: liveCounters.votesCast.toLocaleString(),
            color: "primary",
          },
          {
            label: "Turnout",
            value: `${turnoutPercentage}%`,
            color: "tertiary",
          },
          {
            label: "Units Reporting",
            value: `3,002/3,933`,
            color: "error",
          },
        ]}
      />

      {/* Refresh Button */}
      <div>
        <Button type="button" variant="secondary" onClick={refreshLiveCounters}>
          <RefreshCcw size={16} />
          Refresh Live Metrics
        </Button>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Main Live Map */}
        <div className="lg:col-span-8 flex flex-col gap-gutter">
          <VoteDistributionMap
            mapImageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBC1hWpD2P6t1-jJrMpbcLO6YP14GUP3HTckMgpwG9YrcxNG0Ak0JOqHWjaMSV-eUjZAQ7438zyCTuNgJWjUG9rj3icY6mOVEi7dAI6V_Zndn2UvLNi3iPG1H0v5HXRSwtkra8oWO69L4P3YxPZ-cPqngqz7KTFkeUQmERWtDWQiRjMavbmkgrxRUV1dkpupOiYPoctAgOW9MRfUslr2GiV7lJmD7rxsTpaPMDOWu71F298D52AZIJW01KnXeuv-pMvR84tp0MKCNk"
            overlays={mapOverlays}
          />

          {/* Secondary Row: Performance Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <VotingPaceChart data={votingPaceData} maxVotes={250000} />
            <TurnoutProgressChart
              percentage={turnoutPercentage}
              votesCast={liveCounters.votesCast}
              totalVoters={mockTurnoutStats.totalRegisteredVoters}
            />
          </div>
        </div>

        {/* Side Analytics: Party Counts & Leaderboard */}
        <div className="lg:col-span-4 space-y-gutter">
          {/* Leader Card */}
          <LeaderCard
            candidateName="Chief Olumide Adeyemi"
            partyName="All Progressives Congress (APC)"
            votes={945302}
            percentage={50.4}
          />

          {/* Party Breakdown */}
          <PartyPerformanceChart parties={partyPerformanceData} />

          {/* Security Monitoring */}
          <SecurityMonitoringCard alerts={securityAlerts} />
        </div>
      </div>

      {/* Navigation Sections Grid */}
      <div className="pt-stack-lg border-t border-outline-variant">
        <h2 className="font-headline-md text-on-background mb-stack-lg">
          Available Modules
        </h2>
        <div className="section-grid">
          {visibleNavigation.map((item) => (
            <SectionCard item={item} key={item.path} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="p-gutter text-center border-t border-outline-variant mt-stack-lg">
        <p className="text-label-md text-outline">
          © 2024 Ondo State Independent Electoral Commission (ODIEC). All
          election data is encrypted and verified via decentralized consensus.
        </p>
      </footer>
    </div>
  );
}
