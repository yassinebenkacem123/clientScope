"use client";

import { useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { X } from "lucide-react";

export const detailFocus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900 dark:focus-visible:outline-zinc-100";
export const detailPrimary = `inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 ${detailFocus}`;
export const detailSecondary = `inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 ${detailFocus}`;
export const detailIconButton = `inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 ${detailFocus}`;
export const detailField = "mt-2 w-full min-h-11 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:hover:border-zinc-600 dark:focus:border-zinc-400 dark:focus:ring-white/10";
export const detailLabel = "block min-w-0 text-xs font-medium text-zinc-700 dark:text-zinc-300";
export const detailCard = "rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6";
export const detailMuted = "text-xs text-zinc-500 dark:text-zinc-400";
export const detailDanger = `rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-500 dark:text-white dark:hover:bg-red-600 ${detailFocus}`;

export function ClientDetailDialog({ dialogRef, title, onClose, children }: {
  dialogRef: RefObject<HTMLDialogElement | null>; title: string; onClose: () => void; children: ReactNode;
}) {
  return <dialog ref={dialogRef} aria-label={title} onClose={onClose} className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-0 text-slate-950 shadow-xl backdrop:bg-slate-950/40 backdrop:backdrop-blur-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:shadow-none dark:backdrop:bg-black/60">
    <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-6 py-5 dark:border-zinc-800"><h2 className="text-base font-semibold">{title}</h2><button type="button" aria-label="Close dialog" onClick={() => dialogRef.current?.close()} className={detailIconButton}><X aria-hidden="true" className="size-4" /></button></div>
    {children}
  </dialog>;
}

export function detailDate(value: string, withTime = false) {
  if (!value || !Number.isFinite(Date.parse(value))) return "Not recorded";
  return new Intl.DateTimeFormat("en-US", withTime
    ? { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Casablanca" }
    : { dateStyle: "medium", timeZone: "UTC" }).format(new Date(value));
}
const subscribe = (callback: () => void) => { const interval = setInterval(callback, 30_000); return () => clearInterval(interval); };
const snapshot = () => Math.floor(Date.now() / 30_000) * 30_000;
const serverSnapshot = () => null;
export function useDetailClock() { return useSyncExternalStore(subscribe, snapshot, serverSnapshot); }
