"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  growthPeriodLabels,
  growthPeriods,
  mockGrowthData,
  type GrowthDataByPeriod,
  type GrowthMetric,
  type GrowthPeriod,
} from "./growth-overview-data";

type GrowthOverviewChartProps = {
  data?: GrowthDataByPeriod;
  status?: "ready" | "loading" | "error";
  errorMessage?: string;
};

const metricLabels: Record<GrowthMetric, string> = {
  projects: "Projects",
  clients: "Clients",
};

const shortDateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const monthFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  timeZone: "UTC",
});

const tooltipDateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function parseChartDate(value: string) {
  return new Date(`${value}T00:00:00Z`);
}

export function GrowthOverviewChart({
  data = mockGrowthData,
  status = "ready",
  errorMessage = "Growth data could not be loaded.",
}: GrowthOverviewChartProps) {
  const [metric, setMetric] = useState<GrowthMetric>("projects");
  const [period, setPeriod] = useState<GrowthPeriod>("12m");
  const points = data[period];
  const total = points.at(-1)?.[metric] ?? 0;
  const chartLabel = `${metricLabels[metric]} Growth`;
  const dateFormatter = period === "6m" || period === "12m" ? monthFormatter : shortDateFormatter;
  const maxValue = useMemo(() => {
    const highestValue = Math.max(...points.map((point) => point[metric]), 0);
    return Math.max(10, Math.ceil(highestValue / 10) * 10);
  }, [metric, points]);

  return (
    <section
      aria-labelledby="growth-chart-title"
      className="mt-6 rounded-[22px] border border-zinc-200/80 bg-white px-4 py-5 shadow-[0_4px_18px_rgba(15,23,42,0.035)] [--chart-axis:#71717a] [--chart-grid:#e4e4e7] [--chart-line:#6c5ce7] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none dark:[--chart-axis:#a1a1aa] dark:[--chart-grid:#3f3f46] dark:[--chart-line:#a78bfa] sm:px-6 sm:py-6"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p id="growth-chart-title" className="text-sm font-medium text-slate-500 dark:text-zinc-400">
            {chartLabel}
          </p>
          <div className="mt-1 flex items-end gap-2.5">
            <p className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
              {total.toLocaleString()}
            </p>
            <p className="pb-1 text-xs text-zinc-500 dark:text-zinc-400">
              total {metricLabels[metric].toLowerCase()}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div
            role="tablist"
            aria-label="Growth metric"
            className="grid grid-cols-2 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800"
          >
            {(["projects", "clients"] as const).map((item) => {
              const isSelected = metric === item;

              return (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setMetric(item)}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold outline-none transition-[background-color,color,box-shadow] focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-zinc-900 ${
                    isSelected
                      ? "bg-white text-slate-950 shadow-sm dark:bg-zinc-700 dark:text-zinc-50 dark:shadow-none"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  }`}
                >
                  {metricLabels[item]}
                </button>
              );
            })}
          </div>

          <label className="relative">
            <span className="sr-only">Growth chart date range</span>
            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value as GrowthPeriod)}
              className="h-10 w-full appearance-none rounded-xl border border-zinc-200 bg-white py-2 pl-3 pr-9 text-xs font-semibold text-zinc-700 outline-none transition-colors hover:border-zinc-300 focus-visible:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-600 dark:focus-visible:border-violet-500 dark:focus-visible:ring-violet-400/20 sm:w-36"
            >
              {growthPeriods.map((item) => (
                <option key={item} value={item}>
                  {growthPeriodLabels[item]}
                </option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
            >
              <path d="m6.5 8 3.5 3.5L13.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </label>
        </div>
      </div>

      <div className="mt-7 h-[300px] w-full sm:h-[340px]">
        {status === "loading" ? (
          <div role="status" className="flex h-full animate-pulse flex-col justify-end gap-7" aria-label="Loading growth data">
            {[72, 58, 46, 34].map((width) => (
              <div key={width} className="h-px bg-zinc-200 dark:bg-zinc-700" style={{ width: `${width}%` }} />
            ))}
          </div>
        ) : status === "error" ? (
          <div role="alert" className="grid h-full place-items-center rounded-2xl bg-rose-50 px-6 text-center dark:bg-rose-950/20">
            <div>
              <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">Unable to show growth</p>
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errorMessage}</p>
            </div>
          </div>
        ) : points.length === 0 ? (
          <div className="grid h-full place-items-center rounded-2xl bg-zinc-50 px-6 text-center dark:bg-zinc-800/60">
            <div>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">No growth data yet</p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">New {metricLabels[metric].toLowerCase()} will appear here.</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: -18 }} accessibilityLayer>
              <defs>
                <linearGradient id="growth-area-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-line)" stopOpacity={0.24} />
                  <stop offset="100%" stopColor="var(--chart-line)" stopOpacity={0.015} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="4 5" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--chart-axis)", fontSize: 11 }}
                tickMargin={14}
                minTickGap={24}
                tickFormatter={(value: string) => dateFormatter.format(parseChartDate(value))}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--chart-axis)", fontSize: 11 }}
                tickMargin={10}
                width={48}
                domain={[0, maxValue]}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ stroke: "var(--chart-line)", strokeOpacity: 0.25, strokeDasharray: "4 4" }}
                content={({ active, payload }) => {
                  const point = payload?.[0]?.payload;
                  if (!active || !point) return null;

                  return (
                    <div className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 shadow-lg dark:border-zinc-700 dark:bg-zinc-800 dark:shadow-black/30">
                      <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                        {tooltipDateFormatter.format(parseChartDate(point.date))}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-zinc-50">
                        {point[metric].toLocaleString()} {metricLabels[metric].toLowerCase()}
                      </p>
                    </div>
                  );
                }}
              />
              <Area
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke="var(--chart-line)"
                strokeWidth={2.5}
                fill="url(#growth-area-fill)"
                activeDot={{ r: 5, fill: "var(--chart-line)", stroke: "white", strokeWidth: 2 }}
                animationDuration={450}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
