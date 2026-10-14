export const growthPeriods = ["7d", "30d", "6m", "12m"] as const;

export type GrowthPeriod = (typeof growthPeriods)[number];
export type GrowthMetric = "projects" | "clients";

export type GrowthDataPoint = {
  date: string;
  projects: number;
  clients: number;
};

export type GrowthDataByPeriod = Record<GrowthPeriod, GrowthDataPoint[]>;

export const growthPeriodLabels: Record<GrowthPeriod, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "6m": "Last 6 months",
  "12m": "Last 12 months",
};

// Deterministic cumulative mock data. Each range includes the opening balance
// from records created before that period and ends at the same current total.
export const mockGrowthData: GrowthDataByPeriod = {
  "7d": [
    { date: "2026-10-08", projects: 33, clients: 22 },
    { date: "2026-10-09", projects: 33, clients: 22 },
    { date: "2026-10-10", projects: 34, clients: 22 },
    { date: "2026-10-11", projects: 34, clients: 23 },
    { date: "2026-10-12", projects: 35, clients: 23 },
    { date: "2026-10-13", projects: 35, clients: 23 },
    { date: "2026-10-14", projects: 36, clients: 24 },
  ],
  "30d": [
    { date: "2026-09-15", projects: 29, clients: 19 },
    { date: "2026-09-20", projects: 30, clients: 20 },
    { date: "2026-09-25", projects: 31, clients: 20 },
    { date: "2026-09-30", projects: 32, clients: 21 },
    { date: "2026-10-05", projects: 33, clients: 22 },
    { date: "2026-10-10", projects: 34, clients: 22 },
    { date: "2026-10-14", projects: 36, clients: 24 },
  ],
  "6m": [
    { date: "2026-05-01", projects: 18, clients: 12 },
    { date: "2026-06-01", projects: 21, clients: 14 },
    { date: "2026-07-01", projects: 24, clients: 16 },
    { date: "2026-08-01", projects: 28, clients: 18 },
    { date: "2026-09-01", projects: 31, clients: 21 },
    { date: "2026-10-01", projects: 36, clients: 24 },
  ],
  "12m": [
    { date: "2025-11-01", projects: 8, clients: 5 },
    { date: "2025-12-01", projects: 10, clients: 6 },
    { date: "2026-01-01", projects: 12, clients: 8 },
    { date: "2026-02-01", projects: 14, clients: 9 },
    { date: "2026-03-01", projects: 16, clients: 11 },
    { date: "2026-04-01", projects: 18, clients: 12 },
    { date: "2026-05-01", projects: 21, clients: 14 },
    { date: "2026-06-01", projects: 24, clients: 16 },
    { date: "2026-07-01", projects: 27, clients: 18 },
    { date: "2026-08-01", projects: 30, clients: 20 },
    { date: "2026-09-01", projects: 33, clients: 22 },
    { date: "2026-10-01", projects: 36, clients: 24 },
  ],
};
