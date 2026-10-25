"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpDown, Check, ListFilter, Plus, RotateCcw, Search, X } from "lucide-react";
import type { ClientFilterState, ClientSortOption, ClientStatus } from "./clients-data";

const subscribeToPlatform = () => () => {};
const getShortcutText = () => /Mac|iPhone|iPad|iPod/.test(navigator.userAgent) ? "⌘K" : "Ctrl+K";
const getServerShortcutText = () => "⌘K";

type ClientsSearchBarProps = {
  value?: string;
  onChange?: (value: string) => void;
  onAddClick?: () => void;
  filterState?: ClientFilterState;
  onFilterChange?: (filters: ClientFilterState) => void;
  sortOption?: ClientSortOption;
  onSortChange?: (sort: ClientSortOption) => void;
  placeholder?: string;
  className?: string;
};

const iconButtonClassName =
  "relative grid size-8.5 place-items-center rounded-xl text-zinc-500 transition-colors hover:bg-white hover:text-zinc-900 hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950/20 active:scale-95 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:focus-visible:ring-zinc-300/30";

const statusFilterOptions: { value: ClientStatus | "all"; label: string; dotClass?: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "in-progress", label: "In Progress", dotClass: "bg-[#9B8AFB] dark:bg-[#B4A7FC]" },
  { value: "complete", label: "Complete", dotClass: "bg-[#4BD37B] dark:bg-[#5FE38E]" },
  { value: "pending", label: "Pending", dotClass: "bg-[#46B5FF] dark:bg-[#68C5FF]" },
  { value: "approved", label: "Approved", dotClass: "bg-[#FBA645] dark:bg-[#FCB86B]" },
  { value: "rejected", label: "Rejected", dotClass: "bg-zinc-400 dark:bg-zinc-500" },
];

const sortOptions: { value: ClientSortOption; label: string }[] = [
  { value: "recent", label: "Recently active" },
  { value: "name-asc", label: "Client name (A → Z)" },
  { value: "name-desc", label: "Client name (Z → A)" },
  { value: "projects-desc", label: "Most active projects" },
  { value: "id-asc", label: "Client ID (Ascending)" },
];

