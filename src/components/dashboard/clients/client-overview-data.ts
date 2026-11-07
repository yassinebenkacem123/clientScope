// Optional collections distinguish an unavailable source from a loaded, empty source.
// These are view data, not Prisma models; populate them only from authorized services.
type ClientItem = { id: string; clientId: string };

export type ClientOverviewData = {
  requests?: (ClientItem & { status: "submitted" | "pending-review" | "in-progress" | "resolved" | "closed" })[];
  quotes?: (ClientItem & { status: "draft" | "sent" | "pending-approval" | "accepted" | "rejected" | "expired" | "superseded" })[];
  paidInvoices?: (ClientItem & { amountMinor: string; currency: string })[];
  communications?: (ClientItem & {
    type: "message" | "email" | "project-update";
    subject: string;
    sender: string;
    occurredAt: string;
    read?: boolean;
  })[];
  meetings?: (ClientItem & {
    title: string;
    startsAt: string;
    endsAt?: string;
    location?: string;
    meetingUrl?: string;
    status: "requested" | "confirmed" | "cancelled" | "declined" | "completed";
  })[];
};

export function selectClientOverview(clientId: string, data: ClientOverviewData | undefined, now: number) {
  const requests = data?.requests?.filter((item) => item.clientId === clientId);
  const quotes = data?.quotes?.filter((item) => item.clientId === clientId);
  const invoices = data?.paidInvoices?.filter((item) => item.clientId === clientId);
  const totals = new Map<string, bigint>();
  for (const invoice of invoices ?? []) {
    // Integer minor units preserve exact amounts; never combine different currencies.
    totals.set(invoice.currency, (totals.get(invoice.currency) ?? BigInt(0)) + BigInt(invoice.amountMinor));
  }

  return {
    pendingRequests: requests?.filter((item) => ["submitted", "pending-review"].includes(item.status)).length,
    openQuotes: quotes?.filter((item) => ["sent", "pending-approval"].includes(item.status)).length,
    spend: invoices === undefined ? undefined : [...totals].map(([currency, amount]) => formatMinorUnits(amount, currency)),
    communications: data?.communications?.filter((item) => item.clientId === clientId && Number.isFinite(Date.parse(item.occurredAt)))
      .sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt)).slice(0, 5),
    nextMeeting: data?.meetings?.filter((item) => item.clientId === clientId && ["requested", "confirmed"].includes(item.status) && Date.parse(item.startsAt) > now)
      .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))[0],
    meetingsAvailable: data?.meetings !== undefined,
  };
}

function formatMinorUnits(amount: bigint, currency: string) {
  const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency });
  const digits = formatter.resolvedOptions().maximumFractionDigits ?? 0;
  const divisor = BigInt(10) ** BigInt(digits);
  const fraction = (amount % divisor).toString().padStart(digits, "0");
  return formatter.formatToParts(amount / divisor).map((part) => part.type === "fraction" ? fraction : part.value).join("");
}
