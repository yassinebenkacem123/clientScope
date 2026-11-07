"use client";

import { useRef, useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { ClientRecord } from "./clients-data";
import { getClientProjects, PROJECT_CURRENCIES, formatProjectBudget } from "./client-projects-data";
import { quoteLineTotal, quoteTotal, validateQuoteDraft, type ClientQuote, type QuoteDraft } from "./client-quotes-data";
import { detailField, detailIconButton, detailLabel, detailMuted, detailPrimary, detailSecondary } from "./client-detail-ui";

export function ClientQuoteForm({ client, source, onSave, onCancel }: {
  client: ClientRecord; source?: ClientQuote; onSave: (draft: QuoteDraft) => void; onCancel: () => void;
}) {
  const projects = getClientProjects(client);
  const [currency, setCurrency] = useState(source?.currency ?? "USD");
  const [items, setItems] = useState(() => (source?.items ?? [{ description: "", quantity: "1", unitPrice: "" }]).map((item, index) => ({ ...item, key: `initial-${index}` })));
  const nextKey = useRef(0);
  const [error, setError] = useState("");
  const total = quoteTotal(items);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const draft: QuoteDraft = { title: String(data.get("title") ?? "").trim(), projectId: String(data.get("projectId") ?? ""),
      currency, validUntil: String(data.get("validUntil") ?? ""), terms: String(data.get("terms") ?? "").trim(),
      items: items.map((item) => ({ description: item.description.trim(), quantity: item.quantity.trim(), unitPrice: item.unitPrice.trim() })) };
    const invalid = validateQuoteDraft(draft, client);
    if (invalid) { setError(invalid); return; }
    onSave(draft);
  }
  function updateItem(index: number, field: "description" | "quantity" | "unitPrice", value: string) {
    setItems((current) => current.map((item, row) => row === index ? { ...item, [field]: value } : item));
  }
  return <form onSubmit={submit} className="space-y-5 p-6">
    <p className={detailMuted}>Quote for {client.user.name}{source ? ` · Revision ${source.revisionNumber + (source.status === "DRAFT" ? 0 : 1)}` : ""}. Saving creates a draft.</p>
    <label className={detailLabel}>Quote title *<input name="title" required maxLength={160} autoFocus defaultValue={source?.title} placeholder="e.g. Website design and development" className={detailField} /></label>
    <div className="grid gap-5 sm:grid-cols-2">
      <label className={detailLabel}>Project *<select name="projectId" required defaultValue={source?.projectId ?? projects[0]?.id ?? ""} className={detailField}>
        <option value="" disabled>Choose a project</option>{source && !projects.some((project) => project.id === source.projectId) && <option value={source.projectId} disabled>{source.projectName} (unavailable)</option>}{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
      </select></label>
      <label className={detailLabel}>Currency *<select value={currency} onChange={(event) => setCurrency(event.target.value)} className={detailField}>{PROJECT_CURRENCIES.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label className={detailLabel}>Valid until (optional)<input type="date" name="validUntil" defaultValue={source?.validUntil} className={detailField} /></label>
    </div>
    <fieldset className="space-y-3">
      <legend className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Line items</legend>
      {items.map((item, index) => {
        const line = quoteLineTotal(item);
        return <div key={item.key} className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
          <label className={detailLabel}>Item {index + 1} description *<input required maxLength={500} value={item.description} onChange={(event) => updateItem(index, "description", event.target.value)} placeholder="Describe the work included" className={detailField} /></label>
          <div className="grid grid-cols-2 items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <label className={detailLabel}>Quantity *<input required inputMode="decimal" maxLength={13} value={item.quantity} onChange={(event) => updateItem(index, "quantity", event.target.value)} className={detailField} /></label>
            <label className={detailLabel}>Unit price *<input required inputMode="decimal" maxLength={13} value={item.unitPrice} onChange={(event) => updateItem(index, "unitPrice", event.target.value)} placeholder="0.00" className={detailField} /></label>
            <button type="button" aria-label={`Remove line item ${index + 1}`} disabled={items.length === 1} onClick={() => setItems((current) => current.filter((_, row) => row !== index))} className={`${detailIconButton} disabled:cursor-not-allowed disabled:opacity-40`}><Trash2 aria-hidden="true" className="size-4" /></button>
          </div>
          <p className={`text-right ${detailMuted}`}>Line total: {line === null ? "—" : formatProjectBudget(line, currency)}</p>
        </div>;
      })}
      <button type="button" disabled={items.length >= 50} onClick={() => setItems((current) => [...current, { key: `added-${nextKey.current++}`, description: "", quantity: "1", unitPrice: "" }])} className={`${detailSecondary} disabled:opacity-40`}><Plus aria-hidden="true" className="size-4" />Add line item</button>
    </fieldset>
    <div aria-live="polite" className="flex flex-wrap justify-between gap-3 rounded-xl bg-zinc-50 p-4 text-sm font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"><span>Total</span><span>{total === null ? "Complete the line items" : formatProjectBudget(total, currency)}</span></div>
    <p className={detailMuted}>Line totals are rounded to two decimals. Taxes and discounts can be described in the terms; they are not added automatically.</p>
    <label className={detailLabel}>Scope, terms &amp; payment schedule (optional)<textarea name="terms" rows={4} maxLength={5000} defaultValue={source?.terms} placeholder="Describe included work, payment milestones, and any conditions" className={detailField} /></label>
    {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    <div className="flex flex-wrap justify-end gap-3 border-t border-zinc-100 pt-5 dark:border-zinc-800"><button type="button" onClick={onCancel} className={detailSecondary}>Cancel</button><button type="submit" className={detailPrimary}>Save draft</button></div>
  </form>;
}
