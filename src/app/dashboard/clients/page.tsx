import type { Metadata } from "next";
import { ClientsSearchBar } from "@/components/dashboard/clients/clients-search-bar";
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

      {/* Toolbar / Search Component */}
      <ClientsSearchBar />

      {/* Empty State placeholder */}
      <div className="flex min-h-100 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 p-8 text-center dark:border-zinc-800">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Clients page is ready to be built.
        </p>
      </div>
    </section>
  );
}
