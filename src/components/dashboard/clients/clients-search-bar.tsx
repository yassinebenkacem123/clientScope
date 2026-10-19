"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpDown, ListFilter, Plus, Search, X } from "lucide-react";

type ClientsSearchBarProps = {
  value?: string;
  onChange?: (value: string) => void;
  onAddClick?: () => void;
  onFilterClick?: () => void;
  onSortClick?: () => void;
  placeholder?: string;
  className?: string;
};

const iconButtonClassName =
  "grid size-8.5 place-items-center rounded-xl text-zinc-500 transition-colors hover:bg-white hover:text-zinc-900 hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950/20 active:scale-95 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:focus-visible:ring-zinc-300/30";

export function ClientsSearchBar({
  value: controlledValue,
  onChange,
  onAddClick,
  onFilterClick,
  onSortClick,
  placeholder = "Search",
  className = "",
}: ClientsSearchBarProps) {
  const [internalValue, setInternalValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [shortcutText, setShortcutText] = useState("⌘K");

  const query = controlledValue !== undefined ? controlledValue : internalValue;

  useEffect(() => {
    const isMac = typeof window !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
    setShortcutText(isMac ? "⌘K" : "Ctrl+K");

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

  return (
    <div
      role="toolbar"
      aria-label="Client filters and search"
      className={`flex items-center justify-between gap-3 rounded-2xl bg-zinc-100/80 px-2 py-1.5 transition-colors sm:px-3 sm:py-2 dark:bg-zinc-800/40 ${className}`}
    >
      {/* Left Action Buttons: Add (+), Filter (≡), Sort (⇅) */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        <button
          type="button"
          onClick={onAddClick}
          aria-label="Add new client"
          title="Add client"
          className={iconButtonClassName}
        >
          <Plus aria-hidden="true" className="size-4.5" strokeWidth={2} />
        </button>

        <button
          type="button"
          onClick={onFilterClick}
          aria-label="Filter clients"
          title="Filter clients"
          className={iconButtonClassName}
        >
          <ListFilter aria-hidden="true" className="size-4.5" strokeWidth={1.8} />
        </button>

        <button
          type="button"
          onClick={onSortClick}
          aria-label="Sort clients"
          title="Sort clients"
          className={iconButtonClassName}
        >
          <ArrowUpDown aria-hidden="true" className="size-4" strokeWidth={1.8} />
        </button>
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
