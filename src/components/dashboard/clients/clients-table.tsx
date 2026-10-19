"use client";

import { useEffect, useState } from "react";
import { Calendar, Check, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { DEFAULT_CLIENTS, type ClientFilterState, type ClientRecord, type ClientSortOption, type ClientStatus } from "./clients-data";

type ClientsTableProps = {
  clients?: ClientRecord[];
  searchQuery?: string;
  filterState?: ClientFilterState;
  sortOption?: ClientSortOption;
  className?: string;
  defaultPageSize?: number;
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
  filterState = { status: "all", activity: "all" },
  sortOption = "recent",
  className = "",
  defaultPageSize = 5,
}: ClientsTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(["cl-4"]));
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // 1. Filter clients by search, status, and active projects
  const filteredClients = clients.filter((client) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        client.clientId.toLowerCase().includes(q) ||
        client.user.name.toLowerCase().includes(q) ||
        client.project.toLowerCase().includes(q) ||
        client.contact.toLowerCase().includes(q) ||
        client.statusLabel.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    if (filterState.status !== "all" && client.status !== filterState.status) {
      return false;
    }

    if (filterState.activity === "active" && client.activeProjects <= 0) {
      return false;
    }

    if (filterState.activity === "inactive" && client.activeProjects > 0) {
      return false;
    }

    return true;
  });

  // 2. Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return a.user.name.localeCompare(b.user.name);
      case "name-desc":
        return b.user.name.localeCompare(a.user.name);
      case "projects-desc":
        return b.activeProjects - a.activeProjects;
      case "id-asc":
        return a.clientId.localeCompare(b.clientId);
      case "recent":
      default:
        return 0;
    }
  });

  const totalPages = Math.max(1, Math.ceil(sortedClients.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  // Reset to page 1 if search query or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterState, sortOption]);

  const startIndex = (safePage - 1) * pageSize;
  const paginatedClients = sortedClients.slice(startIndex, startIndex + pageSize);

  const isAllPageSelected =
    paginatedClients.length > 0 && paginatedClients.every((c) => selectedIds.has(c.id));

  function toggleSelectPage() {
    const next = new Set(selectedIds);
    if (isAllPageSelected) {
      paginatedClients.forEach((c) => next.delete(c.id));
    } else {
      paginatedClients.forEach((c) => next.add(c.id));
    }
    setSelectedIds(next);
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

  function getPageNumbers() {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("...");
      const start = Math.max(2, safePage - 1);
      const end = Math.min(totalPages - 1, safePage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
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
                  onClick={toggleSelectPage}
                  aria-label={isAllPageSelected ? "Deselect all rows on this page" : "Select all rows on this page"}
                  className={`grid size-4.5 place-items-center rounded-md border transition-colors ${
                    isAllPageSelected
                      ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950"
                      : "border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
                  }`}
                >
                  {isAllPageSelected ? (
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
            {paginatedClients.map((client) => {
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
                        src={client.user.avatarUrl || "/avatars/avatar-1.png"}
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

            {paginatedClients.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-zinc-400 dark:text-zinc-500">
                  No clients found matching &ldquo;{searchQuery}&rdquo;
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Table Pagination & Footer Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-100 px-4 py-3 text-xs text-zinc-500 transition-colors dark:border-zinc-800 dark:text-zinc-400">
        {/* Left Status info */}
        <div className="flex items-center gap-3">
          <span>
            Showing <strong className="font-semibold text-slate-900 dark:text-zinc-200">{filteredClients.length > 0 ? startIndex + 1 : 0}</strong> to{" "}
            <strong className="font-semibold text-slate-900 dark:text-zinc-200">
              {Math.min(startIndex + pageSize, filteredClients.length)}
            </strong>{" "}
            of <strong className="font-semibold text-slate-900 dark:text-zinc-200">{filteredClients.length}</strong> clients
          </span>
          {selectedIds.size > 0 ? (
            <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-slate-900 dark:bg-zinc-800 dark:text-zinc-200">
              {selectedIds.size} selected
            </span>
          ) : null}
        </div>

        {/* Right Pagination Controls */}
        <div className="flex items-center gap-3">
          {/* Rows per page selector */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="clients-per-page" className="text-zinc-400 dark:text-zinc-500">
              Per page:
            </label>
            <select
              id="clients-per-page"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-7 rounded-lg border border-zinc-200 bg-white px-2 text-xs text-slate-800 outline-none hover:border-zinc-300 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              <option value={5}>5</option>
              <option value={8}>8</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              aria-label="Previous page"
              className="grid size-7.5 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700/60 dark:hover:text-zinc-100 dark:disabled:hover:bg-zinc-800"
            >
              <ChevronLeft aria-hidden="true" className="size-4" strokeWidth={1.8} />
            </button>

            {/* Numeric Page Buttons */}
            {getPageNumbers().map((pageNum, idx) => {
              if (pageNum === "...") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="grid size-7.5 place-items-center text-zinc-400 dark:text-zinc-500 select-none"
                  >
                    …
                  </span>
                );
              }

              const isActive = pageNum === safePage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  aria-label={`Go to page ${pageNum}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`grid size-7.5 place-items-center rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-2xs font-semibold"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              aria-label="Next page"
              className="grid size-7.5 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700/60 dark:hover:text-zinc-100 dark:disabled:hover:bg-zinc-800"
            >
              <ChevronRight aria-hidden="true" className="size-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
