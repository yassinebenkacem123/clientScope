export type OverviewTab = "users" | "projects" | "status";

export type OverviewChartPoint = {
  month: string;
  thisYear: number;
  lastYear: number;
};

export const overviewTabData: Record<
  OverviewTab,
  {
    title: string;
    points: OverviewChartPoint[];
    unit: string;
  }
> = {
  users: {
    title: "Total Users",
    unit: "users",
    points: [
      { month: "Jan", thisYear: 11800, lastYear: 4500 },
      { month: "Feb", thisYear: 7800, lastYear: 12400 },
      { month: "Mar", thisYear: 14200, lastYear: 20500 },
      { month: "Apr", thisYear: 24600, lastYear: 6800 },
      { month: "May", thisYear: 28400, lastYear: 14800 },
      { month: "Jun", thisYear: 22800, lastYear: 24800 },
      { month: "Jul", thisYear: 24100, lastYear: 31200 },
    ],
  },
  projects: {
    title: "Total Projects",
    unit: "projects",
    points: [
      { month: "Jan", thisYear: 8400, lastYear: 5200 },
      { month: "Feb", thisYear: 12200, lastYear: 9800 },
      { month: "Mar", thisYear: 16800, lastYear: 13400 },
      { month: "Apr", thisYear: 21500, lastYear: 11200 },
      { month: "May", thisYear: 26000, lastYear: 18500 },
      { month: "Jun", thisYear: 28900, lastYear: 23100 },
      { month: "Jul", thisYear: 32400, lastYear: 27800 },
    ],
  },
  status: {
    title: "Operating Status",
    unit: "tasks",
    points: [
      { month: "Jan", thisYear: 9500, lastYear: 6200 },
      { month: "Feb", thisYear: 14800, lastYear: 11500 },
      { month: "Mar", thisYear: 18200, lastYear: 15400 },
      { month: "Apr", thisYear: 22100, lastYear: 14000 },
      { month: "May", thisYear: 25400, lastYear: 19800 },
      { month: "Jun", thisYear: 27100, lastYear: 22400 },
      { month: "Jul", thisYear: 29800, lastYear: 28500 },
    ],
  },
};
