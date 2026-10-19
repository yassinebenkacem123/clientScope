"use client";

import { useState } from "react";
import { Calendar, Check, MoreHorizontal } from "lucide-react";
import { DEFAULT_CLIENTS, type ClientRecord, type ClientStatus } from "./clients-data";

type ClientsTableProps = {
  clients?: ClientRecord[];
  searchQuery?: string;
  className?: string;
};

const statusStyles: Record<
  ClientStatus,
  {
    dotClass: string;
    textClass: string;
  }
> = {
  "in-progress": {
    dotClass: "bg-[#9B8AFB] dark:bg-[#B4A7FC]",
    textClass: "text-[#9B8AFB] dark:text-[#B4A7FC]",
  },
  complete: {
    dotClass: "bg-[#4BD37B] dark:bg-[#5FE38E]",
    textClass: "text-[#4BD37B] dark:text-[#5FE38E]",
  },
  pending: {
    dotClass: "bg-[#46B5FF] dark:bg-[#68C5FF]",
    textClass: "text-[#46B5FF] dark:text-[#68C5FF]",
  },
  approved: {
    dotClass: "bg-[#FBA645] dark:bg-[#FCB86B]",
    textClass: "text-[#FBA645] dark:text-[#FCB86B]",
  },
  rejected: {
    dotClass: "bg-zinc-400 dark:bg-zinc-500",
    textClass: "text-zinc-400 dark:text-zinc-500",
  },
};

