"use client";

import {
  Bell,
  History,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRight,
  Search,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useSidebar } from "../sidebar-context";
import { DEFAULT_USER, type SidebarUser } from "../sidebar/sidebar-header";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const iconButtonClassName =
  "grid size-9 shrink-0 place-items-center rounded-lg text-zinc-500 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-zinc-300 disabled:hover:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:focus-visible:ring-zinc-400 dark:disabled:text-zinc-700 sm:size-10";

type DashboardHeaderProps = {
  user?: SidebarUser;
};

export function DashboardHeader({ user = DEFAULT_USER }: DashboardHeaderProps) {
  const { isOpen, toggleSidebar } = useSidebar();
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const shortcutRef = useRef<HTMLElement>(null);
  const currentUser = user ?? DEFAULT_USER;

  useEffect(() => {
    const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
    if (shortcutRef.current) shortcutRef.current.textContent = isMac ? "⌘K" : "Ctrl+K";

    function focusSearch(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "k" || (!event.metaKey && !event.ctrlKey)) return;

      event.preventDefault();
      searchInputRef.current?.focus();
    }

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Search results will be connected when the dashboard search service is available.
    event.preventDefault();
  }

  const toggleTitle = isOpen ? "Collapse sidebar (Ctrl+B)" : "Expand sidebar (Ctrl+B)";

  return (
    <header className="sticky top-16 z-20 border-b border-zinc-200/80 bg-white/95 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/95 transition-colors duration-200 lg:top-0">
      <div className="flex h-[72px] min-w-0 items-center gap-2.5 px-3 sm:gap-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={toggleTitle}
          title={toggleTitle}
          className="grid size-9 shrink-0 place-items-center rounded-xl border border-zinc-200/80 bg-white text-zinc-600 shadow-[0_1px_2px_rgba(15,23,42,0.03)] outline-none transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-300 dark:shadow-none dark:hover:border-zinc-700 dark:hover:bg-zinc-700/80 dark:hover:text-white dark:focus-visible:ring-zinc-400 sm:size-10"
        >
          {isOpen ? (
            <PanelLeftClose aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
          ) : (
            <PanelLeftOpen aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
          )}
        </button>

        <form className="min-w-0 flex-1" role="search" onSubmit={handleSubmit}>
          <label htmlFor="dashboard-search" className="sr-only">
            Search clients and projects
          </label>
          <div className="relative max-w-[360px]">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
              strokeWidth={1.8}
            />
            <input
              ref={searchInputRef}
              id="dashboard-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search clients, projects..."
              autoComplete="off"
              className="h-10 w-full min-w-0 rounded-xl border border-transparent bg-zinc-100 py-2 pl-10 pr-3 text-sm text-zinc-900 outline-none transition-[background-color,border-color,box-shadow] placeholder:text-zinc-400 hover:bg-zinc-100/80 focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-zinc-950/5 dark:bg-zinc-800/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:hover:bg-zinc-800 dark:focus:border-zinc-600 dark:focus:bg-zinc-800 dark:focus:ring-white/5 sm:pr-[76px]"
            />
            <kbd
              ref={shortcutRef}
              className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-md border border-zinc-200 bg-white px-1.5 py-1 font-sans text-[10px] font-medium leading-none text-zinc-500 shadow-[0_1px_1px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:shadow-none sm:block"
            >
              Ctrl+K
            </kbd>
          </div>
        </form>

        <nav aria-label="Dashboard tools" className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <ThemeToggle />
          <button
            type="button"
            disabled
            aria-label="Recent activity unavailable"
            title="Recent activity is not available yet"
            className={iconButtonClassName}
          >
            <History aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
          </button>
          <button
            type="button"
            disabled
            aria-label="Notifications unavailable"
            title="Notifications are not available yet"
            className={iconButtonClassName}
          >
            <Bell aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
          </button>
          <span aria-hidden="true" className="mx-1 hidden h-5 w-px bg-zinc-200 dark:bg-zinc-800 sm:block" />
          <button
            type="button"
            disabled
            aria-label="Right panel controls unavailable"
            title="The right dashboard panel is not configured yet"
            className={iconButtonClassName}
          >
            <PanelRight aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
          </button>
          <span aria-hidden="true" className="mx-1 h-5 w-px bg-zinc-200 dark:bg-zinc-800" />
          <div className="relative ml-0.5 shrink-0 sm:ml-1">
            <button
              type="button"
              aria-label="User profile settings"
              title={currentUser.name}
              className="relative grid size-9 place-items-center rounded-full outline-none ring-2 ring-zinc-200/80 transition-all hover:ring-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:ring-zinc-700 dark:hover:ring-zinc-500 dark:focus-visible:ring-zinc-400 sm:size-10"
            >
              {currentUser.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="size-full rounded-full object-cover"
                />
              ) : (
                <span className="grid size-full place-items-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </span>
              )}
              <span
                aria-hidden="true"
                className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-emerald-500 shadow-xs dark:border-zinc-900"
              />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
