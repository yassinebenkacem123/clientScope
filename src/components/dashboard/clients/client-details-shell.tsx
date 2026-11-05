"use client";

import Link from "next/link";
import { notFound, usePathname } from "next/navigation";
import { ArrowLeft, CalendarDays, Pencil, X } from "lucide-react";
import { useRef, type FormEvent } from "react";
import { useClients } from "./clients-provider";

const sections = [
  { label: "Overview", path: "" },
  { label: "Projects", path: "/projects" },
  { label: "Requests & Files", path: "/requests-files" },
  { label: "Quotes", path: "/quotes" },
  { label: "Notes", path: "/notes" },
] as const;

const focusClass = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900 dark:focus-visible:outline-zinc-100";
const fieldClass = "mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-900 outline-none transition-colors hover:border-zinc-300 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-zinc-600 dark:focus:border-zinc-400 dark:focus:ring-white/10";
const secondaryButtonClass = `inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 ${focusClass}`;

export function ClientDetailsShell({ clientId, children }: { clientId: string; children: React.ReactNode }) {
  const { clients, updateClient } = useClients();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const client = clients.find((item) => item.id === clientId);

  if (!client) notFound();

  const isActive = client.isActive ?? client.activeProjects > 0;
  const basePath = `/dashboard/clients/${encodeURIComponent(client.id)}`;
  const initials = client.user.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("");
  const createdDate = client.createdAt
    ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "Africa/Casablanca" }).format(new Date(client.createdAt))
    : null;

  function saveClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) return;
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    if (!name || !email) return;

    updateClient({
      ...client,
      user: { ...client.user, name },
      contact: email,
      isActive: form.get("activity") === "active",
    });
    dialogRef.current?.close();
  }

  return (
    <section aria-labelledby="client-name" className="space-y-7">
      <Link href="/dashboard/clients" className={`inline-flex items-center gap-2 rounded-sm text-xs font-medium text-zinc-500 transition-colors hover:text-slate-950 dark:text-zinc-400 dark:hover:text-zinc-100 ${focusClass}`}>
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        All clients
      </Link>

      <header className="space-y-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-4">
            <div aria-hidden="true" className="grid size-16 shrink-0 place-items-center rounded-2xl bg-violet-50 text-xl font-semibold text-violet-600 ring-1 ring-violet-100 dark:bg-violet-400/10 dark:text-violet-300 dark:ring-violet-400/20">
              {initials}
            </div>
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h1 id="client-name" className="break-words text-2xl font-bold tracking-tight text-slate-950 dark:text-zinc-100">{client.user.name}</h1>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${isActive ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                  <span aria-hidden="true" className={`size-1.5 rounded-full ${isActive ? "bg-emerald-500 dark:bg-emerald-400" : "bg-zinc-400 dark:bg-zinc-500"}`} />
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="break-all text-sm text-zinc-500 dark:text-zinc-400">{client.contact}</p>
            </div>
          </div>
          <button type="button" onClick={() => dialogRef.current?.showModal()} className={`${secondaryButtonClass} shrink-0 self-start sm:self-auto`}>
            <Pencil aria-hidden="true" className="size-3.5" />
            Edit client
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="font-medium text-zinc-600 dark:text-zinc-300">{client.clientId}</span>
          <span className="inline-flex items-center gap-2">
            <CalendarDays aria-hidden="true" className="size-3.5" />
            <span>Created <span className="ml-1 font-medium text-zinc-700 dark:text-zinc-300">{createdDate ? <time dateTime={client.createdAt}>{createdDate}</time> : "Not recorded"}</span></span>
          </span>
        </div>

        <nav aria-label="Client sections" className="flex gap-6 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800 sm:gap-8">
          {sections.map((section) => {
            const href = `${basePath}${section.path}`;
            const active = pathname === href;
            return (
              <Link key={section.label} href={href} aria-current={active ? "page" : undefined} className={`shrink-0 border-b-2 px-0.5 pb-3.5 pt-1 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-slate-900 dark:focus-visible:outline-zinc-100 ${active ? "border-slate-900 text-slate-950 dark:border-zinc-100 dark:text-zinc-100" : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-slate-900 dark:border-transparent dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-100"}`}>
                {section.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {children}

      <dialog ref={dialogRef} aria-labelledby="edit-client-title" className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-zinc-200 bg-white p-0 text-slate-950 shadow-xl backdrop:bg-slate-950/40 backdrop:backdrop-blur-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:shadow-none dark:backdrop:bg-black/60">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5 dark:border-zinc-800">
          <h2 id="edit-client-title" className="text-base font-semibold">Edit client</h2>
          <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close edit client" className={`rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 ${focusClass}`}>
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
        <form key={`${client.user.name}-${client.contact}-${isActive}`} onSubmit={saveClient} className="space-y-5 p-6">
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Client name
            <input name="name" autoComplete="name" required maxLength={120} defaultValue={client.user.name} className={fieldClass} />
          </label>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Email address
            <input name="email" type="email" autoComplete="email" required defaultValue={client.contact} className={fieldClass} />
          </label>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Client status
            <select name="activity" defaultValue={isActive ? "active" : "inactive"} className={fieldClass}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => dialogRef.current?.close()} className={secondaryButtonClass}>Cancel</button>
            <button type="submit" className={`h-10 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 ${focusClass}`}>Save changes</button>
          </div>
        </form>
      </dialog>
    </section>
  );
}
