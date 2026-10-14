"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef } from "react";
import { useSidebar } from "../sidebar-context";
import { BrandMark, SidebarHeader, type SidebarUser } from "./sidebar-header";
import { SidebarNavigation } from "./sidebar-navigation";

type DashboardSidebarProps = {
  workspaceName: string;
  user?: SidebarUser;
};

type SidebarContentProps = DashboardSidebarProps & {
  pathname: string;
  onNavigate?: () => void;
  onCollapse?: () => void;
};

function SidebarContent({
  pathname,
  workspaceName,
  user,
  onNavigate,
  onCollapse,
}: SidebarContentProps) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-white dark:bg-zinc-900 transition-colors duration-200">
      <SidebarHeader
        workspaceName={workspaceName}
        user={user}
        onCollapse={onCollapse}
      />
      <SidebarNavigation pathname={pathname} onNavigate={onNavigate} />
    </div>
  );
}

export function DashboardSidebar({ workspaceName, user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const {
    isOpen,
    isMobileOpen,
    openMobileSidebar,
    closeMobileSidebar,
    closeSidebar,
  } = useSidebar();

  const dialogId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const mobileDialogRef = useRef<HTMLElement>(null);

  // Close mobile drawer on navigation
  useEffect(() => {
    closeMobileSidebar();
  }, [pathname, closeMobileSidebar]);

  const handleCloseMobile = useCallback(() => {
    closeMobileSidebar();
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  }, [closeMobileSidebar]);

  useEffect(() => {
    if (!isMobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleCloseMobile();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = mobileDialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [handleCloseMobile, isMobileOpen]);

  return (
    <>
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900 transition-colors duration-200 lg:hidden">
        <div className="flex items-center gap-2.5">
          <BrandMark />
          <span className="font-semibold tracking-[-0.02em] text-slate-950 dark:text-zinc-100">ClientScope</span>
        </div>
        <button
          ref={menuButtonRef}
          type="button"
          aria-label="Open dashboard navigation"
          aria-expanded={isMobileOpen}
          aria-controls={dialogId}
          onClick={openMobileSidebar}
          className="grid size-10 place-items-center rounded-lg text-slate-600 outline-none transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
        >
          <Menu aria-hidden="true" className="size-5" />
        </button>
      </header>

      {/* Desktop Persistent Smoothly Collapsible Sidebar */}
      <aside
        aria-hidden={!isOpen}
        inert={!isOpen ? true : undefined}
        className={`fixed inset-y-4 left-4 z-30 hidden w-[280px] overflow-hidden rounded-3xl border border-zinc-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-all duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none lg:block ${
          isOpen
            ? "translate-x-0 opacity-100 pointer-events-auto"
            : "-translate-x-[calc(100%+32px)] opacity-0 pointer-events-none"
        }`}
      >
        <SidebarContent
          pathname={pathname}
          workspaceName={workspaceName}
          user={user}
          onCollapse={closeSidebar}
        />
      </aside>

      {/* Mobile Smooth Slide-out Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ease-in-out ${
          isMobileOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
        }`}
        aria-hidden={!isMobileOpen}
        inert={!isMobileOpen ? true : undefined}
      >
        <button
          type="button"
          tabIndex={isMobileOpen ? 0 : -1}
          aria-label="Close dashboard navigation"
          className={`absolute inset-0 bg-slate-950/35 backdrop-blur-[1px] dark:bg-black/60 transition-opacity duration-300 ease-in-out ${
            isMobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleCloseMobile}
        />
        <aside
          ref={mobileDialogRef}
          id={dialogId}
          role="dialog"
          aria-modal="true"
          aria-label="Dashboard navigation"
          className={`relative h-full w-[min(86vw,280px)] border-r border-zinc-200 bg-white shadow-2xl shadow-zinc-950/15 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-zinc-950/40 transition-transform duration-300 ease-in-out transform ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            ref={closeButtonRef}
            type="button"
            tabIndex={isMobileOpen ? 0 : -1}
            aria-label="Close dashboard navigation"
            onClick={handleCloseMobile}
            className="absolute left-[calc(100%-18px)] top-4 z-30 grid size-9 place-items-center rounded-lg bg-white text-zinc-500 shadow-lg outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:border dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white dark:focus-visible:ring-zinc-400"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
          <SidebarContent
            pathname={pathname}
            workspaceName={workspaceName}
            user={user}
            onNavigate={handleCloseMobile}
          />
        </aside>
      </div>
    </>
  );
}
