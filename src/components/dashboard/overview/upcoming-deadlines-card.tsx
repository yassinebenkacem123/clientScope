"use client";

import { Video } from "lucide-react";
import { useState } from "react";

export type ClientDeadline = {
  id: string;
  client: string;
  title: string;
  type: "meeting" | "milestone" | "approval";
  daysLeft: number;
  daysLeftText: string;
  scheduleDetails: string;
  doneCount: number;
  inProgressCount: number;
  remainingCount: number;
  segments: [number, number, number]; // [done width, in-progress width, remaining width]
};

const DEFAULT_CLIENT_DEADLINES: ClientDeadline[] = [
  {
    id: "dl-1",
    client: "Apex Systems",
    title: "Final Scope Review Call",
    type: "meeting",
    daysLeft: 1,
    daysLeftText: "1d left",
    scheduleDetails: "Tomorrow at 4:30 PM (Google Meet)",
    doneCount: 8,
    inProgressCount: 1,
    remainingCount: 1,
    segments: [26, 14, 12],
  },
  {
    id: "dl-2",
    client: "Nova Commerce",
    title: "Scope Version 2 Sign-off",
    type: "approval",
    daysLeft: 3,
    daysLeftText: "3d left",
    scheduleDetails: "Due Oct 18 • Client Acceptance",
    doneCount: 12,
    inProgressCount: 4,
    remainingCount: 2,
    segments: [38, 24, 18],
  },
  {
    id: "dl-3",
    client: "Pulse Healthcare",
    title: "Sprint 2 Demo & Feedback Meeting",
    type: "meeting",
    daysLeft: 5,
    daysLeftText: "5d left",
    scheduleDetails: "Oct 20 at 2:00 PM (Zoom Call)",
    doneCount: 6,
    inProgressCount: 2,
    remainingCount: 2,
    segments: [20, 16, 14],
  },
  {
    id: "dl-4",
    client: "Fintech Mobile",
    title: "Milestone 2 Architecture Sync",
    type: "meeting",
    daysLeft: 8,
    daysLeftText: "8d left",
    scheduleDetails: "Oct 23 at 11:00 AM • Architecture Review",
    doneCount: 16,
    inProgressCount: 5,
    remainingCount: 3,
    segments: [46, 28, 22],
  },
  {
    id: "dl-5",
    client: "Starlight Media",
    title: "Brand Assets Package Delivery",
    type: "milestone",
    daysLeft: 12,
    daysLeftText: "12d left",
    scheduleDetails: "Due Oct 27 • Assets & Design Guidelines",
    doneCount: 5,
    inProgressCount: 2,
    remainingCount: 1,
    segments: [18, 14, 12],
  },
  {
    id: "dl-6",
    client: "Hyperion AI",
    title: "Project Sign-Off & Handoff Meeting",
    type: "meeting",
    daysLeft: 16,
    daysLeftText: "16d left",
    scheduleDetails: "Oct 31 at 3:00 PM • Deliverable Review",
    doneCount: 9,
    inProgressCount: 3,
    remainingCount: 2,
    segments: [28, 20, 16],
  },
];

type UpcomingDeadlinesCardProps = {
  title?: string;
  deadlines?: ClientDeadline[];
  className?: string;
};

