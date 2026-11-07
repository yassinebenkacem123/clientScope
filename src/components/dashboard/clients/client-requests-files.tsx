"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { notFound } from "next/navigation";
import { Archive, Download, File, FileAudio, FileImage, FileSpreadsheet, FileText, FileVideo, Files, FolderOpen, Presentation, Trash2, Upload, FileQuestion, Plus, X, type LucideIcon } from "lucide-react";
import { StatCard } from "../overview/stat-card";
import { useClients } from "./clients-provider";
import { acceptedFileTypes, detectFileKind, FILE_KINDS, fileStatistics, formatFileDate, formatFileSize, getClientFiles, validateLocalFile, type ClientFileKind, type ClientFileRecord } from "./client-files-data";

const focusClass = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900 dark:focus-visible:outline-zinc-100";
const primaryButtonClass = `inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 ${focusClass}`;
const secondaryButtonClass = `inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 ${focusClass}`;
const fieldClass = "mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:hover:border-zinc-600 dark:focus:border-zinc-400 dark:focus:ring-white/10";
const iconButtonClass = `inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 ${focusClass}`;

const kindIcons: Record<ClientFileKind, LucideIcon> = {
  image: FileImage, document: FileText, spreadsheet: FileSpreadsheet, presentation: Presentation,
  archive: Archive, audio: FileAudio, video: FileVideo, other: File,
};
const kindColors: Record<ClientFileKind, string> = {
  image: "bg-violet-50 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300",
  document: "bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300",
  spreadsheet: "bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300",
  presentation: "bg-orange-50 text-orange-600 dark:bg-orange-400/10 dark:text-orange-300",
  archive: "bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
  audio: "bg-pink-50 text-pink-600 dark:bg-pink-400/10 dark:text-pink-300",
  video: "bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300",
  other: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
};

type DialogState = { type: "request" } | { type: "remove"; file: ClientFileRecord };

