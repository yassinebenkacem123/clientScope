"use client";

import Link from "next/link";
import {
  CalendarClock,
  CalendarDays,
  Check,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  FileSignature,
  FileText,
  MessageSquareText,
  Send,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, type ReactNode } from "react";
import {
  mockActionCenterItems,
  mockPriorityClients,
  mockRecentActivityItems,
  type ActionCenterItem as ActionCenterItemData,
  type ActionKind,
  type ActivityKind,
  type ClientStatusTone,
  type PriorityClient as PriorityClientData,
  type RecentActivityItem as RecentActivityItemData,
} from "./right-sidebar-data";

type DashboardRightSidebarProps = {
  desktopOpen: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  actions?: ActionCenterItemData[];
  activities?: RecentActivityItemData[];
  clients?: PriorityClientData[];
  isLoading?: boolean;
  errorMessage?: string;
};

const actionIcons: Record<ActionKind, { icon: LucideIcon; className: string }> = {
  scope: {
    icon: FileText,
    className: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300",
  },
  invoice: {
    icon: CircleAlert,
    className: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300",
  },
  message: {
    icon: MessageSquareText,
    className: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300",
  },
  deadline: {
    icon: CalendarClock,
    className: "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300",
  },
};

const activityIcons: Record<ActivityKind, LucideIcon> = {
  approval: Check,
  proposal: Send,
  milestone: CircleCheck,
  meeting: CalendarDays,
  contract: FileSignature,
};

const statusDotClasses: Record<ClientStatusTone, string> = {
  emerald: "bg-emerald-500 dark:bg-emerald-400",
  amber: "bg-amber-500 dark:bg-amber-400",
  blue: "bg-blue-500 dark:bg-blue-400",
  violet: "bg-violet-500 dark:bg-violet-400",
  rose: "bg-rose-500 dark:bg-rose-400",
};

const avatarClasses = [
  "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
];

