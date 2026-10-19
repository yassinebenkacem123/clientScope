"use client";

import { useState } from "react";
import { ClientsSearchBar } from "./clients-search-bar";
import { ClientsTable } from "./clients-table";
import { DEFAULT_CLIENTS } from "./clients-data";

export function ClientsView() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-4">
      {/* Search & Actions Toolbar */}
      <ClientsSearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onAddClick={() => {}}
        onFilterClick={() => {}}
        onSortClick={() => {}}
      />

      {/* Clients Table */}
      <ClientsTable searchQuery={searchQuery} clients={DEFAULT_CLIENTS} />
    </div>
  );
}
