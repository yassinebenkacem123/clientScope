"use client";

import { useState } from "react";
import { ClientsSearchBar } from "./clients-search-bar";
import { ClientsTable } from "./clients-table";
import { DEFAULT_CLIENTS, type ClientFilterState, type ClientSortOption } from "./clients-data";

export function ClientsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterState, setFilterState] = useState<ClientFilterState>({
    status: "all",
    activity: "all",
  });
  const [sortOption, setSortOption] = useState<ClientSortOption>("recent");

  return (
    <div className="space-y-4">
      {/* Search & Actions Toolbar with Filter & Sort Dropdowns */}
      <ClientsSearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        filterState={filterState}
        onFilterChange={setFilterState}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />

      {/* Clients Table with Sorting, Filtering & Pagination */}
      <ClientsTable
        searchQuery={searchQuery}
        filterState={filterState}
        sortOption={sortOption}
        clients={DEFAULT_CLIENTS}
      />
    </div>
  );
}

