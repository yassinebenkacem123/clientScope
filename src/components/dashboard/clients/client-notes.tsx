"use client";

import { useRef, useState, type FormEvent } from "react";
import { notFound } from "next/navigation";
import { FileText, Pencil, Pin, PinOff, Plus, Search, StickyNote, Trash2, X } from "lucide-react";
import { useClients } from "./clients-provider";
import { getClientProjects } from "./client-projects-data";
import { getClientNotes, validateNoteDraft, type ClientNote, type NoteDraft } from "./client-notes-data";
import type { ClientRecord } from "./clients-data";
import { ClientDetailDialog, detailCard, detailDanger, detailDate, detailField, detailFocus, detailIconButton, detailLabel, detailMuted, detailPrimary, detailSecondary } from "./client-detail-ui";

function NoteForm({ client, note, onSave, onCancel }: {
  client: ClientRecord; note?: ClientNote; onSave: (draft: NoteDraft) => void; onCancel: () => void;
}) {
  const [error, setError] = useState("");
  const projects = getClientProjects(client);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const draft = { title: String(data.get("title") ?? "").trim(), content: String(data.get("content") ?? "").trim(), projectId: String(data.get("projectId") ?? ""), pinned: data.get("pinned") === "on" };
    const invalid = validateNoteDraft(draft, client);
    if (invalid) { setError(invalid); return; }
    onSave(draft);
  }
  return <form onSubmit={submit} className="space-y-5 p-6">
    <p className={detailMuted}>Internal note for {client.user.name}.</p>
    <label className={detailLabel}>Title *<input name="title" autoFocus required maxLength={160} defaultValue={note?.title} placeholder="e.g. Project briefing notes" className={detailField} /></label>
    <label className={detailLabel}>Project (optional)<select name="projectId" defaultValue={note?.projectId ?? ""} className={detailField}><option value="">Client account · no project</option>{note?.projectId && !projects.some((project) => project.id === note.projectId) && <option value={note.projectId} disabled>{note.projectName} (unavailable)</option>}{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label>
    <label className={detailLabel}>Note *<textarea name="content" required rows={9} maxLength={10000} defaultValue={note?.content} placeholder="Record decisions, preferences, and follow-up information" className={detailField} /></label>
    <label className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300"><input type="checkbox" name="pinned" defaultChecked={note?.pinned} className={`size-4 accent-slate-900 dark:accent-zinc-100 ${detailFocus}`} />Pin this note to the top</label>
    {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    <div className="flex flex-wrap justify-end gap-3 border-t border-zinc-100 pt-5 dark:border-zinc-800"><button type="button" onClick={onCancel} className={detailSecondary}>Cancel</button><button type="submit" className={detailPrimary}>Save note</button></div>
  </form>;
}

type NoteDialog = { type: "create" } | { type: "edit" | "view" | "delete"; note: ClientNote };
export function ClientNotes({ clientId }: { clientId: string }) {
  const { clients, saveNote, pinNote, removeNote } = useClients();
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [dialog, setDialog] = useState<NoteDialog | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  const client = clients.find((item) => item.id === clientId);
  if (!client) notFound();
  const allNotes = getClientNotes(client);
  const notes = getClientNotes(client, search);
  const selected = dialog && "note" in dialog ? dialog.note : undefined;
  function open(value: NoteDialog) { setDialog(value); if (!dialogRef.current?.open) dialogRef.current?.showModal(); }
  function close() { dialogRef.current?.close(); }
  function save(draft: NoteDraft) {
    saveNote(clientId, draft, selected?.id ?? crypto.randomUUID());
    setSearch(""); setNotice(selected ? "Note updated." : "Note created."); close();
  }
  return <section aria-labelledby="client-notes-title" className="space-y-6">
    <div className={detailCard}>
      <header className="flex flex-wrap items-center justify-between gap-4"><div><h2 id="client-notes-title" className="text-base font-semibold text-slate-950 dark:text-zinc-100">Notes <span className="ml-2 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{allNotes.length}</span></h2><p className={`mt-1 ${detailMuted}`}>Internal notes for {client.user.name}. {allNotes.filter((note) => note.pinned).length} pinned.</p></div><button ref={addRef} type="button" onClick={() => open({ type: "create" })} className={detailPrimary}><Plus aria-hidden="true" className="size-4" />Add Note</button></header>
      <p className={`mt-4 ${detailMuted}`}>Notes are kept until the page is reloaded and are not shared with the client.</p>
      <div className="relative mt-5 max-w-lg"><label htmlFor="client-notes-search" className="sr-only">Search client notes</label><Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" /><input id="client-notes-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search notes or project names..." className={`${detailField} mt-0 pl-10 pr-11`} />{search && <button type="button" aria-label="Clear note search" onClick={() => setSearch("")} className={`absolute right-1 top-1/2 -translate-y-1/2 ${detailIconButton}`}><X aria-hidden="true" className="size-4" /></button>}</div>
      <p role="status" className="mt-2 text-sm text-emerald-700 empty:hidden dark:text-emerald-300">{notice}</p>
      {search && <p role="status" className={`mt-3 ${detailMuted}`}>{notes.length} matching note{notes.length === 1 ? "" : "s"}</p>}
    </div>
    <div className="grid gap-5 md:grid-cols-2">{notes.map((note) => <article key={note.id} className={`${detailCard} flex min-w-0 flex-col gap-4`}>
      <div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="mb-2 flex flex-wrap items-center gap-2"><span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">Internal</span>{note.pinned && <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-300"><Pin aria-hidden="true" className="size-3" />Pinned</span>}</div><h3><button type="button" onClick={() => open({ type: "view", note })} className={`rounded-sm text-left text-base font-semibold text-slate-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400 ${detailFocus}`}><span className="break-words">{note.title}</span></button></h3></div><button type="button" aria-label={`${note.pinned ? "Unpin" : "Pin"} ${note.title}`} aria-pressed={note.pinned} onClick={() => { pinNote(clientId, note.id); setNotice(note.pinned ? "Note unpinned." : "Note pinned."); }} className={detailIconButton}>{note.pinned ? <PinOff aria-hidden="true" className="size-4" /> : <Pin aria-hidden="true" className="size-4" />}</button></div>
      {note.projectName && <p className="break-words text-xs font-medium text-blue-600 dark:text-blue-400">{note.projectName}</p>}
      <p className="line-clamp-4 whitespace-pre-wrap break-words text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{note.content}</p>
      <footer className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800"><p className={detailMuted}>Updated <time dateTime={note.updatedAt}>{detailDate(note.updatedAt, true)}</time> (Casablanca)</p><div className="flex gap-1"><button type="button" title="View full note" aria-label={`View ${note.title}`} onClick={() => open({ type: "view", note })} className={detailIconButton}><FileText aria-hidden="true" className="size-4" /></button><button type="button" aria-label={`Edit ${note.title}`} onClick={() => open({ type: "edit", note })} className={detailIconButton}><Pencil aria-hidden="true" className="size-4" /></button><button type="button" aria-label={`Delete ${note.title}`} onClick={() => open({ type: "delete", note })} className={detailIconButton}><Trash2 aria-hidden="true" className="size-4" /></button></div></footer>
    </article>)}</div>
    {!notes.length && <div className={`${detailCard} py-14 text-center`}><StickyNote aria-hidden="true" className="mx-auto size-8 text-zinc-400 dark:text-zinc-500" /><p className="mt-3 text-sm font-medium text-zinc-700 dark:text-zinc-200">{search ? "No matching notes" : "No notes yet"}</p><p className={`mt-1 ${detailMuted}`}>{search ? "Try a different title, phrase, or project name." : "Keep client preferences, decisions, and follow-up details in one place."}</p>{search && <button type="button" onClick={() => setSearch("")} className={`mt-4 ${detailSecondary}`}>Clear search</button>}</div>}
    <ClientDetailDialog dialogRef={dialogRef} title={dialog?.type === "create" ? "Add Note" : dialog?.type === "edit" ? "Edit Note" : dialog?.type === "delete" ? "Delete Note" : "Note Details"} onClose={() => { setDialog(null); addRef.current?.focus(); }}>
      {(dialog?.type === "create" || dialog?.type === "edit") && <NoteForm key={selected?.id ?? "new"} client={client} note={selected} onSave={save} onCancel={close} />}
      {dialog?.type === "view" && <div className="space-y-5 p-6"><h3 className="break-words text-xl font-semibold">{dialog.note.title}</h3><p className={detailMuted}>Internal note{dialog.note.projectName ? ` · ${dialog.note.projectName}` : ""}</p><p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">{dialog.note.content}</p><p className={detailMuted}>Created {detailDate(dialog.note.createdAt, true)} · Updated {detailDate(dialog.note.updatedAt, true)} (Casablanca)</p><div className="flex justify-end gap-3 border-t border-zinc-100 pt-5 dark:border-zinc-800"><button type="button" onClick={close} className={detailSecondary}>Close</button><button type="button" onClick={() => open({ type: "edit", note: dialog.note })} className={detailPrimary}><Pencil aria-hidden="true" className="size-4" />Edit note</button></div></div>}
      {dialog?.type === "delete" && <div className="space-y-5 p-6"><p className="break-words text-sm text-zinc-600 dark:text-zinc-300">Delete <strong>{dialog.note.title}</strong>?</p><div className="flex justify-end gap-3"><button type="button" autoFocus onClick={close} className={detailSecondary}>Cancel</button><button type="button" onClick={() => { removeNote(clientId, dialog.note.id); setNotice("Note deleted."); close(); }} className={detailDanger}>Delete note</button></div></div>}
    </ClientDetailDialog>
  </section>;
}
