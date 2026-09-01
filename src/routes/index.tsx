import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  Zap,
  ChevronRight,
  Award,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: LeaderboardPage,
  head: () => ({
    meta: [
      { title: "EYFI Challenge Leaderboard" },
      { name: "description", content: "Earn Your First Income — Compete, earn, and climb the leaderboard with students across India." },
      { property: "og:title", content: "EYFI Challenge Leaderboard" },
      { property: "og:description", content: "Earn Your First Income — Compete, earn, and climb the leaderboard with students across India." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type TimeFilter = "allTime" | "thisWeek";

type Participant = {
  id: string;
  name: string;
  avatar: string;
  earningsAllTime: number;
  earningsThisWeek: number;
  previousRankAllTime: number;
  previousRankThisWeek: number;
  isCurrentUser?: boolean;
};

const CURRENT_USER_ID = "current-user";

const PARTICIPANTS: Participant[] = [
  {
    id: "p1",
    name: "Aarav Mehta",
    avatar: "AM",
    earningsAllTime: 85000,
    earningsThisWeek: 18500,
    previousRankAllTime: 2,
    previousRankThisWeek: 3,
  },
  {
    id: "p2",
    name: "Priya Patel",
    avatar: "PP",
    earningsAllTime: 78200,
    earningsThisWeek: 22100,
    previousRankAllTime: 1,
    previousRankThisWeek: 1,
  },
  {
    id: "p3",
    name: "Rohan Gupta",
    avatar: "RG",
    earningsAllTime: 72100,
    earningsThisWeek: 16400,
    previousRankAllTime: 3,
    previousRankThisWeek: 2,
  },
  {
    id: "p4",
    name: "Neha Sharma",
    avatar: "NS",
    earningsAllTime: 68000,
    earningsThisWeek: 12800,
    previousRankAllTime: 4,
    previousRankThisWeek: 4,
  },
  {
    id: "p5",
    name: "Vikram Rao",
    avatar: "VR",
    earningsAllTime: 65400,
    earningsThisWeek: 14200,
    previousRankAllTime: 5,
    previousRankThisWeek: 5,
  },
  {
    id: "p6",
    name: "Ananya Iyer",
    avatar: "AI",
    earningsAllTime: 61200,
    earningsThisWeek: 11500,
    previousRankAllTime: 6,
    previousRankThisWeek: 7,
  },
  {
    id: CURRENT_USER_ID,
    name: "Rahul Sharma",
    avatar: "RS",
    earningsAllTime: 54800,
    earningsThisWeek: 15100,
    previousRankAllTime: 8,
    previousRankThisWeek: 9,
    isCurrentUser: true,
  },
  {
    id: "p8",
    name: "Karthik Nair",
    avatar: "KN",
    earningsAllTime: 63300,
    earningsThisWeek: 9800,
    previousRankAllTime: 7,
    previousRankThisWeek: 6,
  },
  {
    id: "p9",
    name: "Divya Reddy",
    avatar: "DR",
    earningsAllTime: 51200,
    earningsThisWeek: 10500,
    previousRankAllTime: 9,
    previousRankThisWeek: 8,
  },
  {
    id: "p10",
    name: "Siddharth Jain",
    avatar: "SJ",
    earningsAllTime: 48700,
    earningsThisWeek: 8200,
    previousRankAllTime: 10,
    previousRankThisWeek: 10,
  },
  {
    id: "p11",
    name: "Meera Krishnan",
    avatar: "MK",
    earningsAllTime: 44500,
    earningsThisWeek: 7600,
    previousRankAllTime: 11,
    previousRankThisWeek: 11,
  },
  {
    id: "p12",
    name: "Arjun Verma",
    avatar: "AV",
    earningsAllTime: 41200,
    earningsThisWeek: 6900,
    previousRankAllTime: 12,
    previousRankThisWeek: 12,
  },
  {
    id: "p13",
    name: "Kavya Shah",
    avatar: "KS",
    earningsAllTime: 38900,
    earningsThisWeek: 5400,
    previousRankAllTime: 13,
    previousRankThisWeek: 14,
  },
  {
    id: "p14",
    name: "Aditya Singh",
    avatar: "AS",
    earningsAllTime: 35600,
    earningsThisWeek: 6100,
    previousRankAllTime: 14,
    previousRankThisWeek: 13,
  },
  {
    id: "p15",
    name: "Riya Bose",
    avatar: "RB",
    earningsAllTime: 32100,
    earningsThisWeek: 4800,
    previousRankAllTime: 15,
    previousRankThisWeek: 15,
  },
];

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getRankedParticipants(filter: TimeFilter) {
  const key = filter === "allTime" ? "earningsAllTime" : "earningsThisWeek";
  const prevKey = filter === "allTime" ? "previousRankAllTime" : "previousRankThisWeek";

  return [...PARTICIPANTS]
    .sort((a, b) => b[key] - a[key])
    .map((p, index) => ({
      ...p,
      rank: index + 1,
      previousRank: p[prevKey],
      earnings: p[key],
    }));
}

function RankMovement({ currentRank, previousRank }: { currentRank: number; previousRank: number }) {
  const delta = previousRank - currentRank;

  if (delta > 0) {
    return (
      <div className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
        <TrendingUp className="h-3 w-3" />
        <span>{delta}</span>
      </div>
    );
  }

  if (delta < 0) {
    return (
      <div className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2 py-0.5 text-xs font-semibold text-danger">
        <TrendingDown className="h-3 w-3" />
        <span>{Math.abs(delta)}</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
      <Minus className="h-3 w-3" />
      <span>0</span>
    </div>
  );
}

function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-secondary font-display font-semibold text-secondary-foreground",
        className
      )}
    >
      {initials}
    </div>
  );
}

function PodiumCard({
  participant,
  position,
}: {
  participant: ReturnType<typeof getRankedParticipants>[number];
  position: 1 | 2 | 3;
}) {
  const medalStyles = {
    1: "bg-gradient-to-b from-gold/80 to-gold border-gold/50 shadow-[0_12px_40px_-12px_oklch(0.65_0.12_85/40%)]",
    2: "bg-gradient-to-b from-silver/80 to-silver border-silver/50 shadow-[0_12px_40px_-12px_oklch(0.55_0.03_250/35%)]",
    3: "bg-gradient-to-b from-bronze/80 to-bronze border-bronze/50 shadow-[0_12px_40px_-12px_oklch(0.55_0.08_55/35%)]",
  };

  const heightClass = {
    1: "order-2 z-10 scale-105",
    2: "order-1",
    3: "order-3",
  };

  const icon = position === 1 ? <Crown className="h-5 w-5" /> : <Award className="h-5 w-5" />;

  return (
    <div className={cn("flex flex-col items-center", heightClass[position])}>
      <div
        className={cn(
          "relative flex w-full flex-col items-center rounded-2xl border p-5 text-center transition-transform hover:-translate-y-1",
          medalStyles[position]
        )}
      >
        <div className="absolute -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-card text-foreground shadow-sm">
          <span className="font-display text-sm font-bold">{position}</span>
        </div>
        <div className="mb-3 mt-2 text-gold-foreground/80">{icon}</div>
        <Avatar initials={participant.avatar} className="h-14 w-14 text-base" />
        <h3 className="mt-3 line-clamp-1 font-display text-lg font-bold text-gold-foreground">
          {participant.name}
        </h3>
        <p className="mt-1 font-display text-2xl font-bold text-gold-foreground">
          {formatINR(participant.earnings)}
        </p>
        <p className="mt-1 text-xs font-medium text-gold-foreground/70">Rank #{position}</p>
      </div>
    </div>
  );
}

function LeaderboardRow({
  participant,
}: {
  participant: ReturnType<typeof getRankedParticipants>[number];
}) {
  return (
    <div
      className={cn(
        "group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border px-4 py-3 transition-all sm:grid-cols-[3rem_minmax(0,1fr)_auto_auto] sm:gap-4 sm:px-5 sm:py-4",
        participant.isCurrentUser
          ? "border-primary/30 bg-primary/5 shadow-[0_0_0_1px_var(--color-primary)]"
          : "border-border bg-card hover:border-primary/20 hover:bg-secondary/50"
      )}
    >
      <div className="flex items-center gap-3 sm:block">
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg font-display text-sm font-bold sm:h-10 sm:w-10 sm:rounded-xl sm:text-base",
            participant.rank <= 3
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {participant.rank}
        </span>
      </div>

      <div className="flex min-w-0 items-center gap-3">
        <Avatar initials={participant.avatar} className="h-9 w-9 text-sm sm:h-11 sm:w-11" />
        <div className="min-w-0">
          <p className="truncate font-display text-base font-semibold text-foreground sm:text-lg">
            {participant.name}
            {participant.isCurrentUser && (
              <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                You
              </span>
            )}
          </p>
          <p className="text-xs text-muted-foreground sm:hidden">
            {participant.rank === 1 ? "Leader" : `${formatINR(participant.earnings)} earned`}
          </p>
        </div>
      </div>

      <div className="hidden text-right sm:block">
        <p className="font-display text-lg font-bold text-foreground">
          {formatINR(participant.earnings)}
        </p>
        <p className="text-xs text-muted-foreground">earned</p>
      </div>

      <div className="flex flex-col items-end gap-1 sm:items-center sm:justify-center">
        <RankMovement currentRank={participant.rank} previousRank={participant.previousRank} />
      </div>
    </div>
  );
}

function MotivationalCard({
  currentUser,
  nextParticipant,
}: {
  currentUser: ReturnType<typeof getRankedParticipants>[number] | undefined;
  nextParticipant: ReturnType<typeof getRankedParticipants>[number] | undefined;
}) {
  if (!currentUser || !nextParticipant) return null;

  const gap = nextParticipant.earnings - currentUser.earnings;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-primary p-5 text-primary-foreground shadow-elevated sm:p-6">
      <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/15 backdrop-blur-sm">
          <Flame className="h-6 w-6 text-accent" />
        </div>
        <div>
          <p className="font-display text-lg font-bold sm:text-xl">
            You&apos;re {formatINR(gap)} away from overtaking {nextParticipant.name.split(" ")[0]}
          </p>
          <p className="mt-1 text-sm text-primary-foreground/80">
            One more project or referral could push you to rank #{currentUser.rank - 1}. Keep the momentum going!
          </p>
        </div>
      </div>
    </div>
  );
}

