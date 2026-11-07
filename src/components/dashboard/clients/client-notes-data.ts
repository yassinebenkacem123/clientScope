import type { ClientRecord } from "./clients-data";
import { getClientProjects } from "./client-projects-data";

export type NoteDraft = { title: string; content: string; projectId: string; pinned: boolean };
export type ClientNote = NoteDraft & { id: string; clientId: string; projectName: string; createdAt: string; updatedAt: string };
export function getClientNotes(client: ClientRecord, search = "") {
  const query = search.trim().toLowerCase();
  return (client.notes ?? []).filter((note) => note.clientId === client.id &&
    (!query || [note.title, note.content, note.projectName].some((value) => value.toLowerCase().includes(query))))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt.localeCompare(a.updatedAt));
}
export function validateNoteDraft(draft: NoteDraft, client: ClientRecord) {
  if (!draft.title.trim() || draft.title.trim().length > 160) return "Enter a note title of up to 160 characters.";
  if (!draft.content.trim() || draft.content.trim().length > 10000) return "Enter note text of up to 10,000 characters.";
  if (draft.projectId && !getClientProjects(client).some((project) => project.id === draft.projectId)) return "Choose a project belonging to this client, or leave the note unlinked.";
  return null;
}
export function saveClientNote(clients: ClientRecord[], clientId: string, draft: NoteDraft, id: string, timestamp: string) {
  return clients.map((client) => {
    if (client.id !== clientId || validateNoteDraft(draft, client)) return client;
    const notes = getClientNotes(client);
    const existing = notes.find((note) => note.id === id);
    const note: ClientNote = { ...draft, title: draft.title.trim(), content: draft.content.trim(),
      id, clientId, projectName: getClientProjects(client).find((project) => project.id === draft.projectId)?.name ?? "",
      createdAt: existing?.createdAt ?? timestamp, updatedAt: timestamp };
    return { ...client, notes: existing ? notes.map((item) => item.id === id ? note : item) : [note, ...notes] };
  });
}
export function pinClientNote(clients: ClientRecord[], clientId: string, id: string) {
  return clients.map((client) => client.id !== clientId ? client : { ...client, notes: getClientNotes(client).map((note) => note.id === id ? { ...note, pinned: !note.pinned } : note) });
}
export function deleteClientNote(clients: ClientRecord[], clientId: string, id: string) {
  return clients.map((client) => client.id !== clientId ? client : { ...client, notes: getClientNotes(client).filter((note) => note.id !== id) });
}
