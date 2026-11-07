"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useRef, useState } from "react";
import { CheckCircle2, Clock3, Copy, Eye, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { useClients } from "./clients-provider";
import { StatCard } from "../overview/stat-card";
import { getClientProjects, formatProjectBudget } from "./client-projects-data";
import { ClientQuoteForm } from "./client-quote-form";
import { getClientQuotes, latestClientQuotes, quoteDateKey, quoteDisplayStatus, quoteLineTotal, quoteStatistics, QUOTE_STATUSES, validateQuoteDraft, type ClientQuote, type QuoteDraft, type QuoteStatus } from "./client-quotes-data";
import { ClientDetailDialog, detailCard, detailDanger, detailDate, detailFocus, detailIconButton, detailMuted, detailPrimary, detailSecondary, useDetailClock } from "./client-detail-ui";

const badgeStyles: Record<QuoteStatus, string> = {
  DRAFT: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
  SENT: "bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300",
  APPROVED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  REJECTED: "bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-300",
  EXPIRED: "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
};
function QuoteBadge({ quote, today }: { quote: ClientQuote; today?: string }) {
  const status = quoteDisplayStatus(quote, today);
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${badgeStyles[status]}`}>{QUOTE_STATUSES[status]}</span>;
}
function reference(quote: ClientQuote) { return `QT-${String(quote.number).padStart(4, "0")} · v${quote.revisionNumber}`; }
type QuoteDialog = { type: "create" } | { type: "edit" | "view" | "prepare" | "delete"; quote: ClientQuote };

export function ClientQuotes({ clientId }: { clientId: string }) {
  const { clients, saveQuote, prepareQuote, removeQuote } = useClients();
  const [dialog, setDialog] = useState<QuoteDialog | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  const today = quoteDateKey(useDetailClock());
  const client = clients.find((item) => item.id === clientId);
  if (!client) notFound();
  const allQuotes = getClientQuotes(client);
  const quotes = latestClientQuotes(allQuotes);
  const stats = quoteStatistics(quotes, today);
  const hasProjects = getClientProjects(client).length > 0;
  const selected = dialog && "quote" in dialog ? dialog.quote : undefined;
  function open(value: QuoteDialog) { setError(""); setDialog(value); if (!dialogRef.current?.open) dialogRef.current?.showModal(); }
  function close() { dialogRef.current?.close(); }
  function save(draft: QuoteDraft) {
    saveQuote(clientId, draft, selected?.status === "DRAFT" ? selected.id : crypto.randomUUID(), selected?.id);
    setNotice(selected ? "Quote draft saved. Earlier revisions are preserved." : "Quote draft created.");
    close();
  }
  const history = selected ? allQuotes.filter((quote) => quote.familyId === selected.familyId).sort((a, b) => b.revisionNumber - a.revisionNumber) : [];
  return <div className="space-y-6">
    <section aria-label="Client quote statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="All Quotes" value={String(stats.all)} icon={FileText} iconClassName="text-violet-600 dark:text-violet-300" surfaceClassName="bg-[#F0F0FF] dark:bg-[#24213D]" />
      <StatCard label="Draft Quotes" value={String(stats.drafts)} icon={Pencil} iconClassName="text-sky-600 dark:text-sky-300" surfaceClassName="bg-[#E7F2FF] dark:bg-[#172C3F]" />
      <StatCard label="Awaiting Approval" value={String(stats.awaiting)} icon={Clock3} iconClassName="text-violet-600 dark:text-violet-300" surfaceClassName="bg-[#F0F0FF] dark:bg-[#24213D]" />
      <StatCard label="Approved Quotes" value={String(stats.approved)} icon={CheckCircle2} iconClassName="text-sky-600 dark:text-sky-300" surfaceClassName="bg-[#E7F2FF] dark:bg-[#172C3F]" />
    </section>
    <section aria-labelledby="client-quotes-title" className={detailCard}>
      <header className="flex flex-wrap items-center justify-between gap-4"><div><h2 id="client-quotes-title" className="text-base font-semibold text-slate-950 dark:text-zinc-100">Quotes</h2><p className={`mt-1 ${detailMuted}`}>Estimates and scope revisions for {client.user.name}.</p></div><button ref={addRef} type="button" disabled={!hasProjects} onClick={() => open({ type: "create" })} className={`${detailPrimary} disabled:cursor-not-allowed disabled:opacity-40`}><Plus aria-hidden="true" className="size-4" />Create Quote</button></header>
      <p className={`mt-4 ${detailMuted}`}>Quotes are kept until reload. Client delivery and verified acceptance are not connected.</p>
      {!hasProjects && <p className={`mt-2 ${detailMuted}`}><Link href={`/dashboard/clients/${encodeURIComponent(clientId)}/projects`} className={`rounded-sm text-blue-600 underline dark:text-blue-400 ${detailFocus}`}>Add a project</Link> before creating a quote.</p>}
      <p role="status" className="mt-2 text-sm text-emerald-700 empty:hidden dark:text-emerald-300">{notice}</p>
      <div tabIndex={0} role="region" aria-label="Client quotes table, scroll horizontally on smaller screens" className={`mt-5 overflow-x-auto rounded-lg ${detailFocus}`}>
        <table className="w-full min-w-[800px] border-collapse text-left text-sm"><caption className="sr-only">Latest quote revisions for {client.user.name}</caption><thead><tr className="border-b border-zinc-100 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">{["Quote", "Project", "Amount", "Valid Until", "Status", "Actions"].map((label) => <th key={label} scope="col" className={`px-3 pb-4 font-medium ${label === "Actions" ? "text-right" : ""}`}>{label}</th>)}</tr></thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">{quotes.map((quote) => <tr key={quote.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40">
            <th scope="row" className="max-w-64 px-3 py-5 text-left"><button type="button" onClick={() => open({ type: "view", quote })} className={`rounded-sm text-left text-sm font-medium text-slate-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400 ${detailFocus}`}><span className="line-clamp-2 break-words">{quote.title}</span></button><p className={`mt-1 font-normal ${detailMuted}`}>{reference(quote)}</p></th>
            <td className="max-w-48 break-words px-3 py-5 text-xs text-zinc-600 dark:text-zinc-300">{quote.projectName}</td><td className="whitespace-nowrap px-3 py-5 text-xs text-zinc-600 dark:text-zinc-300">{formatProjectBudget(quote.totalAmount, quote.currency)}</td><td className="whitespace-nowrap px-3 py-5 text-xs text-zinc-600 dark:text-zinc-300">{quote.validUntil ? <time dateTime={quote.validUntil}>{detailDate(quote.validUntil)}</time> : "No expiry"}</td><td className="px-3 py-5"><QuoteBadge quote={quote} today={today} /></td>
            <td className="px-3 py-5"><div className="flex justify-end gap-1"><button type="button" aria-label={`View ${quote.title}`} title="View quote and revisions" onClick={() => open({ type: "view", quote })} className={detailIconButton}><Eye aria-hidden="true" className="size-4" /></button><button type="button" aria-label={`${quote.status === "DRAFT" ? "Edit" : "Create revision of"} ${quote.title}`} title={quote.status === "DRAFT" ? "Edit draft" : "Create revision"} onClick={() => open({ type: "edit", quote })} className={detailIconButton}>{quote.status === "DRAFT" ? <Pencil aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}</button>{quote.status === "DRAFT" && <button type="button" aria-label={`Delete draft ${quote.title}`} title="Delete draft" onClick={() => open({ type: "delete", quote })} className={detailIconButton}><Trash2 aria-hidden="true" className="size-4" /></button>}</div></td>
          </tr>)}{!quotes.length && <tr><td colSpan={6} className="py-14 text-center"><FileText aria-hidden="true" className="mx-auto size-8 text-zinc-400 dark:text-zinc-500" /><p className="mt-3 font-medium text-zinc-700 dark:text-zinc-200">No quotes yet</p><p className={`mt-1 ${detailMuted}`}>Create a project quote with the work and price clearly defined.</p></td></tr>}</tbody>
        </table>
      </div>
    </section>
    <ClientDetailDialog dialogRef={dialogRef} title={dialog?.type === "create" ? "Create Quote" : dialog?.type === "edit" ? selected?.status === "DRAFT" ? "Edit Draft" : "Create Quote Revision" : dialog?.type === "delete" ? "Delete Quote Draft" : dialog?.type === "prepare" ? "Review for Approval" : "Quote Details"} onClose={() => { setDialog(null); addRef.current?.focus(); }}>
      {(dialog?.type === "create" || dialog?.type === "edit") && <ClientQuoteForm key={selected?.id ?? "new"} client={client} source={selected} onSave={save} onCancel={close} />}
      {(dialog?.type === "view" || dialog?.type === "prepare") && selected && <div className="space-y-5 p-6">
        <div className="space-y-2"><QuoteBadge quote={selected} today={today} /><h3 className="break-words text-xl font-semibold">{selected.title}</h3><p className={detailMuted}>{reference(selected)} · {selected.projectName}</p><p className={detailMuted}>Valid until: {selected.validUntil ? detailDate(selected.validUntil) : "No expiry"}</p></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[480px] text-left text-sm"><caption className="sr-only">Quote line items</caption><thead><tr className="border-b border-zinc-100 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">{["Description", "Quantity", "Unit Price", "Total"].map((label) => <th key={label} scope="col" className="p-2 font-medium">{label}</th>)}</tr></thead><tbody>{selected.items.map((item, index) => <tr key={index} className="border-b border-zinc-100 text-zinc-700 dark:border-zinc-800 dark:text-zinc-200"><td className="max-w-64 break-words p-2">{item.description}</td><td className="p-2">{item.quantity}</td><td className="whitespace-nowrap p-2">{formatProjectBudget(item.unitPrice, selected.currency)}</td><td className="whitespace-nowrap p-2">{formatProjectBudget(quoteLineTotal(item)!, selected.currency)}</td></tr>)}</tbody></table></div>
        <p className="text-right text-lg font-semibold">Total: {formatProjectBudget(selected.totalAmount, selected.currency)}</p><div><h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Scope &amp; terms</h4><p className="mt-2 whitespace-pre-wrap break-words text-sm text-zinc-700 dark:text-zinc-200">{selected.terms || "No additional terms recorded."}</p></div>
        {history.length > 1 && <div><h4 className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">Revision history</h4><div className="flex flex-wrap gap-2">{history.map((quote) => <button key={quote.id} type="button" aria-pressed={quote.id === selected.id} onClick={() => open({ type: "view", quote })} className={detailSecondary}>v{quote.revisionNumber} · {QUOTE_STATUSES[quote.status]}</button>)}</div></div>}
        {dialog.type === "prepare" && <p className="rounded-xl bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-400/10 dark:text-blue-300">This freezes this revision for client review in this session. No message is sent, and no client acceptance is recorded.</p>}
        {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <div className="flex flex-wrap justify-end gap-3 border-t border-zinc-100 pt-5 dark:border-zinc-800"><button type="button" onClick={close} className={detailSecondary}>Close</button>{selected.status === "DRAFT" && quotes.some((quote) => quote.id === selected.id) && (dialog.type === "view" ? <button type="button" onClick={() => open({ type: "prepare", quote: selected })} className={detailPrimary}>Review for approval</button> : <button type="button" onClick={() => {
          const currentDate = quoteDateKey(Date.now())!;
          const invalid = validateQuoteDraft(selected, client) || (selected.validUntil && selected.validUntil < currentDate ? "Update the expired validity date before preparing this quote." : null);
          if (invalid) { setError(invalid); return; }
          prepareQuote(clientId, selected.id, currentDate); setNotice("Quote marked awaiting approval in this session."); close();
        }} className={detailPrimary}>Mark awaiting approval</button>)}</div>
      </div>}
      {dialog?.type === "delete" && <div className="space-y-5 p-6"><p className="break-words text-sm text-zinc-600 dark:text-zinc-300">Delete the draft <strong>{dialog.quote.title}</strong>? Earlier revisions will be preserved.</p><div className="flex flex-wrap justify-end gap-3"><button type="button" autoFocus onClick={close} className={detailSecondary}>Cancel</button><button type="button" onClick={() => { removeQuote(clientId, dialog.quote.id); setNotice("Quote draft deleted."); close(); }} className={detailDanger}>Delete draft</button></div></div>}
    </ClientDetailDialog>
  </div>;
}
