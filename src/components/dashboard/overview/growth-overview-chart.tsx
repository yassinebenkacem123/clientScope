"use client";

import { useState } from "react";
import {
  Area,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  overviewTabData,
  type OverviewChartPoint,
  type OverviewTab,
} from "./growth-overview-data";

type GrowthOverviewChartProps = {
  initialTab?: OverviewTab;
  className?: string;
};

const TABS: Array<{ id: OverviewTab; label: string }> = [
  { id: "users", label: "Total Users" },
  { id: "projects", label: "Total Projects" },
  { id: "status", label: "Operating Status" },
];

export function GrowthOverviewChart({
  initialTab = "users",
  className = "",
}: GrowthOverviewChartProps) {
  const [activeTab, setActiveTab] = useState<OverviewTab>(initialTab);
  const currentDataset = overviewTabData[activeTab];
  const points: OverviewChartPoint[] = currentDataset.points;

  return (
    <section
      aria-label="Overview Analytics Chart"
      className={`rounded-[28px] border border-zinc-200/70 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors duration-200 [--chart-axis:#94a3b8] [--chart-dot-stroke:#ffffff] [--chart-fill:#18181b] [--chart-last-year:#93c5fd] [--chart-this-year:#18181b] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none dark:[--chart-axis:#71717a] dark:[--chart-dot-stroke:#18181b] dark:[--chart-fill:#ffffff] dark:[--chart-last-year:#60a5fa] dark:[--chart-this-year:#f4f4f5] sm:p-8 ${className}`}
    >
      {/* Top Header Row with Tabs and Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-5 sm:gap-7">
          <div className="flex items-center gap-5 sm:gap-7" role="tablist" aria-label="Chart metrics">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-sm tracking-tight transition-colors outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-400 rounded-md py-0.5 ${
                    isActive
                      ? "font-semibold text-slate-950 dark:text-zinc-50"
                      : "font-medium text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <span
            aria-hidden="true"
            className="hidden h-4 w-px bg-zinc-200 dark:bg-zinc-700 sm:block"
          />
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 text-xs font-medium text-slate-800 dark:text-zinc-200">
          <div className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-slate-900 dark:bg-zinc-100"
            />
            <span>This year</span>
          </div>

          <div className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-2 rounded-full border border-sky-400 bg-sky-200 dark:border-sky-300 dark:bg-sky-400/30"
            />
            <span>Last year</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="mt-8 h-[280px] w-full sm:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={points}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="thisYearGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-fill)" stopOpacity={0.08} />
                <stop offset="70%" stopColor="var(--chart-fill)" stopOpacity={0.02} />
                <stop offset="100%" stopColor="var(--chart-fill)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--chart-axis)", fontSize: 12, fontWeight: 500 }}
              tickMargin={14}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--chart-axis)", fontSize: 12, fontWeight: 500 }}
              tickMargin={10}
              domain={[0, 35000]}
              ticks={[0, 10000, 20000, 30000]}
              tickFormatter={(val: number) => (val === 0 ? "0" : `${val / 1000}K`)}
            />

            <Tooltip
              cursor={{
                stroke: "var(--chart-axis)",
                strokeOpacity: 0.25,
                strokeDasharray: "4 4",
              }}
              content={({ active, payload }) => {
                const point = payload?.[0]?.payload as OverviewChartPoint | undefined;
                if (!active || !point) return null;

                const diff = point.thisYear - point.lastYear;
                const percent = Math.round((diff / point.lastYear) * 100);

                return (
                  <div className="rounded-2xl border border-zinc-200/80 bg-white/95 p-3.5 shadow-xl backdrop-blur-md dark:border-zinc-700 dark:bg-zinc-800/95 dark:shadow-2xl text-xs">
                    <p className="font-semibold text-slate-900 dark:text-zinc-100">
                      {point.month} 2026
                    </p>
                    <div className="mt-2.5 space-y-1.5">
                      <div className="flex items-center justify-between gap-6">
                        <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
                          <span className="size-2 rounded-full bg-slate-900 dark:bg-zinc-100" />
                          This year
                        </span>
                        <span className="font-semibold text-slate-950 dark:text-zinc-50">
                          {point.thisYear.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-6">
                        <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
                          <span className="size-2 rounded-full bg-sky-400" />
                          Last year
                        </span>
                        <span className="font-medium text-zinc-500 dark:text-zinc-400">
                          {point.lastYear.toLocaleString()}
                        </span>
                      </div>

                      <div className="pt-1 border-t border-zinc-100 dark:border-zinc-700/60 flex items-center justify-between text-[11px]">
                        <span className="text-zinc-400">Growth</span>
                        <span
                          className={`font-semibold ${
                            percent >= 0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {percent >= 0 ? `+${percent}%` : `${percent}%`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />

            {/* This year: Smooth spline curve with subtle gradient fill */}
            <Area
              type="natural"
              dataKey="thisYear"
              name="This year"
              stroke="var(--chart-this-year)"
              strokeWidth={2}
              fill="url(#thisYearGradient)"
              dot={false}
              activeDot={{
                r: 4.5,
                fill: "var(--chart-this-year)",
                stroke: "var(--chart-dot-stroke)",
                strokeWidth: 2,
              }}
              animationDuration={500}
            />

            {/* Last year: Light blue dashed smooth spline curve */}
            <Line
              type="natural"
              dataKey="lastYear"
              name="Last year"
              stroke="var(--chart-last-year)"
              strokeWidth={1.8}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{
                r: 4,
                fill: "var(--chart-last-year)",
                stroke: "var(--chart-dot-stroke)",
                strokeWidth: 2,
              }}
              animationDuration={500}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
