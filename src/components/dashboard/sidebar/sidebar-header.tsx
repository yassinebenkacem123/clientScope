import { Check, ChevronsUpDown } from "lucide-react";

type SidebarHeaderProps = {
  workspaceName: string;
  user?: SidebarUser;
};

export type SidebarUser = {
  name: string;
  role: string;
  avatarUrl?: string;
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function BrandMark() {
  return (
    <div className="grid size-8 place-items-center rounded-full bg-blue-600 text-[11px] font-bold tracking-tight text-white">
      CS
    </div>
  );
}

export function SidebarHeader({ workspaceName, user }: SidebarHeaderProps) {
  const displayName = user?.name ?? workspaceName;
  const eyebrow = user?.role ?? "ClientScope";

  return (
    <div className="h-32 shrink-0 border-b border-zinc-100 px-6">
      <details className="group relative h-full">
        <summary className="flex h-full cursor-pointer list-none items-center gap-3.5 text-left outline-none [&::-webkit-details-marker]:hidden">
          {user?.avatarUrl ? (
            // A plain img supports remote avatar providers without coupling this component to host configuration.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatarUrl} alt="" className="size-12 shrink-0 rounded-full object-cover" />
          ) : (
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
              {getInitials(displayName)}
            </span>
          )}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">
              {eyebrow}
            </span>
            <span className="mt-0.5 block truncate text-[15px] font-semibold tracking-[-0.01em] text-zinc-950">
              {displayName}
            </span>
          </span>
          <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-zinc-200 text-zinc-400 transition-colors group-hover:bg-zinc-50 group-hover:text-zinc-700 group-focus-visible:ring-2 group-focus-visible:ring-zinc-900 group-focus-visible:ring-offset-2">
            <ChevronsUpDown aria-hidden="true" className="size-4" strokeWidth={1.7} />
          </span>
        </summary>
        <div className="absolute inset-x-0 top-[calc(100%-16px)] z-20 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl shadow-zinc-950/8">
          <div className="flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2.5 text-xs font-medium text-zinc-700">
            <Check aria-hidden="true" className="size-4 text-zinc-950" />
            <span className="truncate">{workspaceName}</span>
          </div>
        </div>
      </details>
    </div>
  );
}
