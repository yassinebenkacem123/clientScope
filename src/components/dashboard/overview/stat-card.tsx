import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  iconClassName: string;
  surfaceClassName: string;
};

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  iconClassName,
  surfaceClassName,
}: StatCardProps) {
  return (
    <article
      className={`min-h-28 rounded-[22px] border border-transparent px-6 py-5 transition-colors dark:border-white/5 ${surfaceClassName}`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-950 dark:text-zinc-100">{label}</p>
        <Icon aria-hidden="true" className={`size-[18px] ${iconClassName}`} strokeWidth={1.8} />
      </div>

      <div className="mt-3 flex items-center gap-4 whitespace-nowrap">
        <p className="text-[26px] font-semibold leading-none tracking-[0.08em] text-slate-950 dark:text-white">
          {value}
        </p>
        <span className="ml-auto text-xs font-medium text-slate-950 dark:text-zinc-200">
          {change}
        </span>
        <TrendingUp
          aria-hidden="true"
          className="size-4 shrink-0 text-slate-950 dark:text-zinc-100"
          strokeWidth={2.2}
        />
      </div>
    </article>
  );
}
