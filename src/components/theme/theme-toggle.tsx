"use client";

import { Check, Laptop, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { type Theme, useTheme } from "./theme-provider";

type ThemeToggleProps = {
  className?: string;
};

const THEME_OPTIONS: Array<{
  value: Theme;
  label: string;
  icon: typeof Sun;
}> = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
];

const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const isMounted = useMounted();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const CurrentIcon = !isMounted
    ? Moon
    : resolvedTheme === "dark"
      ? Moon
      : Sun;

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Current theme: ${theme}. Click to change theme.`}
        title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
        className={
          className ??
          "grid size-9 shrink-0 place-items-center rounded-xl border border-zinc-200/80 bg-white text-zinc-600 shadow-[0_1px_2px_rgba(15,23,42,0.03)] outline-none transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-300 dark:shadow-none dark:hover:border-zinc-700 dark:hover:bg-zinc-700/80 dark:hover:text-white dark:focus-visible:ring-zinc-400 sm:size-10"
        }
      >
        <CurrentIcon
          aria-hidden="true"
          className="size-[18px] transition-transform duration-200 hover:rotate-12"
          strokeWidth={1.8}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-label="Theme options"
          className="absolute right-0 top-full mt-2 w-36 origin-top-right rounded-xl border border-zinc-200/80 bg-white/95 p-1 shadow-lg ring-1 ring-black/5 backdrop-blur-md outline-none transition-all focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/95 dark:shadow-2xl dark:ring-white/10 z-50 animate-in fade-in-0 zoom-in-95 duration-100"
        >
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = theme === option.value;

            return (
              <button
                key={option.value}
                type="button"
                role="menuitem"
                onClick={() => {
                  setTheme(option.value);
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                className={`flex w-full items-center justify-between gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    aria-hidden="true"
                    className={`size-3.5 ${
                      isSelected
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-zinc-400 dark:text-zinc-500"
                    }`}
                    strokeWidth={2}
                  />
                  <span>{option.label}</span>
                </div>
                {isSelected && (
                  <Check
                    aria-hidden="true"
                    className="size-3.5 text-blue-600 dark:text-blue-400"
                    strokeWidth={2.5}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
