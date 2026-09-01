import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Crown,
  Zap,
  Target,
  Medal,
  IndianRupee,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: LeaderboardPage,
  head: () => ({
    meta: [
      { title: "EYFI Challenge Leaderboard" },
      {
        name: "description",
        content:
          "Earn Your First Income — Compete, earn, and climb the leaderboard with students across India.",
      },
      { property: "og:title", content: "EYFI Challenge Leaderboard" },
      {
        property: "og:description",
        content:
          "Earn Your First Income — Compete, earn, and climb the leaderboard with students across India.",
      },
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
  { id: "p1", name: "Aarav Mehta", avatar: "AM", earningsAllTime: 85000, earningsThisWeek: 18500, previousRankAllTime: 2, previousRankThisWeek: 3 },
  { id: "p2", name: "Priya Patel", avatar: "PP", earningsAllTime: 78200, earningsThisWeek: 22100, previousRankAllTime: 1, previousRankThisWeek: 1 },
  { id: "p3", name: "Rohan Gupta", avatar: "RG", earningsAllTime: 72100, earningsThisWeek: 16400, previousRankAllTime: 3, previousRankThisWeek: 2 },
  { id: "p4", name: "Neha Sharma", avatar: "NS", earningsAllTime: 68000, earningsThisWeek: 12800, previousRankAllTime: 4, previousRankThisWeek: 4 },
  { id: "p5", name: "Vikram Rao", avatar: "VR", earningsAllTime: 65400, earningsThisWeek: 14200, previousRankAllTime: 5, previousRankThisWeek: 5 },
  { id: "p6", name: "Ananya Iyer", avatar: "AI", earningsAllTime: 61200, earningsThisWeek: 11500, previousRankAllTime: 6, previousRankThisWeek: 7 },
  { id: CURRENT_USER_ID, name: "Rahul Sharma", avatar: "RS", earningsAllTime: 54800, earningsThisWeek: 15100, previousRankAllTime: 8, previousRankThisWeek: 9, isCurrentUser: true },
  { id: "p8", name: "Karthik Nair", avatar: "KN", earningsAllTime: 63300, earningsThisWeek: 9800, previousRankAllTime: 7, previousRankThisWeek: 6 },
  { id: "p9", name: "Divya Reddy", avatar: "DR", earningsAllTime: 51200, earningsThisWeek: 10500, previousRankAllTime: 9, previousRankThisWeek: 8 },
  { id: "p10", name: "Siddharth Jain", avatar: "SJ", earningsAllTime: 48700, earningsThisWeek: 8200, previousRankAllTime: 10, previousRankThisWeek: 10 },
  { id: "p11", name: "Meera Krishnan", avatar: "MK", earningsAllTime: 44500, earningsThisWeek: 7600, previousRankAllTime: 11, previousRankThisWeek: 11 },
  { id: "p12", name: "Arjun Verma", avatar: "AV", earningsAllTime: 41200, earningsThisWeek: 6900, previousRankAllTime: 12, previousRankThisWeek: 12 },
  { id: "p13", name: "Kavya Shah", avatar: "KS", earningsAllTime: 38900, earningsThisWeek: 5400, previousRankAllTime: 13, previousRankThisWeek: 14 },
  { id: "p14", name: "Aditya Singh", avatar: "AS", earningsAllTime: 35600, earningsThisWeek: 6100, previousRankAllTime: 14, previousRankThisWeek: 13 },
  { id: "p15", name: "Riya Bose", avatar: "RB", earningsAllTime: 32100, earningsThisWeek: 4800, previousRankAllTime: 15, previousRankThisWeek: 15 },
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
  const prevKey =
    filter === "allTime" ? "previousRankAllTime" : "previousRankThisWeek";

  return [...PARTICIPANTS]
    .sort((a, b) => b[key] - a[key])
    .map((p, index) => ({
      ...p,
      rank: index + 1,
      previousRank: p[prevKey],
      earnings: p[key],
    }));
}

type RankedParticipant = ReturnType<typeof getRankedParticipants>[number];

function RankMovement({ currentRank, previousRank }: { currentRank: number; previousRank: number }) {
  const delta = previousRank - currentRank;

  if (delta > 0) {
    return (
      <span
        className="inline-flex items-center gap-0.5 text-xs font-semibold text-success"
        title={`Up ${delta} ${delta === 1 ? "place" : "places"}`}
      >
        <ArrowUpRight className="h-3.5 w-3.5" />
        {delta}
      </span>
    );
  }

  if (delta < 0) {
    return (
      <span
        className="inline-flex items-center gap-0.5 text-xs font-semibold text-danger"
        title={`Down ${Math.abs(delta)} ${Math.abs(delta) === 1 ? "place" : "places"}`}
      >
        <ArrowDownRight className="h-3.5 w-3.5" />
        {Math.abs(delta)}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center text-xs font-semibold text-muted-foreground/70"
      title="No change"
    >
      <Minus className="h-3.5 w-3.5" />
    </span>
  );
}

function Avatar({
  initials,
  className,
  ringClassName,
}: {
  initials: string;
  className?: string;
  ringClassName?: string;
}) {
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-secondary font-display font-semibold text-secondary-foreground",
        ringClassName,
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
  participant: RankedParticipant;
  position: 1 | 2 | 3;
}) {
  const isFirst = position === 1;

  const medalStyles: Record<number, string> = {
    1: "border-gold/60 bg-gradient-to-b from-gold/25 via-card to-card shadow-[0_16px_44px_-14px_oklch(0.65_0.12_85/45%)]",
    2: "border-silver/70 bg-card shadow-card",
    3: "border-bronze/60 bg-card shadow-card",
  };

  const badgeStyles: Record<number, string> = {
    1: "bg-gold text-gold-foreground",
    2: "bg-silver text-silver-foreground",
    3: "bg-bronze text-bronze-foreground",
  };

  return (
    <div
      className={cn(
        "flex flex-col",
        position === 1 && "order-1 sm:order-2",
        position === 2 && "order-2 sm:order-1",
        position === 3 && "order-3"
      )}
    >
      <div
        className={cn(
          "relative flex w-full flex-col items-center rounded-2xl border px-4 pb-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated",
          medalStyles[position],
          isFirst ? "pt-8 sm:pt-10" : "pt-6 sm:pt-7"
        )}
      >
        <div
          className={cn(
            "absolute -top-3.5 grid h-7 min-w-7 place-items-center rounded-full px-2 font-display text-sm font-bold shadow-sm",
            badgeStyles[position]
          )}
        >
          {position}
        </div>

        {isFirst && (
          <div className="mb-2 flex items-center gap-1.5 text-gold-foreground">
            <Crown className="h-5 w-5" />
            <span className="text-[11px] font-bold uppercase tracking-[0.12em]">
              Challenge Leader
            </span>
          </div>
        )}

        <Avatar
          initials={participant.avatar}
          className={cn(isFirst ? "h-16 w-16 text-lg" : "h-12 w-12 text-sm")}
          ringClassName={cn(
            isFirst && "ring-4 ring-gold/40",
            position === 2 && "ring-4 ring-silver/50",
            position === 3 && "ring-4 ring-bronze/40"
          )}
        />

        <h3
          className={cn(
            "mt-3 font-display font-bold leading-tight text-foreground",
            isFirst ? "text-lg" : "text-sm sm:text-base"
          )}
        >
          {participant.name}
        </h3>

        <p
          className={cn(
            "mt-1 font-display font-bold text-foreground",
            isFirst ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"
          )}
        >
          {formatINR(participant.earnings)}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <RankMovement
            currentRank={participant.rank}
            previousRank={participant.previousRank}
          />
          <span className="text-[11px] font-medium text-muted-foreground">
            earned
          </span>
        </div>
      </div>
    </div>
  );
}

function LeaderboardRow({ participant }: { participant: RankedParticipant }) {
  return (
    <div
      className={cn(
        "group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border px-3.5 py-3 transition-all duration-200 sm:grid-cols-[3rem_minmax(0,1fr)_auto_auto] sm:gap-4 sm:px-5 sm:py-3.5",
        participant.isCurrentUser
          ? "border-primary/40 bg-primary/[0.06] shadow-[0_0_0_1px_var(--color-primary)] hover:shadow-[0_0_0_1px_var(--color-primary),0_8px_24px_-10px_oklch(0.52_0.235_264/35%)]"
          : "border-border bg-card hover:-translate-y-px hover:border-primary/25 hover:shadow-card"
      )}
    >
      <span
        className={cn(
          "grid h-9 w-9 place-items-center rounded-lg font-display text-sm font-bold sm:h-10 sm:w-10 sm:text-base",
          participant.isCurrentUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground group-hover:text-foreground"
        )}
      >
        {participant.rank}
      </span>

      <div className="flex min-w-0 items-center gap-3">
        <Avatar
          initials={participant.avatar}
          className="h-9 w-9 text-xs sm:h-10 sm:w-10 sm:text-sm"
        />
        <div className="min-w-0">
          <p className="flex items-center gap-2 truncate font-display text-[15px] font-semibold text-foreground sm:text-base">
            <span className="truncate">{participant.name}</span>
            {participant.isCurrentUser && (
              <span className="inline-flex shrink-0 items-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                You
              </span>
            )}
          </p>
          <p className="text-xs text-muted-foreground sm:hidden">
            {formatINR(participant.earnings)} earned
          </p>
        </div>
      </div>

      <p className="hidden font-display text-lg font-bold text-foreground sm:block">
        {formatINR(participant.earnings)}
      </p>

      <div className="flex justify-end sm:w-16 sm:justify-center">
        <RankMovement
          currentRank={participant.rank}
          previousRank={participant.previousRank}
        />
      </div>
    </div>
  );
}

function YourStandingCard({
  currentUser,
  nextParticipant,
  filter,
}: {
  currentUser: RankedParticipant;
  nextParticipant: RankedParticipant | undefined;
  filter: TimeFilter;
}) {
  const gap = nextParticipant
    ? nextParticipant.earnings - currentUser.earnings
    : 0;
  const leaderEarnings = nextParticipant
    ? nextParticipant.earnings
    : currentUser.earnings;
  const progress = nextParticipant
    ? Math.min(100, (currentUser.earnings / leaderEarnings) * 100)
    : 100;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar
            initials={currentUser.avatar}
            className="h-14 w-14 text-base"
            ringClassName="ring-4 ring-primary/20"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your standing
            </p>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                {formatINR(currentUser.earnings)}
              </span>
              <span className="flex items-center gap-1.5 font-display text-lg font-bold text-primary sm:text-xl">
                #{currentUser.rank}
                <RankMovement
                  currentRank={currentUser.rank}
                  previousRank={currentUser.previousRank}
                />
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {filter === "allTime" ? "Total earned this season" : "Earned this week"}
            </p>
          </div>
        </div>

        <div className="sm:w-64 sm:text-right">
          {nextParticipant ? (
            <>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground sm:justify-end">
                <Target className="h-4 w-4 text-accent" />
                {formatINR(gap)} more to reach #{currentUser.rank - 1}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Overtake {nextParticipant.name.split(" ")[0]} — one gig, sale or referral can do it.
              </p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground sm:justify-end">
              <Crown className="h-4 w-4 text-gold" />
              You&apos;re leading the challenge!
            </p>
          )}
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
            "rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 sm:px-5",
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
    <main className="min-h-screen bg-background pb-16 sm:pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <IndianRupee className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-bold leading-none text-foreground">
                EYFI
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Earn Your First Income
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            Season 3 live
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Hero */}
        <section className="pt-10 text-center sm:pt-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold text-primary">
            <Trophy className="h-3.5 w-3.5" />
            EYFI Challenge
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Challenge Leaderboard
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground sm:text-lg">
            Ranked by real income earned. Every rupee counts — climb the board
            and out-earn the competition.
          </p>
        </section>

        {/* Your standing */}
        {currentUser && (
          <section className="mt-8 sm:mt-10">
            <YourStandingCard
              currentUser={currentUser}
              nextParticipant={nextParticipant}
              filter={filter}
            />
          </section>
        )}

        {/* Leaderboard */}
        <section className="mt-10 sm:mt-12">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Medal className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">
                Top earners
              </h2>
            </div>
            <FilterTabs active={filter} onChange={setFilter} />
          </div>

          {/* Top 3 Podium */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-3 sm:items-start sm:gap-4">
            <PodiumCard participant={topThree[0]!} position={1} />
            <PodiumCard participant={topThree[1]!} position={2} />
            <PodiumCard participant={topThree[2]!} position={3} />
          </div>

          {/* Rest of leaderboard */}
          <div className="mt-8">
            <div className="mb-2 hidden grid-cols-[3rem_minmax(0,1fr)_auto_auto] gap-4 px-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:grid">
              <span>Rank</span>
              <span>Participant</span>
              <span className="text-left">Earnings</span>
              <span className="w-16 text-center">Trend</span>
            </div>
            <div className="space-y-2">
              {rest.map((participant) => (
                <LeaderboardRow key={participant.id} participant={participant} />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 border-t pt-8 text-center">
            <p className="font-display text-lg font-bold text-foreground sm:text-xl">
              Ready to climb higher?
            </p>
            <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">
              Finish your next task, close a sale or refer a friend — every
              rupee moves you up the leaderboard.
            </p>
            <button className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-primary/35 active:translate-y-0 active:scale-[0.98]">
              <Zap className="h-4 w-4" />
              Start earning
            </button>
            <p className="mt-8 pb-2 text-xs text-muted-foreground">
              EYFI · Earn Your First Income — Challenge Season 3
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