export function UpcomingDeadlinesCard({
  title = "Upcoming Deadlines",
  deadlines = DEFAULT_CLIENT_DEADLINES,
  className = "",
}: UpcomingDeadlinesCardProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section
      aria-labelledby="upcoming-deadlines-heading"
      className={`rounded-[28px] border border-zinc-200/70 bg-white p-7 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors duration-200 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Header with Title and Micro-Legend explaining the 3 dash lines */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2
            id="upcoming-deadlines-heading"
            className="text-base font-semibold tracking-tight text-slate-950 dark:text-zinc-100"
          >
            {title}
          </h2>

          {/* Micro-Legend explaining the 3 segments */}
          <div
            className="flex items-center gap-3 text-[11px] font-medium text-zinc-400 dark:text-zinc-500"
            aria-label="Progress segments legend: Done, In Progress, Remaining"
          >
            <span className="inline-flex items-center gap-1.5 text-slate-900 dark:text-zinc-200">
              <span
                aria-hidden="true"
                className="h-[2.5px] w-3 rounded-full bg-slate-950 dark:bg-zinc-100"
              />
              Done
            </span>
            <span className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
              <span
                aria-hidden="true"
                className="h-[2.5px] w-3 rounded-full bg-zinc-400 dark:bg-zinc-500"
              />
              In Progress
            </span>
            <span className="inline-flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
              <span
                aria-hidden="true"
                className="h-[2.5px] w-3 rounded-full bg-zinc-200 dark:bg-zinc-700"
              />
              Left
            </span>
          </div>
        </div>

        {/* Rows */}
        <div className="mt-7 space-y-6 sm:space-y-7" role="list">
          {deadlines.map((item) => {
            const isHovered = hoveredId === item.id;
            const isUrgent = item.daysLeft <= 2;
            const isMeeting = item.type === "meeting";

            return (
              <div
                key={item.id}
                role="listitem"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative flex items-center justify-between gap-3.5 transition-colors cursor-default"
              >
                {/* Left: Client Name & Meeting/Deliverable Title */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[14.5px] font-normal tracking-[-0.01em] text-slate-950 dark:text-zinc-100 truncate transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {item.client}
                    </p>
                    {isMeeting && (
                      <span
                        title="Client Meeting"
                        className="inline-flex items-center text-zinc-400 dark:text-zinc-500"
                      >
                        <Video aria-hidden="true" className="size-3" />
                      </span>
                    )}
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate hidden xl:inline">
                      &bull; {item.title}
                    </span>
                  </div>
                </div>

                {/* Right: Days Stay + Segmented 3-Bar Indicator */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Days remaining badge/text */}
                  <span
                    className={`text-[12px] tabular-nums transition-colors ${
                      isUrgent
                        ? "font-semibold text-amber-600 dark:text-amber-400"
                        : "font-medium text-zinc-400 dark:text-zinc-500"
                    }`}
                  >
                    {item.daysLeftText}
                  </span>

                  {/* 3-segmented dash indicator with explicit milestone meanings */}
                  <div
                    className="flex items-center gap-1.5 shrink-0"
                    title={`${item.doneCount} done, ${item.inProgressCount} in progress, ${item.remainingCount} left`}
                    aria-label={`${item.client}: ${item.doneCount} done, ${item.inProgressCount} in progress, ${item.remainingCount} left`}
                  >
                    {/* Segment 1: Completed Scope */}
                    <span
                      aria-hidden="true"
                      className="h-[2.5px] rounded-full bg-slate-950 transition-all duration-300 dark:bg-zinc-100"
                      style={{ width: `${item.segments[0]}px` }}
                    />
                    {/* Segment 2: In-Progress Scope */}
                    <span
                      aria-hidden="true"
                      className="h-[2.5px] rounded-full bg-zinc-400 transition-all duration-300 dark:bg-zinc-500"
                      style={{ width: `${item.segments[1]}px` }}
                    />
                    {/* Segment 3: Remaining Scope */}
                    <span
                      aria-hidden="true"
                      className="h-[2.5px] rounded-full bg-zinc-200 transition-all duration-300 dark:bg-zinc-700"
                      style={{ width: `${item.segments[2]}px` }}
                    />
                  </div>
                </div>

                {/* Interactive Tooltip on Hover with Full Meaning */}
                {isHovered && (
                  <div
                    role="tooltip"
                    className="absolute -top-10 right-0 z-20 rounded-xl border border-zinc-200/80 bg-white/95 px-3 py-1.5 text-[11px] shadow-xl backdrop-blur-md dark:border-zinc-700 dark:bg-zinc-800/95 pointer-events-none animate-in fade-in-0 zoom-in-95 duration-100"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-zinc-100">
                        {item.title}
                      </span>
                      <span className="text-zinc-300 dark:text-zinc-600">|</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        {item.doneCount} done
                      </span>
                      <span className="text-zinc-300 dark:text-zinc-600">&bull;</span>
                      <span className="font-medium text-zinc-500 dark:text-zinc-400">
                        {item.inProgressCount} in progress
                      </span>
                      <span className="text-zinc-300 dark:text-zinc-600">&bull;</span>
                      <span className="font-medium text-zinc-400 dark:text-zinc-500">
                        {item.remainingCount} left
                      </span>
                      <span className="text-zinc-300 dark:text-zinc-600">|</span>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {item.scheduleDetails}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
