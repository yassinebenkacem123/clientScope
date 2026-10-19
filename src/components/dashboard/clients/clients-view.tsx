"use client";

import { useState } from "react";
import { AddClientModal } from "./add-client-modal";
import { ClientsSearchBar } from "./clients-search-bar";
import { ClientsTable } from "./clients-table";
import { DEFAULT_CLIENTS, type ClientFilterState, type ClientRecord, type ClientSortOption } from "./clients-data";

export function ClientsView() {
  const [clients, setClients] = useState<ClientRecord[]>(DEFAULT_CLIENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterState, setFilterState] = useState<ClientFilterState>({
    status: "all",
    activity: "all",
  });
  const [sortOption, setSortOption] = useState<ClientSortOption>("recent");

  function handleAddClient(newClient: ClientRecord) {
    setClients((prev) => [newClient, ...prev]);
  }

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
        onAddClient={handleAddClient}
        existingCount={clients.length}
      />
    </div>
  );
}