export function ClientsTable({
  clients = DEFAULT_CLIENTS,
  searchQuery = "",
  className = "",
}: ClientsTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(["cl-4"]));
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredClients = clients.filter((client) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      client.clientId.toLowerCase().includes(q) ||
      client.user.name.toLowerCase().includes(q) ||
      client.project.toLowerCase().includes(q) ||
      client.contact.toLowerCase().includes(q) ||
      client.statusLabel.toLowerCase().includes(q)
    );
  });

  const isAllSelected =
    filteredClients.length > 0 && filteredClients.every((c) => selectedIds.has(c.id));

  function toggleSelectAll() {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredClients.map((c) => c.id)));
    }
  }

  function toggleRow(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  }

  return (
    <div className={`w-full overflow-hidden rounded-2xl bg-white transition-colors dark:bg-zinc-900 ${className}`}>
      <div className="w-full overflow-x-auto scrollbar-thin [scrollbar-color:#d4d4d8_transparent] dark:[scrollbar-color:#52525b_transparent]">
        <table className="w-full min-w-240 border-collapse text-left text-[13px]">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-zinc-100 text-xs font-normal text-zinc-400 transition-colors dark:border-zinc-800 dark:text-zinc-500">
              <th scope="col" className="w-12 py-3.5 pl-4 pr-2">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  aria-label={isAllSelected ? "Deselect all rows" : "Select all rows"}
                  className={`grid size-4.5 place-items-center rounded-md border transition-colors ${
                    isAllSelected
                      ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950"
                      : "border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
                  }`}
                >
                  {isAllSelected ? (
                    <Check aria-hidden="true" className="size-3 stroke-3" />
                  ) : null}
                </button>
              </th>
              <th scope="col" className="py-3.5 px-3 font-normal">
                Client ID
              </th>
              <th scope="col" className="py-3.5 px-3 font-normal">
                User
              </th>
              <th scope="col" className="py-3.5 px-3 font-normal">
                Project
              </th>
              <th scope="col" className="py-3.5 px-3 font-normal">
                Contact
              </th>
              <th scope="col" className="py-3.5 px-3 font-normal">
                Active Project
              </th>
              <th scope="col" className="py-3.5 px-3 font-normal">
                Status
              </th>
              <th scope="col" className="py-3.5 px-3 font-normal">
                Last Activity
              </th>
              <th scope="col" className="w-12 py-3.5 pl-2 pr-4 text-right font-normal">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/70">
            {filteredClients.map((client) => {
              const isSelected = selectedIds.has(client.id);
              const status = statusStyles[client.status];

              return (
                <tr
                  key={client.id}
                  onClick={() => toggleRow(client.id)}
                  className={`group cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-zinc-50/90 dark:bg-zinc-800/50"
                      : "hover:bg-zinc-50/70 dark:hover:bg-zinc-800/35"
                  }`}
                >
                  {/* Checkbox Column */}
                  <td
                    className="py-3.5 pl-4 pr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRow(client.id);
                    }}
                  >
                    <button
                      type="button"
                      aria-label={`Select ${client.user.name}`}
                      className={`grid size-4.5 place-items-center rounded-md border transition-all ${
                        isSelected
                          ? "border-slate-900 bg-slate-900 text-white opacity-100 dark:border-white dark:bg-white dark:text-slate-950"
                          : "border-zinc-300 bg-white opacity-0 group-hover:opacity-100 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
                      }`}
                    >
                      {isSelected ? (
                        <Check aria-hidden="true" className="size-3 stroke-3" />
                      ) : null}
                    </button>
                  </td>

                  {/* Client ID */}
                  <td className="py-3.5 px-3 font-normal text-slate-800 dark:text-zinc-200 whitespace-nowrap">
                    {client.clientId}
                  </td>

                  {/* User (Avatar + Name) */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={client.user.avatarUrl}
                        alt=""
                        className="size-6 shrink-0 rounded-full object-cover ring-1 ring-zinc-200/80 dark:ring-zinc-700"
                      />
                      <span className="font-normal text-slate-900 dark:text-zinc-100">
                        {client.user.name}
                      </span>
                    </div>
                  </td>

                  {/* Project */}
                  <td className="py-3.5 px-3 font-normal text-slate-700 dark:text-zinc-300 whitespace-nowrap">
                    {client.project}
                  </td>

                  {/* Contact */}
                  <td className="py-3.5 px-3 font-normal text-slate-600 dark:text-zinc-400 whitespace-nowrap">
                    {client.contact}
                  </td>

                  {/* Active Project */}
                  <td className="py-3.5 px-3 font-normal text-slate-700 dark:text-zinc-300 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="font-medium text-slate-900 dark:text-zinc-100">
                        {client.activeProjects}
                      </span>
                      <span className="text-zinc-400 dark:text-zinc-500">
                        {client.activeProjects === 1 ? "project" : "projects"}
                      </span>
                    </span>
                  </td>

                  {/* Status (• Status) */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 font-normal">
                      <span
                        aria-hidden="true"
                        className={`size-1.5 rounded-full shrink-0 ${status.dotClass}`}
                      />
                      <span className={status.textClass}>{client.statusLabel}</span>
                    </span>
                  </td>

                  {/* Last Activity (Calendar + Date) */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-2 font-normal text-slate-800 dark:text-zinc-200">
                      <Calendar
                        aria-hidden="true"
                        className="size-3.5 shrink-0 text-slate-600 dark:text-zinc-400"
                        strokeWidth={1.8}
                      />
                      <span>{client.lastActivity}</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td
                    className="py-3.5 pl-2 pr-4 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative inline-block text-left">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuId(activeMenuId === client.id ? null : client.id)
                        }
                        aria-label={`Actions for ${client.user.name}`}
                        className="grid size-7 place-items-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                      >
                        <MoreHorizontal aria-hidden="true" className="size-4" strokeWidth={1.8} />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === client.id ? (
                        <>
                          <div
                            className="fixed inset-0 z-20"
                            onClick={() => setActiveMenuId(null)}
                          />
                          <div className="absolute right-0 top-8 z-30 w-36 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                            <button
                              type="button"
                              onClick={() => setActiveMenuId(null)}
                              className="w-full px-3 py-1.5 text-left text-xs text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-700/60"
                            >
                              View profile
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveMenuId(null)}
                              className="w-full px-3 py-1.5 text-left text-xs text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-700/60"
                            >
                              Edit details
                            </button>
                            <div className="my-1 border-t border-zinc-100 dark:border-zinc-700" />
                            <button
                              type="button"
                              onClick={() => setActiveMenuId(null)}
                              className="w-full px-3 py-1.5 text-left text-xs text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                            >
                              Archive client
                            </button>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-zinc-400 dark:text-zinc-500">
                  No clients found matching &ldquo;{searchQuery}&rdquo;
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Table Footer info */}
      <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-3 text-xs text-zinc-400 transition-colors dark:border-zinc-800 dark:text-zinc-500">
        <span>
          Showing {filteredClients.length} of {clients.length} clients
        </span>
        {selectedIds.size > 0 ? (
          <span className="font-medium text-slate-900 dark:text-zinc-200">
            {selectedIds.size} client{selectedIds.size > 1 ? "s" : ""} selected
          </span>
        ) : null}
      </div>
    </div>
  );
}
