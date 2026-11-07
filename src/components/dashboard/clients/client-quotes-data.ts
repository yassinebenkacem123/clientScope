import type { ClientRecord } from "./clients-data";
import { getClientProjects, PROJECT_CURRENCIES } from "./client-projects-data";

export const QUOTE_STATUSES = { DRAFT: "Draft", SENT: "Awaiting approval", APPROVED: "Approved", REJECTED: "Rejected", EXPIRED: "Expired" } as const;
export type QuoteStatus = keyof typeof QUOTE_STATUSES;
export type QuoteItem = { description: string; quantity: string; unitPrice: string };
export type QuoteDraft = { title: string; projectId: string; currency: string; validUntil: string; terms: string; items: QuoteItem[] };
export type ClientQuote = QuoteDraft & {
  id: string; clientId: string; familyId: string; number: number; revisionNumber: number;
  projectName: string; totalAmount: string; status: QuoteStatus; createdAt: string; updatedAt: string;
};

const maxMinor = BigInt("999999999999");
const decimalPattern = /^\d{1,10}(\.\d{1,2})?$/;
function minor(value: string) {
  const [whole, fraction = ""] = value.split(".");
  return BigInt(whole) * BigInt(100) + BigInt(fraction.padEnd(2, "0"));
}
function decimal(value: bigint) { return `${value / BigInt(100)}.${(value % BigInt(100)).toString().padStart(2, "0")}`; }

export function quoteLineTotal(item: QuoteItem): string | null {
  if (!decimalPattern.test(item.quantity) || !decimalPattern.test(item.unitPrice)) return null;
  const quantity = minor(item.quantity);
  const price = minor(item.unitPrice);
  if (quantity <= BigInt(0) || quantity > maxMinor || price > maxMinor) return null;
  // Quantity and price each have two decimals; round each line half-up to cents.
  const line = (quantity * price + BigInt(50)) / BigInt(100);
  return line <= maxMinor ? decimal(line) : null;
}

export function quoteTotal(items: QuoteItem[]): string | null {
  if (!items.length || items.length > 50) return null;
  let total = BigInt(0);
  for (const item of items) {
    const line = quoteLineTotal(item);
    if (line === null) return null;
    total += minor(line);
  }
  return total <= maxMinor ? decimal(total) : null;
}

export function getClientQuotes(client: ClientRecord) {
  return (client.quotes ?? []).filter((quote) => quote.clientId === client.id);
}
export function latestClientQuotes(quotes: ClientQuote[]) {
  const latest = new Map<string, ClientQuote>();
  for (const quote of quotes) {
    if ((latest.get(quote.familyId)?.revisionNumber ?? 0) < quote.revisionNumber) latest.set(quote.familyId, quote);
  }
  return [...latest.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function quoteDisplayStatus(quote: ClientQuote, today?: string): QuoteStatus {
  return quote.status === "SENT" && today && quote.validUntil && quote.validUntil < today ? "EXPIRED" : quote.status;
}
export function quoteDateKey(timestamp: number | null) {
  if (timestamp === null) return undefined;
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Africa/Casablanca", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(timestamp));
  const part = (type: string) => parts.find((item) => item.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
export function quoteStatistics(quotes: ClientQuote[], today?: string) {
  return { all: quotes.length, drafts: quotes.filter((quote) => quote.status === "DRAFT").length,
    awaiting: quotes.filter((quote) => quoteDisplayStatus(quote, today) === "SENT").length,
    approved: quotes.filter((quote) => quote.status === "APPROVED").length };
}
export function validateQuoteDraft(draft: QuoteDraft, client: ClientRecord) {
  if (!draft.title.trim() || draft.title.trim().length > 160) return "Enter a quote title of up to 160 characters.";
  if (!getClientProjects(client).some((project) => project.id === draft.projectId)) return "Choose a project belonging to this client.";
  if (!PROJECT_CURRENCIES.some((currency) => currency === draft.currency)) return "Choose a supported currency.";
  if (draft.validUntil && (!/^\d{4}-\d{2}-\d{2}$/.test(draft.validUntil) || !Number.isFinite(Date.parse(draft.validUntil)) || new Date(draft.validUntil).toISOString().slice(0, 10) !== draft.validUntil)) return "Enter a valid expiry date.";
  if (draft.terms.length > 5000) return "Keep terms within 5,000 characters.";
  if (draft.items.some((item) => !item.description.trim() || item.description.trim().length > 500)) return "Each line item needs a description of up to 500 characters.";
  if (quoteTotal(draft.items) === null) return "Add 1–50 valid line items. Quantities must be positive; prices nonnegative, with up to two decimal places. The total must be below 10 billion.";
  return null;
}

export function saveQuoteDraft(clients: ClientRecord[], clientId: string, draft: QuoteDraft, id: string, timestamp: string, sourceId?: string) {
  return clients.map((client) => {
    if (client.id !== clientId || validateQuoteDraft(draft, client)) return client;
    const quotes = getClientQuotes(client);
    const source = sourceId ? quotes.find((quote) => quote.id === sourceId) : undefined;
    if (sourceId && (!source || !latestClientQuotes(quotes).some((quote) => quote.id === sourceId))) return client;
    if (quotes.some((quote) => quote.id === id && quote.id !== source?.id)) return client;
    const editing = source?.status === "DRAFT";
    if (!editing && id === source?.id) return client;
    const quote: ClientQuote = {
      ...draft, title: draft.title.trim(), terms: draft.terms.trim(),
      items: draft.items.map((item) => ({ description: item.description.trim(), quantity: item.quantity, unitPrice: item.unitPrice })),
      id: editing ? source.id : id, clientId, familyId: source?.familyId ?? id,
      number: source?.number ?? Math.max(0, ...quotes.map((item) => item.number)) + 1,
      revisionNumber: source ? source.revisionNumber + (editing ? 0 : 1) : 1,
      projectName: getClientProjects(client).find((project) => project.id === draft.projectId)!.name,
      totalAmount: quoteTotal(draft.items)!, status: "DRAFT",
      createdAt: editing ? source.createdAt : timestamp, updatedAt: timestamp,
    };
    return { ...client, quotes: editing ? quotes.map((item) => item.id === source.id ? quote : item) : [quote, ...quotes] };
  });
}

export function prepareClientQuote(clients: ClientRecord[], clientId: string, quoteId: string, timestamp: string, today: string) {
  return clients.map((client) => {
    if (client.id !== clientId) return client;
    const quotes = getClientQuotes(client);
    const target = latestClientQuotes(quotes).find((quote) => quote.id === quoteId);
    if (!target || target.status !== "DRAFT" || validateQuoteDraft(target, client) || (target.validUntil && target.validUntil < today)) return client;
    return { ...client, quotes: quotes.map((quote) => quote.id === quoteId ? { ...quote, status: "SENT" as const, updatedAt: timestamp } : quote) };
  });
}
export function deleteQuoteDraft(clients: ClientRecord[], clientId: string, quoteId: string) {
  return clients.map((client) => client.id !== clientId ? client : {
    ...client, quotes: getClientQuotes(client).filter((quote) => quote.id !== quoteId || quote.status !== "DRAFT"),
  });
}
