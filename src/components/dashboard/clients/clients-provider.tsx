"use client";

import { createContext, useContext, useState } from "react";
import { DEFAULT_CLIENTS, type ClientRecord } from "./clients-data";

const ClientsContext = createContext<{
  clients: ClientRecord[];
  addClient: (client: ClientRecord) => void;
  updateClient: (client: ClientRecord) => void;
} | null>(null);

export function ClientsProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState(DEFAULT_CLIENTS);

  return (
    <ClientsContext.Provider value={{
      clients,
      addClient: (client) => setClients((current) => [client, ...current]),
      updateClient: (client) => setClients((current) => current.map((item) => item.id === client.id ? client : item)),
    }}>
      {children}
    </ClientsContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientsContext);
  if (!context) throw new Error("useClients must be used within ClientsProvider");
  return context;
}