function FilterTabs({
  active,
  onChange,
}: {
  active: TimeFilter;
  onChange: (filter: TimeFilter) => void;
}) {
  return (
    <div className="inline-flex rounded-full border bg-card p-1 shadow-sm">
      {(["allTime", "thisWeek"] as TimeFilter[]).map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={cn(
            "relative rounded-full px-4 py-2 text-sm font-semibold transition-all sm:px-5",
            active === filter
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {filter === "allTime" ? "All Time" : "This Week"}
        </button>
      ))}
    </div>
  );
}

function LeaderboardPage() {
  const [filter, setFilter] = useState<TimeFilter>("allTime");
  const ranked = useMemo(() => getRankedParticipants(filter), [filter]);
  const topThree = ranked.slice(0, 3);
  const rest = ranked.slice(3);
  const currentUser = ranked.find((p) => p.isCurrentUser);
  const nextParticipant = currentUser
    ? ranked.find((p) => p.rank === currentUser.rank - 1)
    : undefined;

  return (
    <main className="min-h-screen bg-background pb-12 sm:pb-16">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-bold leading-none text-foreground">EYFI</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Earn Your First Income
              </p>
            </div>
          </div>
          <a
            href="#leaderboard"
            className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 sm:text-sm"
          >
            View challenge
            <ChevronRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-10 sm:pt-14">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-5xl text-center sm:px-6">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary sm:text-sm">
            <Trophy className="h-3.5 w-3.5" />
            <span>Season 3 is live</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            EYFI Challenge
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
            Compete with thousands of students across India. Earn real income, climb the ranks, and prove your hustle.
          </p>

          {/* Current user stats */}
          {currentUser && (
            <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3">
              <div className="rounded-2xl border bg-card p-5 text-left shadow-card sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Your earnings
                </p>
                <p className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
                  {formatINR(currentUser.earnings)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {filter === "allTime" ? "Lifetime income" : "Earned this week"}
                </p>
              </div>
              <div className="rounded-2xl border bg-card p-5 text-left shadow-card sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Current rank
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                    #{currentUser.rank}
                  </p>
                  <RankMovement
                    currentRank={currentUser.rank}
                    previousRank={currentUser.previousRank}
                  />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {currentUser.rank === 1
                    ? "You are leading!"
                    : `Top ${Math.round((currentUser.rank / ranked.length) * 100)}% of participants`}
                </p>
              </div>
              <div className="rounded-2xl border bg-card p-5 text-left shadow-card sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Participants
                </p>
                <p className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
                  {ranked.length.toLocaleString("en-IN")}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Active this season</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Leaderboard */}
      <section id="leaderboard" className="mx-auto max-w-5xl px-4 pt-12 sm:px-6 sm:pt-16">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              Leaderboard
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              See where you stand among the top earners.
            </p>
          </div>
          <FilterTabs active={filter} onChange={setFilter} />
        </div>

        {/* Top 3 Podium */}
        <div className="mt-8 grid grid-cols-3 items-end gap-3 sm:mt-10 sm:gap-5">
          <PodiumCard participant={topThree[1]!} position={2} />
          <PodiumCard participant={topThree[0]!} position={1} />
          <PodiumCard participant={topThree[2]!} position={3} />
        </div>

        {/* Motivational message */}
        <div className="mt-6 sm:mt-8">
          <MotivationalCard currentUser={currentUser} nextParticipant={nextParticipant} />
        </div>

        {/* Rest of leaderboard */}
        <div className="mt-8 sm:mt-10">
          <div className="mb-3 hidden grid-cols-[3rem_minmax(0,1fr)_auto_auto] gap-4 px-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:grid">
            <span>Rank</span>
            <span>Participant</span>
            <span className="text-right">Earnings</span>
            <span className="text-center">Movement</span>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {rest.map((participant) => (
              <LeaderboardRow key={participant.id} participant={participant} />
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-10 rounded-2xl border bg-card p-6 text-center shadow-card sm:mt-12 sm:p-8">
          <h3 className="font-display text-xl font-bold text-foreground sm:text-2xl">
            Ready to move up?
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
            Complete your next task, refer a friend, or submit a project to climb higher on the leaderboard.
          </p>
          <button className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/30 active:scale-[0.98]">
            <Zap className="h-4 w-4" />
            Start earning now
          </button>
        </div>
      </section>
    </main>
  );
}
