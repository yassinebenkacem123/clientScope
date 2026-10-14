import { ArrowUpRight, Calendar, CheckCircle2, Clock, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export type ProjectStatus = "in-progress" | "review" | "completed" | "approval";

export type RecentProject = {
  id: string;
  name: string;
  category: string;
  logoUrl?: string;
  logoBg: string;
  logoText: string;
  clientName: string;
  clientAvatar?: string;
  status: ProjectStatus;
  statusLabel: string;
  dueDate: string;
  timeRemaining: string;
  progressPercent: number;
};

const DEFAULT_RECENT_PROJECTS: RecentProject[] = [
  {
    id: "proj-1",
    name: "Brand Identity System",
    category: "Branding & Assets",
    logoBg: "from-blue-600 to-indigo-600",
    logoText: "BI",
    clientName: "Apex Systems",
    status: "in-progress",
    statusLabel: "In Progress",
    dueDate: "Oct 18, 2026",
    timeRemaining: "In 3 days",
    progressPercent: 70,
  },
  {
    id: "proj-2",
    name: "Fintech Mobile App",
    category: "Mobile Application",
    logoBg: "from-violet-600 to-purple-600",
    logoText: "FM",
    clientName: "Fintech Mobile LLC",
    status: "review",
    statusLabel: "Client Review",
    dueDate: "Oct 23, 2026",
    timeRemaining: "In 8 days",
    progressPercent: 85,
  },
  {
    id: "proj-3",
    name: "E-Commerce Platform",
    category: "Web Development",
    logoBg: "from-emerald-500 to-teal-600",
    logoText: "EC",
    clientName: "Nova Commerce",
    status: "approval",
    statusLabel: "Scope Sign-Off",
    dueDate: "Oct 27, 2026",
    timeRemaining: "In 12 days",
    progressPercent: 55,
  },
  {
    id: "proj-4",
    name: "Healthcare SaaS Portal",
    category: "Dashboard & Design",
    logoBg: "from-sky-500 to-blue-600",
    logoText: "HS",
    clientName: "Pulse Healthcare",
    status: "in-progress",
    statusLabel: "In Progress",
    dueDate: "Nov 04, 2026",
    timeRemaining: "In 20 days",
    progressPercent: 40,
  },
  {
    id: "proj-5",
    name: "Media Marketing Kit",
    category: "Marketing Deliverable",
    logoBg: "from-amber-500 to-orange-600",
    logoText: "MK",
    clientName: "Starlight Media",
    status: "completed",
    statusLabel: "Completed",
    dueDate: "Oct 10, 2026",
    timeRemaining: "Delivered",
    progressPercent: 100,
  },
];

type RecentProjectsTableProps = {
  title?: string;
  projects?: RecentProject[];
  className?: string;
};

function getStatusBadge(status: ProjectStatus, label: string) {
  switch (status) {
    case "in-progress":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
          <span className="size-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
          {label}
        </span>
      );
    case "review":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
          <span className="size-1.5 rounded-full bg-purple-600 dark:bg-purple-400" />
          {label}
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
          <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
          {label}
        </span>
      );
    case "approval":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
          <Clock className="size-3 text-amber-600 dark:text-amber-400" />
          {label}
        </span>
      );
  }
}

export function RecentProjectsTable({
  title = "Recent Projects",
  projects = DEFAULT_RECENT_PROJECTS,
  className = "",
}: RecentProjectsTableProps) {
  return (
    <section
      aria-labelledby="recent-projects-heading"
      className={`rounded-[28px] border border-zinc-200/70 bg-white p-6 sm:p-8 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors duration-200 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none ${className}`}
    >
      {/* Table Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2
              id="recent-projects-heading"
              className="text-base sm:text-lg font-semibold tracking-tight text-slate-950 dark:text-zinc-100"
            >
              {title}
            </h2>
            <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {projects.length} Active
            </span>
          </div>
          <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
            Current client project status, deliverables, and upcoming deadlines
          </p>
        </div>

        <Link
          href="/dashboard/projects"
          className="group inline-flex items-center gap-1.5 rounded-xl border border-zinc-200/80 bg-zinc-50/80 px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-xs transition-all hover:border-zinc-300 hover:bg-zinc-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:border-zinc-700/80 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-white dark:focus-visible:ring-zinc-400"
        >
          <span>All Projects</span>
          <ArrowUpRight
            aria-hidden="true"
            className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {/* Responsive Table Container */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-100 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
              <th scope="col" className="pb-3.5 pl-2">Project</th>
              <th scope="col" className="pb-3.5 px-4">Client</th>
              <th scope="col" className="pb-3.5 px-4">Status</th>
              <th scope="col" className="pb-3.5 px-4">Due Date</th>
              <th scope="col" className="pb-3.5 px-4 text-right">Progress</th>
              <th scope="col" className="pb-3.5 pr-2 sr-only">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-sm">
            {projects.map((project) => (
              <tr
                key={project.id}
                className="group transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40"
              >
                {/* Project Logo & Name */}
                <td className="py-4 pl-2">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-tr ${project.logoBg} text-xs font-bold text-white shadow-sm`}
                      aria-hidden="true"
                    >
                      {project.logoText}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="font-semibold text-slate-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400 transition-colors truncate block"
                      >
                        {project.name}
                      </Link>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 truncate block">
                        {project.category}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Client */}
                <td className="py-4 px-4 font-medium text-slate-800 dark:text-zinc-200">
                  <div className="flex items-center gap-2">
                    <span className="truncate">{project.clientName}</span>
                  </div>
                </td>

                {/* Status Badge */}
                <td className="py-4 px-4">
                  {getStatusBadge(project.status, project.statusLabel)}
                </td>

                {/* Due Date */}
                <td className="py-4 px-4 text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-zinc-100">
                    <Calendar className="size-3.5 text-zinc-400 dark:text-zinc-500" />
                    <span>{project.dueDate}</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500 block mt-0.5">
                    {project.timeRemaining}
                  </span>
                </td>

                {/* Progress Bar & Percentage */}
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2.5">
                    <div className="w-16 h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <div
                        style={{ width: `${project.progressPercent}%` }}
                        className={`h-full rounded-full ${
                          project.progressPercent === 100
                            ? "bg-emerald-500"
                            : project.progressPercent >= 70
                              ? "bg-blue-600 dark:bg-blue-500"
                              : "bg-violet-500"
                        }`}
                      />
                    </div>
                    <span className="text-xs font-semibold tabular-nums text-slate-900 dark:text-zinc-100 w-8 text-right">
                      {project.progressPercent}%
                    </span>
                  </div>
                </td>

                {/* Actions Button */}
                <td className="py-4 pr-2 text-right">
                  <button
                    type="button"
                    aria-label={`Options for ${project.name}`}
                    className="grid size-8 place-items-center rounded-lg text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                  >
                    <MoreHorizontal aria-hidden="true" className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
