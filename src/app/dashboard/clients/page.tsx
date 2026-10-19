import type { Metadata } from "next";
import { ClientsView } from "@/components/dashboard/clients/clients-view";
import { StatCard } from "@/components/dashboard/overview/stat-card";
import { Clock, FileCheck2, FolderKanban, UsersRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Clients | ClientScope",
  description: "Client directory, contacts, and associated projects",
};

const clientStats = [
  {
    label: "Total Clients",
    value: "24",
    change: "+8.5%",
    icon: UsersRound,
    iconClassName: "text-violet-500 dark:text-violet-300",
    surfaceClassName: "bg-[#F0F0FF] dark:bg-[#24213D]",
  },
  {
    label: "Active Projects",
    value: "16",
    change: "+12.0%",
    icon: FolderKanban,
    iconClassName: "text-sky-600 dark:text-sky-300",
    surfaceClassName: "bg-[#E7F2FF] dark:bg-[#172C3F]",
  },
  {
    label: "Pending Requests",
    value: "7",
    change: "+4.1%",
    icon: Clock,
    iconClassName: "text-violet-500 dark:text-violet-300",
    surfaceClassName: "bg-[#F0F0FF] dark:bg-[#24213D]",
  },
  {
    label: "Awaiting Approvals",
    value: "4",
    change: "+2.5%",
    icon: FileCheck2,
    iconClassName: "text-sky-600 dark:text-sky-300",
    surfaceClassName: "bg-[#E7F2FF] dark:bg-[#172C3F]",
  },
] as const;

export default function ClientsPage() {
  return (
    <section aria-labelledby="clients-heading" className="space-y-6">
      <div>
        <h1
          id="clients-heading"
          className="text-2xl font-bold tracking-tight text-slate-950 dark:text-zinc-100"
        >
          Clients
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Manage your client directory, contacts, and ongoing projects.
        </p>
      </div>

      {/* Client Statistics KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {clientStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Clients Search Toolbar & Table */}
      <ClientsView />
    </section>
  );
}
