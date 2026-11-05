"use client";

import { useState } from "react";
import { AddClientModal } from "./add-client-modal";
import { ClientsSearchBar } from "./clients-search-bar";
import { ClientsTable } from "./clients-table";
import { type ClientFilterState, type ClientSortOption } from "./clients-data";
import { useClients } from "./clients-provider";

export function ClientsView() {
  const { clients, addClient } = useClients();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
        onAddClick={() => setIsAddModalOpen(true)}
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
        clients={clients}
      />

      {/* Add Client Dialog Modal */}
      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddClient={addClient}
        existingCount={clients.length}
      />
    </div>
  );
}