function OptionalLink({ href, children, className }: { href?: string; children: ReactNode; className: string }) {
  if (!href) return <div className={className}>{children}</div>;

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function SectionHeading({ title, badge }: { title: string; badge?: number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-slate-950 dark:text-zinc-100">{title}</h2>
        {badge !== undefined && badge > 0 ? (
          <span className="grid min-w-5 place-items-center rounded-full bg-violet-600 px-1.5 py-0.5 text-[10px] font-semibold leading-4 text-white dark:bg-violet-500 dark:text-white">
            {badge}
          </span>
        ) : null}
      </div>
      <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">View all →</span>
    </div>
  );
}

function NotificationItem({ item }: { item: ActionCenterItemData }) {
  const config = actionIcons[item.kind];
  const Icon = config.icon;

  return (
    <OptionalLink
      href={item.href}
      className="group flex min-w-0 items-start gap-3 rounded-2xl px-2 py-2.5 outline-none transition-colors hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-violet-500 dark:hover:bg-zinc-800/70 dark:focus-visible:ring-violet-400"
    >
      <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${config.className}`}>
        <Icon aria-hidden="true" className="size-[17px]" strokeWidth={1.8} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start gap-1.5">
          <span className="line-clamp-2 flex-1 text-xs font-semibold leading-[18px] text-slate-900 dark:text-zinc-100">
            {item.title}
          </span>
          {item.unread ? <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-violet-500 dark:bg-violet-400" /> : null}
        </span>
        <span className="mt-0.5 block truncate text-[11px] text-zinc-600 dark:text-zinc-300">{item.context}</span>
        <span className="mt-0.5 block truncate text-[10px] text-zinc-400 dark:text-zinc-500">
          {item.detail} · {item.time}
        </span>
      </span>
      <ChevronRight aria-hidden="true" className="mt-2 size-4 shrink-0 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-500 dark:text-zinc-600 dark:group-hover:text-zinc-400" strokeWidth={1.8} />
    </OptionalLink>
  );
}

function ActionCenter({ items }: { items: ActionCenterItemData[] }) {
  const unreadCount = items.filter((item) => item.unread).length;

  return (
    <section aria-labelledby="action-center-heading">
      <div id="action-center-heading">
        <SectionHeading title="Action Center" badge={unreadCount} />
      </div>
      {items.length > 0 ? (
        <div className="mt-3 space-y-0.5">
          {items.map((item) => <NotificationItem key={item.id} item={item} />)}
        </div>
      ) : (
        <EmptyState message="You’re all caught up." />
      )}
    </section>
  );
}

function ActivityItem({ item, isLast }: { item: RecentActivityItemData; isLast: boolean }) {
  const Icon = activityIcons[item.kind];

  return (
    <OptionalLink
      href={item.href}
      className="group relative flex min-w-0 gap-3 rounded-xl px-1 py-2 outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:focus-visible:ring-violet-400"
    >
      {!isLast ? <span aria-hidden="true" className="absolute left-[17px] top-10 h-[calc(100%-20px)] w-px bg-zinc-200 dark:bg-zinc-700" /> : null}
      <span className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full border border-violet-200 bg-violet-50 text-violet-600 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-300">
        <Icon aria-hidden="true" className="size-3.5" strokeWidth={1.9} />
      </span>
      <span className="min-w-0 flex-1 pb-2">
        <span className="block truncate text-xs font-semibold text-slate-900 group-hover:text-violet-700 dark:text-zinc-100 dark:group-hover:text-violet-300">
          {item.title}
        </span>
        <span className="mt-0.5 block truncate text-[11px] text-zinc-500 dark:text-zinc-400">{item.description}</span>
        <span className="mt-1 block text-[10px] text-zinc-400 dark:text-zinc-500">{item.time}</span>
      </span>
    </OptionalLink>
  );
}

function RecentActivity({ items }: { items: RecentActivityItemData[] }) {
  return (
    <section aria-labelledby="recent-activity-heading">
      <div id="recent-activity-heading">
        <SectionHeading title="Recent Activity" />
      </div>
      {items.length > 0 ? (
        <div className="mt-3">
          {items.map((item, index) => (
            <ActivityItem key={item.id} item={item} isLast={index === items.length - 1} />
          ))}
        </div>
      ) : (
        <EmptyState message="No recent activity." />
      )}
    </section>
  );
}

function PriorityClientItem({ client, index }: { client: PriorityClientData; index: number }) {
  return (
    <OptionalLink
      href={client.href}
      className="group flex min-w-0 items-center gap-3 rounded-2xl px-2 py-2 outline-none transition-colors hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-violet-500 dark:hover:bg-zinc-800/70 dark:focus-visible:ring-violet-400"
    >
      {client.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={client.avatarUrl} alt="" className="size-9 shrink-0 rounded-full object-cover" />
      ) : (
        <span className={`grid size-9 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${avatarClasses[index % avatarClasses.length]}`}>
          {client.initials}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-semibold text-slate-900 dark:text-zinc-100">{client.name}</span>
        <span className="mt-1 flex items-center gap-1.5 truncate text-[10px] text-zinc-500 dark:text-zinc-400">
          <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${statusDotClasses[client.statusTone]}`} />
          <span className="truncate">{client.status}</span>
        </span>
      </span>
      <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-500 dark:text-zinc-600 dark:group-hover:text-zinc-400" strokeWidth={1.8} />
    </OptionalLink>
  );
}

function PriorityClients({ clients }: { clients: PriorityClientData[] }) {
  return (
    <section aria-labelledby="priority-clients-heading">
      <div id="priority-clients-heading">
        <SectionHeading title="Priority Clients" />
      </div>
      {clients.length > 0 ? (
        <div className="mt-3 space-y-0.5">
          {clients.slice(0, 6).map((client, index) => (
            <PriorityClientItem key={client.id} client={client} index={index} />
          ))}
        </div>
      ) : (
        <EmptyState message="No priority clients." />
      )}
    </section>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="mt-3 rounded-2xl bg-zinc-50 px-4 py-5 text-center text-xs text-zinc-500 dark:bg-zinc-800/60 dark:text-zinc-400">
      {message}
    </p>
  );
}

