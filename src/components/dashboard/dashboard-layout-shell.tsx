"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { useSidebar } from "./sidebar-context";
import { DashboardHeader } from "./header/dashboard-header";
import { DashboardRightSidebar } from "./right-sidebar/dashboard-right-sidebar";
import { DashboardSidebar } from "./sidebar/dashboard-sidebar";
import { DEFAULT_USER, type SidebarUser } from "./sidebar/sidebar-header";

type DashboardLayoutShellProps = {
  children: React.ReactNode;
  workspaceName?: string;
  user?: SidebarUser;
};

function subscribeToDesktopBreakpoint(callback: () => void) {
  const mediaQuery = window.matchMedia("(min-width: 1280px)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getDesktopBreakpointSnapshot() {
  return window.matchMedia("(min-width: 1280px)").matches;
}

function getDesktopBreakpointServerSnapshot() {
  return true;
}

export function DashboardLayoutShell({
  children,
  workspaceName = "My Workspace",
  user = DEFAULT_USER,
}: DashboardLayoutShellProps) {
  const { isOpen } = useSidebar();
  const isDesktopViewport = useSyncExternalStore(
    subscribeToDesktopBreakpoint,
    getDesktopBreakpointSnapshot,
    getDesktopBreakpointServerSnapshot,
  );
  const [isRightDesktopOpen, setIsRightDesktopOpen] = useState(true);
  const [isRightMobileOpen, setIsRightMobileOpen] = useState(false);

  const toggleRightSidebar = useCallback(() => {
    if (isDesktopViewport) {
      setIsRightDesktopOpen((current) => !current);
      return;
    }

    setIsRightMobileOpen((current) => !current);
  }, [isDesktopViewport]);

  const closeRightMobileSidebar = useCallback(() => {
    setIsRightMobileOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F6FA] text-slate-950 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-200">
      <DashboardSidebar workspaceName={workspaceName} user={user} />
      <main
        className={`min-h-[calc(100vh-64px)] p-2 sm:p-3 lg:min-h-screen lg:py-4 lg:pr-4 transition-[padding] duration-300 ease-in-out ${
          isOpen ? "lg:pl-[312px]" : "lg:pl-4"
        }`}
      >
        <div className="flex items-start gap-4">
          {/* Main Dashboard Card */}
          <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none sm:min-h-[calc(100vh-32px)] sm:rounded-3xl transition-colors duration-200">
            <DashboardHeader
              user={user}
              isRightSidebarOpen={isDesktopViewport ? isRightDesktopOpen : isRightMobileOpen}
              onToggleRightSidebar={toggleRightSidebar}
            />
            <div className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
              {children}
            </div>
          </div>

          {/* Right Insights & Action Center Card (outside the main dashboard card) */}
          <DashboardRightSidebar
            desktopOpen={isRightDesktopOpen}
            mobileOpen={isRightMobileOpen}
            onCloseMobile={closeRightMobileSidebar}
          />
        </div>
      </main>
    </div>
  );
}
