"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { notFound } from "next/navigation";
import { BriefcaseBusiness, CalendarDays, Clock3, FileText, Inbox, Mail, MapPin, MessageSquare, Wallet } from "lucide-react";
import { StatCard } from "../overview/stat-card";
import { useClients } from "./clients-provider";
import { selectClientOverview } from "./client-overview-data";

const cardClass = "min-w-0 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6";
const mutedClass = "text-sm text-zinc-500 dark:text-zinc-400";
const badgeClass = "inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300";
const linkClass = "break-all rounded-sm text-blue-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 dark:text-blue-400 dark:focus-visible:outline-blue-400";
const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "Africa/Casablanca" });
const dateTimeFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Casablanca" });

function subscribeToClock(callback: () => void) {
  const interval = setInterval(callback, 30_000);
  return () => clearInterval(interval);
}
function clockSnapshot() { return Math.floor(Date.now() / 30_000) * 30_000; }
function serverClockSnapshot() { return null; }

function recordedDate(value?: string, includeTime = false) {
  if (!value || !Number.isFinite(Date.parse(value))) return "Not recorded";
  return (includeTime ? dateTimeFormatter : dateFormatter).format(new Date(value));
}

function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return <div className="flex min-h-48 flex-col items-center justify-center gap-3 px-3 py-8 text-center">
    <span aria-hidden="true" className="grid size-11 place-items-center rounded-xl bg-zinc-50 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">{icon}</span>
    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{title}</p>
    <p className={`max-w-xs text-xs ${mutedClass}`}>{description}</p>
  </div>;
}