export function ClientRequestsFiles({ clientId }: { clientId: string }) {
  const { clients, saveFile, removeFile } = useClients();
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [error, setError] = useState("");
  const [requestError, setRequestError] = useState("");
  const [notice, setNotice] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fulfillInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<ClientFileRecord | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const requestButtonRef = useRef<HTMLButtonElement>(null);
  const client = clients.find((item) => item.id === clientId);
  if (!client) notFound();
  const files = getClientFiles(client).sort((a, b) => Date.parse(b.uploadedAt ?? b.requestedAt ?? "") - Date.parse(a.uploadedAt ?? a.requestedAt ?? ""));
  const stats = fileStatistics(files);

  function openDialog(value: DialogState, trigger: HTMLButtonElement) {
    setRequestError("");
    setDialog(value);
    lastTriggerRef.current = trigger;
    dialogRef.current?.showModal();
  }

  function requestFile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const kind = String(form.get("kind") ?? "other");
    if (!name || name.length > 160 || description.length > 2000 || !Object.hasOwn(FILE_KINDS, kind)) {
      setRequestError("Enter a file name of up to 160 characters and instructions of up to 2,000 characters.");
      event.currentTarget.querySelector("input")?.focus();
      return;
    }
    saveFile(clientId, { id: crypto.randomUUID(), clientId, name, description,
      kind: kind as ClientFileKind, status: "requested", requestedAt: new Date().toISOString() });
    setNotice(`File request added: ${name}.`);
    setError("");
    dialogRef.current?.close();
  }

  function uploadFiles(event: ChangeEvent<HTMLInputElement>, fulfill = false) {
    const selected = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";
    if (!selected.length) return;
    const target = fulfill ? uploadTargetRef.current : null;
    if (fulfill && (!target || !files.some((file) => file.id === target.id && file.status === "requested"))) {
      setError("This file request is no longer available.");
      return;
    }
    const validationError = selected.map((file) => validateLocalFile(file, target?.kind)).find(Boolean);
    if (validationError) { setError(validationError); setNotice(""); return; }
    const now = new Date().toISOString();
    for (const file of selected) {
      saveFile(clientId, { id: target?.id ?? crypto.randomUUID(), clientId, name: file.name,
        kind: detectFileKind(file.name, file.type), status: "uploaded", uploadedAt: now,
        requestedAt: target?.requestedAt, requestedName: target?.name, description: target?.description ?? "", file });
    }
    setError("");
    setNotice(target ? `${target.name} received: ${selected[0].name}.` : `${selected.length} file${selected.length === 1 ? "" : "s"} added.`);
    uploadTargetRef.current = null;
  }

  function downloadFile(record: ClientFileRecord) {
    if (!record.file) { setError("The contents of this file are unavailable."); return; }
    const url = URL.createObjectURL(record.file);
    const link = document.createElement("a");
    link.href = url;
    link.download = record.file.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
  }

  return <div className="space-y-6">
    <section aria-label="Client file statistics" className="grid gap-4 sm:grid-cols-3">
      <StatCard label="Requested Files" value={String(stats.requested)} icon={FileQuestion} iconClassName="text-violet-600 dark:text-violet-300" surfaceClassName="bg-[#F0F0FF] dark:bg-[#24213D]" />
      <StatCard label="Uploaded Files" value={String(stats.uploaded)} icon={Upload} iconClassName="text-sky-600 dark:text-sky-300" surfaceClassName="bg-[#E7F2FF] dark:bg-[#172C3F]" />
      <StatCard label="All Files" value={String(stats.all)} icon={Files} iconClassName="text-violet-600 dark:text-violet-300" surfaceClassName="bg-[#F0F0FF] dark:bg-[#24213D]" />
    </section>

    <section aria-labelledby="client-files-title" className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 id="client-files-title" className="text-base font-semibold text-slate-950 dark:text-zinc-100">Requests &amp; Files <span className="ml-2 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{stats.all}</span></h2>
          <p className="mt-1 break-words text-xs text-zinc-500 dark:text-zinc-400">Files for {client.user.name}. Requested files are awaiting upload.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button ref={requestButtonRef} type="button" onClick={(event) => openDialog({ type: "request" }, event.currentTarget)} className={secondaryButtonClass}><Plus aria-hidden="true" className="size-4" />Request File</button>
          <button type="button" onClick={() => fileInputRef.current?.click()} className={primaryButtonClass}><Upload aria-hidden="true" className="size-4" />Upload Files</button>
        </div>
      </header>
      <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">Files and requests are kept until the page is reloaded. Up to 25 MB per file. Requests are not sent by email.</p>
      <p role="status" className="mt-2 text-sm text-emerald-700 empty:hidden dark:text-emerald-300">{notice}</p>
      {error && <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
      <input ref={fileInputRef} type="file" multiple aria-label="Select files to upload" className="hidden" onChange={(event) => uploadFiles(event)} />
      <input ref={fulfillInputRef} type="file" aria-label="Select a file for this request" className="hidden" onChange={(event) => uploadFiles(event, true)} />

      <div tabIndex={0} role="region" aria-label="Client files table, scroll horizontally on smaller screens" className={`mt-5 overflow-x-auto rounded-lg ${focusClass}`}>
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <caption className="sr-only">Requested and uploaded files for {client.user.name}</caption>
          <thead><tr className="border-b border-zinc-100 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">{["File Name", "Requested On", "Status", "Actions"].map((label) => <th key={label} scope="col" className={`px-3 pb-4 font-medium ${label === "Actions" ? "text-right" : ""}`}>{label}</th>)}</tr></thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">{files.map((record) => {
            const Icon = kindIcons[record.kind];
            return <tr key={record.id} className="transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40">
              <th scope="row" className="max-w-80 px-3 py-5 text-left font-medium">
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className={`grid size-10 shrink-0 place-items-center rounded-xl ${kindColors[record.kind]}`}><Icon className="size-5" strokeWidth={1.8} /></span>
                  <div className="min-w-0 space-y-1"><p className="break-words text-sm font-medium text-slate-900 dark:text-zinc-100">{record.name}</p>
                    <p className="text-xs font-normal text-zinc-500 dark:text-zinc-400">{FILE_KINDS[record.kind]}{record.file ? ` · ${formatFileSize(record.file.size)}` : ""}</p>
                    {record.requestedName && record.requestedName !== record.name && <p className="break-words text-xs font-normal text-zinc-500 dark:text-zinc-400">Requested: {record.requestedName}</p>}
                    {record.description && <p className="line-clamp-2 break-words text-xs font-normal text-zinc-500 dark:text-zinc-400" title={record.description}>{record.description}</p>}
                  </div>
                </div>
              </th>
              <td className="whitespace-nowrap px-3 py-5 text-xs text-zinc-600 dark:text-zinc-300">{record.requestedAt ? <time dateTime={record.requestedAt}>{formatFileDate(record.requestedAt)}</time> : "Not requested"}</td>
              <td className="px-3 py-5"><span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${record.status === "uploaded" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300" : "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"}`}><span aria-hidden="true" className="size-1.5 rounded-full bg-current dark:bg-current" />{record.status === "uploaded" ? "Uploaded" : "Requested"}</span></td>
              <td className="px-3 py-5 text-right"><div className="flex justify-end gap-1">
                {record.status === "requested" ? <button type="button" title="Upload requested file" aria-label={`Upload ${record.name}`} onClick={() => {
                  uploadTargetRef.current = record;
                  if (fulfillInputRef.current) { fulfillInputRef.current.accept = acceptedFileTypes(record.kind) ?? ""; fulfillInputRef.current.click(); }
                }} className={iconButtonClass}><Upload aria-hidden="true" className="size-4" /></button> : <button type="button" title={record.file ? "Download file" : "File contents unavailable"} aria-label={`Download ${record.name}`} disabled={!record.file} onClick={() => downloadFile(record)} className={`${iconButtonClass} disabled:cursor-not-allowed disabled:opacity-40`}><Download aria-hidden="true" className="size-4" /></button>}
                <button type="button" title={record.status === "requested" ? "Cancel request" : "Remove file"} aria-label={`${record.status === "requested" ? "Cancel request for" : "Remove"} ${record.name}`} onClick={(event) => openDialog({ type: "remove", file: record }, event.currentTarget)} className={iconButtonClass}><Trash2 aria-hidden="true" className="size-4" /></button>
              </div></td>
            </tr>;
          })}
          {!files.length && <tr><td colSpan={4} className="py-14 text-center"><FolderOpen aria-hidden="true" className="mx-auto size-8 text-zinc-400 dark:text-zinc-500" /><p className="mt-3 font-medium text-zinc-700 dark:text-zinc-200">No files yet</p><p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Request a file or upload one for this client.</p></td></tr>}
          </tbody>
        </table>
      </div>
    </section>

    <dialog ref={dialogRef} aria-labelledby="client-file-dialog-title" onClose={() => {
      setDialog(null);
      const trigger = lastTriggerRef.current;
      (trigger?.isConnected ? trigger : requestButtonRef.current)?.focus();
    }} className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-0 text-slate-950 shadow-xl backdrop:bg-slate-950/40 backdrop:backdrop-blur-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:shadow-none dark:backdrop:bg-black/60">
      {dialog && <>
        <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-6 py-5 dark:border-zinc-800"><h2 id="client-file-dialog-title" className="text-base font-semibold">{dialog.type === "request" ? "Request File" : dialog.file.status === "requested" ? "Cancel Request" : "Remove File"}</h2><button type="button" aria-label="Close file dialog" onClick={() => dialogRef.current?.close()} className={iconButtonClass}><X aria-hidden="true" className="size-4" /></button></div>
        {dialog.type === "request" ? <form onSubmit={requestFile} className="space-y-5 p-6">
          <p className="break-words text-sm text-zinc-500 dark:text-zinc-400">Add a file request for {client.user.name}.</p>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">File name *<input name="name" required maxLength={160} autoFocus placeholder="e.g. Brand logo" className={fieldClass} aria-describedby={requestError ? "request-file-error" : undefined} aria-invalid={!!requestError} /></label>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">File type<select name="kind" defaultValue="other" className={fieldClass}>{Object.entries(FILE_KINDS).map(([value, label]) => <option key={value} value={value}>{value === "other" ? "Any file" : label}</option>)}</select></label>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Instructions (optional)<textarea name="description" rows={3} maxLength={2000} placeholder="Describe what you need from the client" className={fieldClass} /></label>
          {requestError && <p id="request-file-error" role="alert" className="text-sm text-red-600 dark:text-red-400">{requestError}</p>}
          <div className="flex flex-wrap justify-end gap-3 border-t border-zinc-100 pt-5 dark:border-zinc-800"><button type="button" onClick={() => dialogRef.current?.close()} className={secondaryButtonClass}>Cancel</button><button type="submit" className={primaryButtonClass}>Add request</button></div>
        </form> : <div className="space-y-5 p-6">
          <p className="break-words text-sm text-zinc-600 dark:text-zinc-300">{dialog.file.status === "requested" ? "Cancel the request for" : "Remove"} <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{dialog.file.name}</strong>?</p>
          <div className="flex flex-wrap justify-end gap-3"><button type="button" autoFocus onClick={() => dialogRef.current?.close()} className={secondaryButtonClass}>Keep {dialog.file.status === "requested" ? "request" : "file"}</button><button type="button" onClick={() => {
            removeFile(clientId, dialog.file.id);
            setNotice(dialog.file.status === "requested" ? `Request cancelled: ${dialog.file.name}.` : `File removed: ${dialog.file.name}.`);
            setError("");
            dialogRef.current?.close();
          }} className={`rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-500 dark:text-white dark:hover:bg-red-600 ${focusClass}`}>{dialog.file.status === "requested" ? "Cancel request" : "Remove file"}</button></div>
        </div>}
      </>}
    </dialog>
  </div>;
}
