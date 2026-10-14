"use client";

import { PanelLeftClose } from "lucide-react";

export type SidebarUser = {
  name: string;
  role: string;
  avatarUrl?: string;
};

export const DEFAULT_USER: SidebarUser = {
  name: "Alex Morgan",
  role: "Workspace Owner",
  avatarUrl:
    "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.webp",
};

type SidebarHeaderProps = {
  workspaceName?: string;
  user?: SidebarUser;
  onCollapse?: () => void;
};

export function BrandMark() {
  return (
    <div className="grid size-8 place-items-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-[11px] font-bold tracking-tight text-white shadow-sm shadow-blue-500/25">
      CS
    </div>
  );
}

export function SidebarHeader({
  onCollapse,
}: SidebarHeaderProps) {
  return (
    <div className="shrink-0 border-b border-zinc-100 px-4 pt-4 pb-3 dark:border-zinc-800">
      {/* Top brand and desktop collapse button row */}
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold tracking-[-0.015em] text-zinc-950 dark:text-zinc-100">
              ClientScope
            </span>
          </div>
        </div>

        {onCollapse ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCollapse();
            }}
            aria-label="Collapse sidebar (Ctrl+B)"
            title="Collapse sidebar (Ctrl+B)"
            className="hidden size-8 place-items-center rounded-lg text-zinc-400 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 dark:focus-visible:ring-zinc-400 lg:grid"
          >
            <PanelLeftClose aria-hidden="true" className="size-[17px]" strokeWidth={1.75} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