function SidebarSkeleton() {
  return (
    <div role="status" aria-label="Loading dashboard insights" className="animate-pulse space-y-7">
      {[4, 5, 4].map((count, sectionIndex) => (
        <div key={sectionIndex}>
          <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: count }, (_, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-2.5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
                  <div className="h-2 w-1/2 rounded bg-zinc-100 dark:bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SidebarContent({ actions, activities, clients, isLoading, errorMessage }: Pick<DashboardRightSidebarProps, "actions" | "activities" | "clients" | "isLoading" | "errorMessage">) {
  if (isLoading) return <SidebarSkeleton />;

  if (errorMessage) {
    return (
      <div role="alert" className="rounded-2xl bg-rose-50 px-4 py-5 text-center dark:bg-rose-950/20">
        <p className="text-xs font-semibold text-rose-700 dark:text-rose-300">Unable to load dashboard insights</p>
        <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-7 divide-y divide-zinc-100 dark:divide-zinc-800 [&>section:not(:first-child)]:pt-7">
      <ActionCenter items={actions ?? []} />
      <RecentActivity items={activities ?? []} />
      <PriorityClients clients={clients ?? []} />
    </div>
  );
}

export function DashboardRightSidebar({
  desktopOpen,
  mobileOpen,
  onCloseMobile,
  actions = mockActionCenterItems,
  activities = mockRecentActivityItems,
  clients = mockPriorityClients,
  isLoading = false,
  errorMessage,
}: DashboardRightSidebarProps) {
  useEffect(() => {
    if (!mobileOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseMobile();
    }

    function handleDesktopChange(event: MediaQueryListEvent) {
      if (event.matches) onCloseMobile();
    }

    const previousOverflow = document.body.style.overflow;
    const desktopQuery = window.matchMedia("(min-width: 1536px)");
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    desktopQuery.addEventListener("change", handleDesktopChange);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
      desktopQuery.removeEventListener("change", handleDesktopChange);
    };
  }, [mobileOpen, onCloseMobile]);

  const content = (
    <SidebarContent
      actions={actions}
      activities={activities}
      clients={clients}
      isLoading={isLoading}
      errorMessage={errorMessage}
    />
  );

  return (
    <>
      {desktopOpen ? (
        <aside
          aria-label="Dashboard insights"
          className="sticky top-[88px] mr-4 hidden h-[calc(100vh-120px)] w-[344px] shrink-0 overflow-y-auto rounded-3xl border border-zinc-200/80 bg-white px-5 py-6 [scrollbar-width:thin] [scrollbar-color:#d4d4d8_transparent] dark:border-zinc-800 dark:bg-zinc-900 dark:[scrollbar-color:#52525b_transparent] 2xl:block"
        >
          {content}
        </aside>
      ) : null}

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 2xl:hidden">
          <button
            type="button"
            aria-label="Close dashboard insights"
            onClick={onCloseMobile}
            className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px] dark:bg-black/55"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="right-sidebar-dialog-title"
            className="absolute inset-y-0 right-0 w-[min(360px,calc(100%-20px))] overflow-y-auto rounded-l-3xl border-l border-zinc-200 bg-white px-5 pb-8 pt-5 shadow-2xl [scrollbar-width:thin] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/50"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 id="right-sidebar-dialog-title" className="text-base font-semibold text-slate-950 dark:text-zinc-100">
                Dashboard insights
              </h2>
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close dashboard insights"
                className="grid size-9 place-items-center rounded-xl text-zinc-500 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:focus-visible:ring-zinc-400"
              >
                <X aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
              </button>
            </div>
            {content}
          </aside>
        </div>
      ) : null}
    </>
  );
}