export function ClientOverview({ clientId }: { clientId: string }) {
  const { clients } = useClients();
  const now = useSyncExternalStore(subscribeToClock, clockSnapshot, serverClockSnapshot);
  const client = clients.find((item) => item.id === clientId);
  if (!client) notFound();
  const overview = selectClientOverview(client.id, client.overview, now ?? Infinity);
  const meeting = overview.nextMeeting;
  const duration = meeting?.endsAt ? Math.round((Date.parse(meeting.endsAt) - Date.parse(meeting.startsAt)) / 60_000) : undefined;
  const meetingUrl = meeting?.meetingUrl && /^https?:\/\//i.test(meeting.meetingUrl) ? meeting.meetingUrl : undefined;
  const fields: { label: string; value: ReactNode }[] = [
    { label: "Company Type", value: client.companyType || "Not recorded" },
    { label: "Industry", value: client.industry || "Not recorded" },
    { label: "Primary Account", value: client.primaryAccount || client.user.name || "Not recorded" },
    { label: "Email", value: client.contact ? <a href={`mailto:${client.contact}`} className={linkClass}>{client.contact}</a> : "Not recorded" },
    { label: "Phone", value: client.phone ? <a href={`tel:${client.phone}`} className={linkClass}>{client.phone}</a> : "Not recorded" },
    { label: "Client Since", value: recordedDate(client.createdAt) },
    { label: "Billing Status", value: client.billingStatus ? <span className={badgeClass}>{client.billingStatus}</span> : "Not recorded" },
    { label: "Tags", value: client.tags?.length ? <div className="flex flex-wrap gap-1.5">{[...new Set(client.tags)].map((tag) => <span key={tag} className={`${badgeClass} max-w-full break-words`}>{tag}</span>)}</div> : "No tags recorded" },
  ];

  return <div className="space-y-6">
    <section aria-label="Client statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Active Projects" value={String(client.activeProjects)} icon={BriefcaseBusiness} iconClassName="text-violet-600 dark:text-violet-300" surfaceClassName="bg-[#F0F0FF] dark:bg-[#24213D]" />
      <StatCard wrapValue label="Pending Requests" value={overview.pendingRequests === undefined ? "Unavailable" : String(overview.pendingRequests)} icon={Inbox} iconClassName="text-blue-600 dark:text-blue-300" surfaceClassName="bg-[#E7F2FF] dark:bg-[#172C3F]" />
      <StatCard wrapValue label="Open Quotes" value={overview.openQuotes === undefined ? "Unavailable" : String(overview.openQuotes)} icon={FileText} iconClassName="text-violet-600 dark:text-violet-300" surfaceClassName="bg-[#F0F0FF] dark:bg-[#24213D]" />
      <div className="min-w-0 space-y-2">
        <StatCard wrapValue label="Total Spend" value={overview.spend === undefined ? "Unavailable" : overview.spend.length === 0 ? "No payments" : overview.spend.length > 1 ? "Multiple currencies" : overview.spend[0]} icon={Wallet} iconClassName="text-sky-600 dark:text-sky-300" surfaceClassName="bg-[#E7F2FF] dark:bg-[#172C3F]" />
        {overview.spend && overview.spend.length > 1 && <ul aria-label="Paid totals by currency" className={`space-y-1 px-2 ${mutedClass}`}>{overview.spend.map((total) => <li key={total}>{total}</li>)}</ul>}
      </div>
    </section>

    <div className="grid items-start gap-6 lg:grid-cols-3">
      <section aria-labelledby="recent-communication-title" className={`${cardClass} lg:col-span-2`}>
        <h2 id="recent-communication-title" className="text-sm font-semibold text-slate-950 dark:text-zinc-100">Recent Communication</h2>
        {overview.communications?.length ? <ul className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800">
          {overview.communications.map((entry) => {
            const Icon = entry.type === "email" ? Mail : entry.type === "project-update" ? BriefcaseBusiness : MessageSquare;
            return <li key={entry.id} className="flex gap-3 py-4">
              <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-xl bg-zinc-50 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"><Icon className="size-4" /></span>
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2"><p className="break-words text-sm font-medium text-slate-900 dark:text-zinc-100">{entry.subject}</p>{entry.read !== undefined && <span className={entry.read ? badgeClass : "rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-400/10 dark:text-blue-300"}>{entry.read ? "Read" : "Unread"}</span>}</div>
                <p className={`break-words ${mutedClass}`}>{entry.sender} · {entry.type === "project-update" ? "Project update" : entry.type === "email" ? "Email" : "Message"}</p>
                <time dateTime={entry.occurredAt} className="block text-xs text-zinc-400 dark:text-zinc-500">{recordedDate(entry.occurredAt, true)} (Casablanca)</time>
              </div>
            </li>;
          })}
        </ul> : <EmptyState icon={<MessageSquare className="size-5" />} title={overview.communications === undefined ? "Communication history unavailable" : "No communication yet"} description={overview.communications === undefined ? "Communication history is not available for this client." : "Interactions with this client will appear here."} />}
      </section>

      <section aria-labelledby="next-meeting-title" className={cardClass}>
        <h2 id="next-meeting-title" className="text-sm font-semibold text-slate-950 dark:text-zinc-100">Next Meeting</h2>
        {now === null && overview.meetingsAvailable ? <p role="status" className={`py-8 ${mutedClass}`}>Checking upcoming meetings…</p> : meeting ? <div className="mt-5 space-y-4">
          <span className={badgeClass}>{meeting.status === "confirmed" ? "Confirmed" : "Requested"}</span>
          <h3 className="break-words text-base font-semibold text-slate-900 dark:text-zinc-100">{meeting.title}</h3>
          <p className={`flex items-start gap-2 ${mutedClass}`}><CalendarDays aria-hidden="true" className="mt-0.5 size-4 shrink-0" /><time dateTime={meeting.startsAt}>{recordedDate(meeting.startsAt, true)} (Casablanca)</time></p>
          {duration !== undefined && Number.isFinite(duration) && duration > 0 && <p className={`flex items-center gap-2 ${mutedClass}`}><Clock3 aria-hidden="true" className="size-4" />{duration} minutes</p>}
          <div className={`flex items-start gap-2 ${mutedClass}`}><MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" /><div className="min-w-0 space-y-2">{meeting.location && <p className="break-words">{meeting.location}</p>}{meetingUrl ? <a href={meetingUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>Open meeting link<span className="sr-only"> (opens in a new tab)</span></a> : !meeting.location && "Location not recorded"}</div></div>
        </div> : <EmptyState icon={<CalendarDays className="size-5" />} title={overview.meetingsAvailable ? "No upcoming meetings" : "Meeting schedule unavailable"} description={overview.meetingsAvailable ? "There are no upcoming meetings with this client." : "Meeting information is not available for this client."} />}
      </section>
    </div>

    <section aria-labelledby="account-snapshot-title" className={cardClass}>
      <h2 id="account-snapshot-title" className="text-sm font-semibold text-slate-950 dark:text-zinc-100">Account Snapshot</h2>
      <dl className="mt-6 grid gap-x-6 gap-y-6 sm:grid-cols-2 xl:grid-cols-4">{fields.map((field) => <div key={field.label} className="min-w-0 space-y-2"><dt className="text-xs text-zinc-500 dark:text-zinc-400">{field.label}</dt><dd className="break-words text-sm font-medium text-zinc-800 dark:text-zinc-200">{field.value}</dd></div>)}</dl>
    </section>
  </div>;
}