export function ClientsSearchBar({
  value: controlledValue,
  onChange,
  onAddClick,
  filterState = { status: "all", activity: "all" },
  onFilterChange,
  sortOption = "recent",
  onSortChange,
  placeholder = "Search",
  className = "",
}: ClientsSearchBarProps) {
  const [internalValue, setInternalValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const shortcutText = useSyncExternalStore(subscribeToPlatform, getShortcutText, getServerShortcutText);

  // Dropdown popover states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const query = controlledValue !== undefined ? controlledValue : internalValue;

  const hasActiveFilters = filterState.status !== "all" || filterState.activity !== "all";
  const hasActiveSort = sortOption !== "recent";

  // Keyboard shortcut listener for Ctrl+K / ⌘K
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) ||
        (event.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA")
      ) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside listener for filter and sort menus
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsFilterOpen(false);
        setIsSortOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleInputChange(newValue: string) {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  }

  function handleClear() {
    handleInputChange("");
    inputRef.current?.focus();
  }

  function resetFilters() {
    onFilterChange?.({ status: "all", activity: "all" });
  }

  return (
    <div
      role="toolbar"
      aria-label="Client filters and search"
      className={`flex items-center justify-between gap-3 rounded-2xl bg-zinc-100/80 px-2 py-1.5 transition-colors sm:px-3 sm:py-2 dark:bg-zinc-800/40 ${className}`}
    >
      {/* Left Action Buttons: Add (+), Filter (≡), Sort (⇅) */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Add Client Button */}
        <button
          type="button"
          onClick={onAddClick}
          aria-label="Add new client"
          title="Add client"
          className={iconButtonClassName}
        >
          <Plus aria-hidden="true" className="size-4.5" strokeWidth={2} />
        </button>

        {/* Filter Popover Dropdown */}
        <div ref={filterRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setIsFilterOpen((prev) => !prev);
              setIsSortOpen(false);
            }}
            aria-label="Filter clients"
            aria-expanded={isFilterOpen}
            title={hasActiveFilters ? "Filters active" : "Filter clients"}
            className={`${iconButtonClassName} ${
              isFilterOpen || hasActiveFilters
                ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-800 dark:text-zinc-100"
                : ""
            }`}
          >
            <ListFilter aria-hidden="true" className="size-4.5" strokeWidth={1.8} />
            {hasActiveFilters ? (
              <span
                aria-hidden="true"
                className="absolute right-1.5 top-1.5 size-2 rounded-full bg-violet-600 ring-2 ring-white dark:bg-violet-400 dark:ring-zinc-900"
              />
            ) : null}
          </button>

          {isFilterOpen ? (
            <div
              role="dialog"
              aria-label="Client filter options"
              className="absolute left-0 top-11 z-30 w-56 rounded-2xl border border-zinc-200/90 bg-white p-2.5 shadow-xl backdrop-blur-md transition-all dark:border-zinc-700/80 dark:bg-zinc-800 dark:shadow-black/40"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 px-2 pb-2 dark:border-zinc-700/70">
                <span className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                  Filter by
                </span>
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-[11px] font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                  >
                    <RotateCcw aria-hidden="true" className="size-3" />
                    <span>Reset</span>
                  </button>
                ) : null}
              </div>

              {/* Status Section */}
              <div className="mt-2 space-y-1">
                <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Status
                </p>
                {statusFilterOptions.map((opt) => {
                  const isSelected = filterState.status === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        onFilterChange?.({
                          ...filterState,
                          status: opt.value,
                        })
                      }
                      className={`flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-xs transition-colors ${
                        isSelected
                          ? "bg-zinc-100 font-medium text-slate-950 dark:bg-zinc-700 dark:text-zinc-50"
                          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-700/50 dark:hover:text-zinc-100"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {opt.dotClass ? (
                          <span aria-hidden="true" className={`size-1.5 rounded-full ${opt.dotClass}`} />
                        ) : null}
                        <span>{opt.label}</span>
                      </span>
                      {isSelected ? (
                        <Check aria-hidden="true" className="size-3.5 text-violet-600 dark:text-violet-400" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {/* Activity Section */}
              <div className="mt-2.5 border-t border-zinc-100 pt-2 dark:border-zinc-700/70 space-y-1">
                <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Active Projects
                </p>
                {[
                  { value: "all", label: "All Clients" },
                  { value: "active", label: "Has Active Projects" },
                  { value: "inactive", label: "No Active Projects" },
                ].map((act) => {
                  const isSelected = filterState.activity === act.value;
                  return (
                    <button
                      key={act.value}
                      type="button"
                      onClick={() =>
                        onFilterChange?.({
                          ...filterState,
                          activity: act.value as "all" | "active" | "inactive",
                        })
                      }
                      className={`flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-xs transition-colors ${
                        isSelected
                          ? "bg-zinc-100 font-medium text-slate-950 dark:bg-zinc-700 dark:text-zinc-50"
                          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-700/50 dark:hover:text-zinc-100"
                      }`}
                    >
                      <span>{act.label}</span>
                      {isSelected ? (
                        <Check aria-hidden="true" className="size-3.5 text-violet-600 dark:text-violet-400" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        {/* Sort Popover Dropdown */}
        <div ref={sortRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setIsSortOpen((prev) => !prev);
              setIsFilterOpen(false);
            }}
            aria-label="Sort clients"
            aria-expanded={isSortOpen}
            title={hasActiveSort ? "Sort applied" : "Sort clients"}
            className={`${iconButtonClassName} ${
              isSortOpen || hasActiveSort
                ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-800 dark:text-zinc-100"
                : ""
            }`}
          >
            <ArrowUpDown aria-hidden="true" className="size-4" strokeWidth={1.8} />
            {hasActiveSort ? (
              <span
                aria-hidden="true"
                className="absolute right-1.5 top-1.5 size-2 rounded-full bg-violet-600 ring-2 ring-white dark:bg-violet-400 dark:ring-zinc-900"
              />
            ) : null}
          </button>

          {isSortOpen ? (
            <div
              role="dialog"
              aria-label="Sort options"
              className="absolute left-0 top-11 z-30 w-52 rounded-2xl border border-zinc-200/90 bg-white p-2.5 shadow-xl backdrop-blur-md transition-all dark:border-zinc-700/80 dark:bg-zinc-800 dark:shadow-black/40"
            >
              <div className="border-b border-zinc-100 px-2 pb-2 dark:border-zinc-700/70">
                <span className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                  Sort by
                </span>
              </div>

              <div className="mt-2 space-y-1">
                {sortOptions.map((opt) => {
                  const isSelected = sortOption === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onSortChange?.(opt.value);
                        setIsSortOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-xs transition-colors ${
                        isSelected
                          ? "bg-zinc-100 font-medium text-slate-950 dark:bg-zinc-700 dark:text-zinc-50"
                          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-700/50 dark:hover:text-zinc-100"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected ? (
                        <Check aria-hidden="true" className="size-3.5 text-violet-600 dark:text-violet-400" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Right Search Input Pill */}
      <div className="relative flex items-center">
        <div className="relative flex items-center">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 size-4 text-zinc-400 transition-colors dark:text-zinc-500"
            strokeWidth={1.8}
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholder}
            aria-label="Search clients"
            className="h-8.5 w-48 rounded-full border border-zinc-200/90 bg-white py-1.5 pl-9 pr-14 text-xs font-normal text-slate-900 shadow-2xs outline-none transition-all placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-950/5 dark:border-zinc-700/80 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:hover:border-zinc-600 dark:focus:border-zinc-500 sm:w-60"
          />

          {query ? (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="absolute right-2.5 grid size-4 place-items-center rounded-full text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
            >
              <X aria-hidden="true" className="size-3" strokeWidth={2} />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute right-2.5 hidden select-none rounded px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 dark:text-zinc-500 sm:inline-block">
              {shortcutText}
            </kbd>
          )}
        </div>
      </div>
    </div>
  );
}
