import assert from "node:assert/strict";
import { selectClientOverview, type ClientOverviewData } from "../src/components/dashboard/clients/client-overview-data";

const data: ClientOverviewData = {
  requests: [
    { id: "r1", clientId: "one", status: "submitted" },
    { id: "r2", clientId: "one", status: "resolved" },
    { id: "r3", clientId: "two", status: "pending-review" },
  ],
  quotes: [
    { id: "q1", clientId: "one", status: "sent" },
    { id: "q2", clientId: "one", status: "accepted" },
    { id: "q3", clientId: "one", status: "superseded" },
    { id: "q4", clientId: "two", status: "pending-approval" },
  ],
  paidInvoices: [
    { id: "i1", clientId: "one", amountMinor: "101", currency: "USD" },
    { id: "i2", clientId: "one", amountMinor: "202", currency: "USD" },
    { id: "i3", clientId: "one", amountMinor: "500", currency: "EUR" },
    { id: "i4", clientId: "two", amountMinor: "99999", currency: "USD" },
  ],
  communications: [
    { id: "c1", clientId: "one", type: "email", subject: "Older", sender: "A", occurredAt: "2026-01-01T00:00:00Z" },
    { id: "c2", clientId: "two", type: "email", subject: "Private", sender: "B", occurredAt: "2026-04-01T00:00:00Z" },
    { id: "c3", clientId: "one", type: "message", subject: "Newer", sender: "A", occurredAt: "2026-02-01T00:00:00Z", read: false },
  ],
  meetings: [
    { id: "m1", clientId: "one", title: "Past", startsAt: "2025-01-01T00:00:00Z", status: "confirmed" },
    { id: "m2", clientId: "one", title: "Later", startsAt: "2026-03-01T00:00:00Z", status: "confirmed" },
    { id: "m3", clientId: "one", title: "Next", startsAt: "2026-02-01T00:00:00Z", status: "requested" },
    { id: "m4", clientId: "one", title: "Cancelled", startsAt: "2026-01-02T00:00:00Z", status: "cancelled" },
    { id: "m5", clientId: "two", title: "Other", startsAt: "2026-01-02T00:00:00Z", status: "confirmed" },
  ],
};
const now = Date.parse("2026-01-01T00:00:00Z");
const result = selectClientOverview("one", data, now);
assert.equal(result.pendingRequests, 1);
assert.equal(result.openQuotes, 1);
assert.deepEqual(result.spend, ["$3.03", "€5.00"]);
assert.deepEqual(result.communications?.map((item) => item.id), ["c3", "c1"]);
assert.equal(result.nextMeeting?.id, "m3");
assert.equal(selectClientOverview("two", data, now).nextMeeting?.id, "m5");
assert.equal(selectClientOverview("one", data, Date.parse("2027-01-01")).nextMeeting, undefined);
const unavailable = selectClientOverview("one", undefined, now);
assert.equal(unavailable.pendingRequests, undefined);
assert.equal(unavailable.spend, undefined);
assert.equal(unavailable.communications, undefined);
const empty = selectClientOverview("missing", data, now);
assert.equal(empty.pendingRequests, 0);
assert.deepEqual(empty.spend, []);
assert.deepEqual(empty.communications, []);
assert.equal(empty.nextMeeting, undefined);
console.log("PASS: client isolation, pending states, exact paid totals, communication ordering, upcoming meetings, and unavailable/empty sources.");
