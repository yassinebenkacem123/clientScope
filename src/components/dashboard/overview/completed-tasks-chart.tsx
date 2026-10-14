"use client";

import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export type TaskStatusItem = {
  id: string;
  label: string;
  count: number;
  percentage: number;
  lightColor: string;
  darkColor: string;
};

const DEFAULT_TASK_STATUSES: TaskStatusItem[] = [
  {
    id: "completed",
    label: "Completed",
    count: 65,
    percentage: 52.1,
    lightColor: "#18181b", // Deep Charcoal / Black
    darkColor: "#f4f4f5",
  },
  {
    id: "in-progress",
    label: "In Progress",
    count: 28,
    percentage: 22.8,
    lightColor: "#475569", // Medium Slate
    darkColor: "#71717a",
  },
  {
    id: "review",
    label: "Client Review",
    count: 17,
    percentage: 13.9,
    lightColor: "#60a5fa", // Sky Blue
    darkColor: "#38bdf8",
  },
  {
    id: "pending",
    label: "Pending / To Do",
    count: 14,
    percentage: 11.2,
    lightColor: "#86efac", // Mint Green
    darkColor: "#4ade80",
  },
];

type CompletedTasksChartProps = {
  title?: string;
  tasks?: TaskStatusItem[];
  className?: string;
};

export function CompletedTasksChart({
  title = "Completed Tasks",
  tasks = DEFAULT_TASK_STATUSES,
  className = "",
}: CompletedTasksChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const totalTasks = tasks.reduce((sum, item) => sum + item.count, 0);

  return (
    <section
      aria-labelledby="completed-tasks-heading"
      className={`rounded-[28px] border border-zinc-200/70 bg-white p-6 sm:p-7 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors duration-200 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none flex flex-col justify-between ${className}`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2
              id="completed-tasks-heading"
              className="text-base font-semibold tracking-tight text-slate-950 dark:text-zinc-100"
            >
              {title}
            </h2>
            <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
              Distribution across all workspace milestones
            </p>
          </div>
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {totalTasks} Tasks
          </span>
        </div>

        {/* Balanced Chart + Legend Container */}
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-7">
          {/* Well-proportioned Donut Chart Canvas */}
          <div className="relative size-48 sm:size-52 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  content={({ active, payload }) => {
                    const data = payload?.[0]?.payload as TaskStatusItem | undefined;
                    if (!active || !data) return null;

                    return (
                      <div className="rounded-xl border border-zinc-200/80 bg-white/95 px-3 py-1.5 text-xs shadow-lg backdrop-blur-md dark:border-zinc-700 dark:bg-zinc-800/95 pointer-events-none">
                        <p className="font-semibold text-slate-900 dark:text-zinc-100">
                          {data.label}
                        </p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          {data.count} tasks ({data.percentage}%)
                        </p>
                      </div>
                    );
                  }}
                />
                {/* Light Mode Donut Pie */}
                <Pie
                  data={tasks}
                  dataKey="count"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={54}
                  outerRadius={82}
                  paddingAngle={4}
                  cornerRadius={4}
                  stroke="none"
                  onMouseEnter={(_, index) => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  animationDuration={500}
                >
                  {tasks.map((entry, index) => {
                    const isHovered = hoveredIndex === index;
                    return (
                      <Cell
                        key={`cell-${entry.id}`}
                        fill={entry.lightColor}
                        className="transition-all duration-200 cursor-pointer dark:hidden"
                        style={{
                          opacity: hoveredIndex === null || isHovered ? 1 : 0.45,
                          transform: isHovered ? "scale(1.03)" : "scale(1)",
                          transformOrigin: "center center",
                        }}
                      />
                    );
                  })}
                </Pie>

                {/* Dark Mode Donut Pie */}
                <Pie
                  data={tasks}
                  dataKey="count"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={54}
                  outerRadius={82}
                  paddingAngle={4}
                  cornerRadius={4}
                  stroke="none"
                  onMouseEnter={(_, index) => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  animationDuration={500}
                >
                  {tasks.map((entry, index) => {
                    const isHovered = hoveredIndex === index;
                    return (
                      <Cell
                        key={`cell-dark-${entry.id}`}
                        fill={entry.darkColor}
                        className="hidden transition-all duration-200 cursor-pointer dark:block"
                        style={{
                          opacity: hoveredIndex === null || isHovered ? 1 : 0.45,
                          transform: isHovered ? "scale(1.03)" : "scale(1)",
                          transformOrigin: "center center",
                        }}
                      />
                    );
                  })}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Display */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold tracking-tight text-slate-950 dark:text-zinc-50">
                {hoveredIndex !== null
                  ? `${tasks[hoveredIndex].percentage}%`
                  : `${tasks[0].percentage}%`}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {hoveredIndex !== null ? tasks[hoveredIndex].label : "Completed"}
              </span>
            </div>
          </div>

          {/* Right Side Breakdown Legend */}
          <div className="flex-1 w-full space-y-4" role="list">
            {tasks.map((item, index) => {
              const isHovered = hoveredIndex === index;
              return (
                <div
                  key={item.id}
                  role="listitem"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`flex items-center justify-between gap-4 transition-colors cursor-pointer rounded-lg px-2.5 py-1.5 -mx-2 ${
                    isHovered
                      ? "bg-zinc-50 dark:bg-zinc-800/60"
                      : "hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40"
                  }`}
                >
                  {/* Left Label with colored bullet */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      aria-hidden="true"
                      className="size-2 rounded-full shrink-0"
                      style={{
                        backgroundColor: item.lightColor,
                      }}
                    />
                    <span className="text-[14px] font-normal tracking-[-0.01em] text-slate-900 dark:text-zinc-100 truncate">
                      {item.label}
                    </span>
                  </div>

                  {/* Right Percentage & Count */}
                  <div className="flex items-baseline gap-2.5 shrink-0">
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500 tabular-nums hidden sm:inline">
                      {item.count} tasks
                    </span>
                    <span className="text-[14px] font-medium tracking-tight text-slate-950 dark:text-zinc-100 tabular-nums">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
