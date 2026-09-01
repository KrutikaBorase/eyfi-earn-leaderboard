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

const PODIUM_META: Record<
  1 | 2 | 3,
  {
    badge: string;
    ring: string;
    bar: string;
    barHeight: string;
    label: string;
  }
> = {
  1: {
    badge: "bg-gold text-gold-foreground",
    ring: "ring-4 ring-gold/50",
    bar: "bg-gradient-to-b from-gold/30 to-gold/10 border-gold/50",
    barHeight: "h-14 sm:h-20",
    label: "text-gold-foreground",
  },
  2: {
    badge: "bg-silver text-silver-foreground",
    ring: "ring-4 ring-silver/60",
    bar: "bg-gradient-to-b from-silver/50 to-silver/15 border-silver/70",
    barHeight: "h-9 sm:h-12",
    label: "text-silver-foreground",
  },
  3: {
    badge: "bg-bronze text-bronze-foreground",
    ring: "ring-4 ring-bronze/50",
    bar: "bg-gradient-to-b from-bronze/30 to-bronze/10 border-bronze/60",
    barHeight: "h-7 sm:h-9",
    label: "text-bronze-foreground",
  },
};

function PodiumSlot({
  participant,
  position,
}: {
  participant: RankedParticipant;
  position: 1 | 2 | 3;
}) {
  const meta = PODIUM_META[position];
  const isFirst = position === 1;

  return (
    <div
      className={cn(
        "group flex min-w-0 flex-col items-center text-center",
        position === 1 && "order-1 sm:order-2",
        position === 2 && "order-2 sm:order-1",
        position === 3 && "order-3"
      )}
    >
      {/* Player info */}
      <div className="relative flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-1">
        {isFirst && (
          <Crown className="mb-1 h-5 w-5 text-gold drop-shadow-sm" />
        )}
        <div className="relative">
          <Avatar
            initials={participant.avatar}
            className={cn(
              isFirst ? "h-16 w-16 text-lg sm:h-20 sm:w-20 sm:text-xl" : "h-12 w-12 text-sm sm:h-14 sm:w-14"
            )}
            ringClassName={meta.ring}
          />
          <span
            className={cn(
              "absolute -bottom-2 left-1/2 grid h-6 min-w-6 -translate-x-1/2 place-items-center rounded-full px-1.5 font-display text-xs font-bold shadow-sm",
              meta.badge
            )}
          >
            {position}
          </span>
        </div>
        <p
          className={cn(
            "mt-3.5 max-w-full truncate font-display font-bold leading-tight text-foreground",
            isFirst ? "text-base sm:text-lg" : "text-sm"
          )}
        >
          {participant.name}
        </p>
        <p
          className={cn(
            "mt-0.5 font-display font-bold text-foreground",
            isFirst ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
          )}
        >
          {formatINR(participant.earnings)}
        </p>
        <div className="mt-1">
          <RankMovement
            currentRank={participant.rank}
            previousRank={participant.previousRank}
          />
        </div>
      </div>

      {/* Podium bar */}
      <div
        className={cn(
          "mt-3 flex w-full items-start justify-center rounded-t-xl border border-b-0 transition-all duration-300 group-hover:brightness-[1.03]",
          meta.bar,
          meta.barHeight
        )}
      >
        <span
          className={cn(
            "mt-2 font-display text-xs font-bold uppercase tracking-[0.15em]",
            meta.label
          )}
        >
          {isFirst ? "Leader" : `#${position}`}
        </span>
      </div>
    </div>
  );
}

