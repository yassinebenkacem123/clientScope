"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { BrandMark, SidebarHeader, type SidebarUser } from "./sidebar-header";
import { SidebarNavigation } from "./sidebar-navigation";

type DashboardSidebarProps = {
  workspaceName: string;
  user?: SidebarUser;
};

type SidebarContentProps = DashboardSidebarProps & {
  pathname: string;
  onNavigate?: () => void;
};

function SidebarContent({ pathname, workspaceName, user, onNavigate }: SidebarContentProps) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <SidebarHeader workspaceName={workspaceName} user={user} />
      <SidebarNavigation pathname={pathname} onNavigate={onNavigate} />
    </div>
  );
}

export function DashboardSidebar({ workspaceName, user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [openPathname, setOpenPathname] = useState<string | null>(null);
  const isOpen = openPathname === pathname;
  const dialogId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const mobileDialogRef = useRef<HTMLElement>(null);

  const closeSidebar = useCallback(({ restoreFocus = true } = {}) => {
    setOpenPathname(null);
    if (restoreFocus) window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeSidebar();
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
  }, [closeSidebar, isOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <div className="flex items-center gap-2.5">
          <BrandMark />
          <span className="font-semibold tracking-[-0.02em] text-slate-950">ClientScope</span>
        </div>
        <button
          ref={menuButtonRef}
          type="button"
          aria-label="Open dashboard navigation"
          aria-expanded={isOpen}
          aria-controls={dialogId}
          onClick={() => setOpenPathname(pathname)}
          className="grid size-10 place-items-center rounded-lg text-slate-600 outline-none transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          <Menu aria-hidden="true" className="size-5" />
        </button>
      </header>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[280px] border-r border-zinc-200 bg-white lg:block">
        <SidebarContent pathname={pathname} workspaceName={workspaceName} user={user} />
      </aside>

      {isOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close dashboard navigation"
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-[1px]"
            onClick={() => closeSidebar()}
          />
          <aside
            ref={mobileDialogRef}
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-label="Dashboard navigation"
            className="relative h-full w-[min(86vw,280px)] border-r border-zinc-200 bg-white shadow-2xl shadow-zinc-950/15"
          >
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close dashboard navigation"
              onClick={() => closeSidebar()}
              className="absolute left-[calc(100%-18px)] top-4 z-30 grid size-9 place-items-center rounded-lg bg-white text-zinc-500 shadow-lg outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
            <SidebarContent
              pathname={pathname}
              workspaceName={workspaceName}
              user={user}
              onNavigate={() => closeSidebar({ restoreFocus: false })}
            />
          </aside>
        </div>
      ) : null}
    </>
  );
}
