"use client";

import { useSidebar } from "./sidebar-context";
import { DashboardHeader } from "./header/dashboard-header";
import { DashboardSidebar } from "./sidebar/dashboard-sidebar";
import { DEFAULT_USER, type SidebarUser } from "./sidebar/sidebar-header";

type DashboardLayoutShellProps = {
  children: React.ReactNode;
  workspaceName?: string;
  user?: SidebarUser;
};

export function DashboardLayoutShell({
  children,
  workspaceName = "My Workspace",
  user = DEFAULT_USER,
}: DashboardLayoutShellProps) {
  const { isOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-[#F5F6FA] text-slate-950 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-200">
      <DashboardSidebar workspaceName={workspaceName} user={user} />
      <main
        className={`min-h-[calc(100vh-64px)] p-2 sm:p-3 lg:min-h-screen lg:py-4 lg:pr-4 transition-[padding] duration-300 ease-in-out ${
          isOpen ? "lg:pl-[312px]" : "lg:pl-4"
        }`}
      >
        <div className="min-h-[calc(100vh-80px)] overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none sm:min-h-[calc(100vh-88px)] sm:rounded-3xl lg:min-h-[calc(100vh-32px)] transition-colors duration-200">
          <DashboardHeader user={user} />
          <div className="mx-auto w-full max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