function LeaderboardRow({ participant }: { participant: RankedParticipant }) {
  return (
    <div
      className={cn(
        "group grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border px-3 py-2.5 transition-all duration-200 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto_3.5rem] sm:gap-4 sm:px-4",
        participant.isCurrentUser
          ? "border-primary/40 bg-primary/[0.06] shadow-[0_0_0_1px_var(--color-primary)] hover:shadow-[0_0_0_1px_var(--color-primary),0_8px_24px_-10px_oklch(0.52_0.235_264/35%)]"
          : "border-border bg-card hover:-translate-y-px hover:border-primary/25 hover:shadow-card"
      )}
    >
      <span
        className={cn(
          "grid h-8 w-8 place-items-center rounded-md font-display text-sm font-bold",
          participant.isCurrentUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground group-hover:text-foreground"
        )}
      >
        {participant.rank}
      </span>

      <div className="flex min-w-0 items-center gap-2.5">
        <Avatar
          initials={participant.avatar}
          className="h-8 w-8 text-[11px] sm:h-9 sm:w-9 sm:text-xs"
        />
        <p className="flex min-w-0 items-center gap-2 font-display text-sm font-semibold text-foreground sm:text-[15px]">
          <span className="truncate">{participant.name}</span>
          {participant.isCurrentUser && (
            <span className="inline-flex shrink-0 items-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
              You
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-3 sm:contents">
        <p className="font-display text-sm font-bold text-foreground sm:text-base">
          {formatINR(participant.earnings)}
        </p>
        <div className="flex justify-end sm:justify-center">
          <RankMovement
            currentRank={participant.rank}
            previousRank={participant.previousRank}
          />
        </div>
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
    <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-4 shadow-card sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <Avatar
            initials={currentUser.avatar}
            className="h-12 w-12 text-sm"
            ringClassName="ring-4 ring-primary/20"
          />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Your Standing
            </p>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-xl font-bold text-foreground sm:text-2xl">
                {formatINR(currentUser.earnings)}
              </span>
              <span className="flex items-center gap-1.5 font-display text-base font-bold text-primary sm:text-lg">
                #{currentUser.rank}
                <RankMovement
                  currentRank={currentUser.rank}
                  previousRank={currentUser.previousRank}
                />
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {filter === "allTime" ? "Total earned" : "Earned this week"}
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
              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                One gig, sale or referral can overtake {nextParticipant.name.split(" ")[0]}.
              </p>
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
            "rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 sm:px-5",
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
    <main className="min-h-screen bg-background pb-14">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
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
          <span className="inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
            30-Day Challenge
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Hero */}
        <section className="pt-8 text-center sm:pt-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-primary">
            <Trophy className="h-3.5 w-3.5" />
            30-Day Challenge
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Challenge Leaderboard
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
            See who&apos;s earning the most. Every rupee counts.
          </p>
        </section>

        {/* Your standing */}
        {currentUser && (
          <section className="mt-6 sm:mt-8">
            <YourStandingCard
              currentUser={currentUser}
              nextParticipant={nextParticipant}
              filter={filter}
            />
          </section>
        )}

        {/* Leaderboard */}
        <section className="mt-8 sm:mt-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Medal className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-display text-lg font-bold text-foreground">
                Top earners
              </h2>
            </div>
            <FilterTabs active={filter} onChange={setFilter} />
          </div>

          {/* Animated view — re-keyed on filter for a subtle transition */}
          <div key={filter} className="animate-leaderboard-swap">
            {/* Compact podium */}
            <div className="mt-6 grid grid-cols-3 items-end gap-2 rounded-xl border bg-card/60 px-3 pb-0 pt-5 sm:gap-4 sm:px-6">
              <PodiumSlot participant={topThree[0]!} position={1} />
              <PodiumSlot participant={topThree[1]!} position={2} />
              <PodiumSlot participant={topThree[2]!} position={3} />
            </div>

            {/* Rest of leaderboard */}
            <div className="mt-5">
              <div className="mb-1.5 hidden grid-cols-[2.5rem_minmax(0,1fr)_auto_3.5rem] gap-4 px-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:grid">
                <span>Rank</span>
                <span>Participant</span>
                <span className="text-left">Earnings</span>
                <span className="text-center">Trend</span>
              </div>
              <div className="space-y-1.5">
                {rest.map((participant) => (
                  <LeaderboardRow key={participant.id} participant={participant} />
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 border-t pt-7 text-center">
            <p className="font-display text-lg font-bold text-foreground">
              Ready to climb higher?
            </p>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              Finish your next task, close a sale or refer a friend — every
              rupee moves you up the leaderboard.
            </p>
            <button className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-primary/35 active:translate-y-0 active:scale-[0.98]">
              <Zap className="h-4 w-4" />
              Start earning
            </button>
            <p className="mt-7 pb-2 text-xs text-muted-foreground">
              EYFI · Earn Your First Income — 30-Day Challenge
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
