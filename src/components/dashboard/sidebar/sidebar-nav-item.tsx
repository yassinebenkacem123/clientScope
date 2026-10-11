import Link from "next/link";
import type { NavigationItem } from "./navigation-config";

type SidebarNavItemProps = {
  item: NavigationItem;
  isActive: boolean;
  onNavigate?: () => void;
};

export function SidebarNavItem({ item, isActive, onNavigate }: SidebarNavItemProps) {
  const Icon = item.icon;

  return (
    <li>
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={isActive ? "page" : undefined}
        title={item.description}
        className={`group flex min-h-12 items-center gap-3.5 rounded-[10px] px-3 py-2 text-[15px] font-medium outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 ${
          isActive
            ? "bg-zinc-100 text-zinc-950"
            : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950"
        }`}
      >
        <Icon
          aria-hidden="true"
          className={`size-5 shrink-0 ${
            isActive ? "text-zinc-950" : "text-zinc-400 group-hover:text-zinc-700"
          }`}
          strokeWidth={1.75}
        />
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
        {typeof item.badge === "number" ? (
          <span
            aria-label={`${item.badge} new`}
            className="min-w-5 rounded-full bg-zinc-200 px-1.5 py-0.5 text-center text-[11px] font-semibold leading-4 text-zinc-700"
          >
            {item.badge}
          </span>
        ) : null}
      </Link>
    </li>
  );
}
