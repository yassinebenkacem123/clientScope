import { GrowthOverviewChart } from "@/components/dashboard/overview/growth-overview-chart";
import { StatCard } from "@/components/dashboard/overview/stat-card";
import { CircleCheckBig, FolderKanban, HandCoins, UsersRound } from "lucide-react";

const overviewStats = [
  {
    label: "Total Clients",
    value: "24",
    change: "+8.5%",
    icon: UsersRound,
    iconClassName: "text-violet-500 dark:text-violet-300",
    surfaceClassName: "bg-[#F0F0FF] dark:bg-[#24213D]",
  },
  {
    label: "Total Projects",
    value: "36",
    change: "+6.2%",
    icon: FolderKanban,
    iconClassName: "text-sky-600 dark:text-sky-300",
    surfaceClassName: "bg-[#E7F2FF] dark:bg-[#172C3F]",
  },
  {
    label: "Completed Projects",
    value: "18",
    change: "+12.4%",
    icon: CircleCheckBig,
    iconClassName: "text-violet-500 dark:text-violet-300",
    surfaceClassName: "bg-[#F0F0FF] dark:bg-[#24213D]",
  },
  {
    label: "Revenue",
    value: "$48,250",
    change: "+4.8%",
    icon: HandCoins,
    iconClassName: "text-sky-600 dark:text-sky-300",
    surfaceClassName: "bg-[#E7F2FF] dark:bg-[#172C3F]",
  },
] as const;

export default function DashboardPage() {
  return (
    <section aria-labelledby="dashboard-heading">


      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <GrowthOverviewChart />
    </section>
  );
}
