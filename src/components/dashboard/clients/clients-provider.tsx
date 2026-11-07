"use client";

import { createContext, useContext, useState } from "react";
import { DEFAULT_CLIENTS, type ClientRecord } from "./clients-data";
import { deleteClientProject, saveClientProject, type ClientProject } from "./client-projects-data";
import { removeClientFile, saveClientFile, type ClientFileRecord } from "./client-files-data";
import { deleteQuoteDraft, prepareClientQuote, saveQuoteDraft, type QuoteDraft } from "./client-quotes-data";
import { deleteClientNote, pinClientNote, saveClientNote, type NoteDraft } from "./client-notes-data";

const ClientsContext = createContext<{
  clients: ClientRecord[];
  addClient: (client: ClientRecord) => void;
  updateClient: (client: ClientRecord) => void;
  saveProject: (clientId: string, project: ClientProject) => void;
  deleteProject: (clientId: string, projectId: string) => void;
  saveFile: (clientId: string, file: ClientFileRecord) => void;
  removeFile: (clientId: string, fileId: string) => void;
  saveQuote: (clientId: string, draft: QuoteDraft, id: string, sourceId?: string) => void;
  prepareQuote: (clientId: string, id: string, today: string) => void;
  removeQuote: (clientId: string, id: string) => void;
  saveNote: (clientId: string, draft: NoteDraft, id: string) => void;
  pinNote: (clientId: string, id: string) => void;
  removeNote: (clientId: string, id: string) => void;
} | null>(null);

export function ClientsProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState(DEFAULT_CLIENTS);

  return (
    <ClientsContext.Provider value={{
      clients,
      addClient: (client) => setClients((current) => [client, ...current]),
      updateClient: (client) => setClients((current) => current.map((item) => item.id === client.id ? client : item)),
      saveProject: (clientId, project) => setClients((current) => saveClientProject(current, clientId, project)),
      deleteProject: (clientId, projectId) => setClients((current) => deleteClientProject(current, clientId, projectId)),
      saveFile: (clientId, file) => setClients((current) => saveClientFile(current, clientId, file)),
      removeFile: (clientId, fileId) => setClients((current) => removeClientFile(current, clientId, fileId)),
      saveQuote: (clientId, draft, id, sourceId) => setClients((current) => saveQuoteDraft(current, clientId, draft, id, new Date().toISOString(), sourceId)),
      prepareQuote: (clientId, id, today) => setClients((current) => prepareClientQuote(current, clientId, id, new Date().toISOString(), today)),
      removeQuote: (clientId, id) => setClients((current) => deleteQuoteDraft(current, clientId, id)),
      saveNote: (clientId, draft, id) => setClients((current) => saveClientNote(current, clientId, draft, id, new Date().toISOString())),
      pinNote: (clientId, id) => setClients((current) => pinClientNote(current, clientId, id)),
      removeNote: (clientId, id) => setClients((current) => deleteClientNote(current, clientId, id)),
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
