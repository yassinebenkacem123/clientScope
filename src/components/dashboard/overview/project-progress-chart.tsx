"use client";

import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

export type ProjectProgressDataPoint = {
  id: string;
  projectName: string;
  client: string;
  completed: number;
  inProgress: number;
  notStarted: number;
  badgeValue: string;
};

const DEFAULT_PROJECT_PROGRESS: ProjectProgressDataPoint[] = [
  {
    id: "proj-1",
    projectName: "Brand Identity",
    client: "Apex Systems",
    completed: 3.5,
    inProgress: 1.5,
    notStarted: 1.5,
    badgeValue: "70%",
  },
  {
    id: "proj-2",
    projectName: "Fintech App",
    client: "Fintech Mobile",
    completed: 4.5,
    inProgress: 3.5,
    notStarted: 4.0,
    badgeValue: "85%",
  },
  {
    id: "proj-3",
    projectName: "E-Commerce",
    client: "Nova Commerce",
    completed: 3.0,
    inProgress: 2.5,
    notStarted: 2.0,
    badgeValue: "75%",
  },
  {
    id: "proj-4",
    projectName: "SaaS Portal",
    client: "Pulse Health",
    completed: 6.0,
    inProgress: 4.0,
    notStarted: 4.0,
    badgeValue: "14 tasks",
  },
  {
    id: "proj-5",
    projectName: "Marketing Site",
    client: "Starlight Media",
    completed: 5.5,
    inProgress: 3.5,
    notStarted: 2.5,
    badgeValue: "243K",
  },
  {
    id: "proj-6",
    projectName: "Design System",
    client: "Hyperion AI",
    completed: 4.0,
    inProgress: 2.5,
    notStarted: 6.5,
    badgeValue: "13 tasks",
  },
  {
    id: "proj-7",
    projectName: "Mobile UI Kit",
    client: "Zenith Retail",
    completed: 5.5,
    inProgress: 3.2,
    notStarted: 5.3,
    badgeValue: "14 tasks",
  },
];

type ProjectProgressChartProps = {
  title?: string;
  data?: ProjectProgressDataPoint[];
  className?: string;
};

const MAX_SCALE = 16;
const Y_AXIS_TICKS = [15, 10, 5, 0];

export function ProjectProgressChart({
  title = "Project Progress",
  data = DEFAULT_PROJECT_PROGRESS,
  className = "",
}: ProjectProgressChartProps) {
  // Set default active to "proj-5" (or first item)
  const [activeId, setActiveId] = useState<string>("proj-5");

  return (
    <section
      aria-labelledby="project-progress-heading"
      className={`rounded-[28px] border border-zinc-200/70 bg-white p-6 sm:p-8 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors duration-200 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none ${className}`}
    >
      {/* Top Header Row with Title, Legend & Options Menu */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-5 sm:gap-8">
          <div>
            <h2
              id="project-progress-heading"
              className="text-base font-semibold tracking-tight text-slate-950 dark:text-zinc-100"
            >
              {title}
            </h2>
          </div>

          {/* 3-Color Legend */}
          <div
            className="flex items-center gap-4 sm:gap-6 text-xs font-medium text-slate-800 dark:text-zinc-200"
            aria-label="Progress status legend"
          >
            <div className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full bg-[#4F8BFF] dark:bg-blue-500"
              />
              <span>Completed</span>
            </div>

            <div className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full bg-[#B4A5F5] dark:bg-violet-400"
              />
              <span>In Progress</span>
            </div>

            <div className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full bg-[#E8EEF5] dark:bg-zinc-700"
              />
              <span className="text-zinc-500 dark:text-zinc-400">Not Started</span>
            </div>
          </div>
        </div>

        {/* Top Right Actions Menu Button */}
        <button
          type="button"
          aria-label="More chart options"
          className="grid size-8 place-items-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 dark:focus-visible:ring-zinc-400"
        >
          <MoreHorizontal aria-hidden="true" className="size-4" />
        </button>
      </div>

      {/* Main Canvas with Y-Axis and Rounded Progress Boxes */}
      <div className="mt-8 flex gap-3 sm:gap-6">
        {/* Left Y-Axis */}
        <div className="flex flex-col justify-between pb-8 pt-9 text-right select-none">
          {Y_AXIS_TICKS.map((tick) => (
            <span
              key={tick}
              className="text-xs font-medium tabular-nums text-zinc-400 dark:text-zinc-500"
            >
              {tick}
            </span>
          ))}
        </div>

        {/* Columns Container */}
        <div className="relative flex flex-1 items-end justify-between gap-2 overflow-x-auto pb-1 pt-9 sm:gap-4 sm:justify-around">
          {data.map((item) => {
            const total = item.completed + item.inProgress + item.notStarted;
            const heightPercent = Math.min(100, Math.max(15, (total / MAX_SCALE) * 100));
            const completedRatio = (item.completed / total) * 100;
            const inProgressRatio = (item.inProgress / total) * 100;
            const notStartedRatio = (item.notStarted / total) * 100;
            const isSelected = activeId === item.id;

            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => setActiveId(item.id)}
                onMouseEnter={() => setActiveId(item.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActiveId(item.id);
                  }
                }}
                className="group relative flex flex-col items-center outline-none cursor-pointer"
              >
                {/* Floating Black Pill Badge (matching "243K" in the reference image) */}
                <div
                  className={`absolute -top-9 z-10 transition-all duration-200 ${
                    isSelected
                      ? "opacity-100 scale-100 -translate-y-1"
                      : "opacity-0 scale-95 translate-y-1 pointer-events-none"
                  }`}
                >
                  <span className="inline-block whitespace-nowrap rounded-full bg-[#18181b] px-3 py-1 text-xs font-semibold tracking-tight text-white shadow-md dark:bg-white dark:text-zinc-950">
                    {item.badgeValue}
                  </span>
                </div>

                {/* The Progress Box with the exact heavily-rounded capsule/squircle shape */}
                <div className="flex h-[220px] sm:h-[260px] w-12 sm:w-16 items-end justify-center">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`relative flex w-full flex-col justify-end overflow-hidden rounded-[20px] sm:rounded-[24px] transition-all duration-300 ${
                      isSelected
                        ? "ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/10"
                        : "group-hover:opacity-95"
                    }`}
                  >
                    {/* Top Segment: Not Started (Soft Gray) */}
                    <div
                      style={{ height: `${notStartedRatio}%` }}
                      className="w-full bg-[#E8EEF5] transition-colors dark:bg-zinc-800"
                    />

                    {/* Middle Segment: In Progress (Lavender / Purple) */}
                    <div
                      style={{ height: `${inProgressRatio}%` }}
                      className="w-full bg-[#B4A5F5] transition-colors dark:bg-violet-400"
                    />

                    {/* Bottom Segment: Completed (Vibrant Blue) */}
                    <div
                      style={{ height: `${completedRatio}%` }}
                      className="w-full bg-[#4F8BFF] transition-colors dark:bg-blue-500"
                    />
                  </div>
                </div>

                {/* X-Axis Label */}
                <span
                  className={`mt-3 block text-center text-xs transition-colors truncate max-w-[68px] sm:max-w-[80px] ${
                    isSelected
                      ? "font-semibold text-slate-900 dark:text-zinc-100"
                      : "font-normal text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"
                  }`}
                >
                  {item.projectName}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
