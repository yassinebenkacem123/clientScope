export type ActionKind = "scope" | "invoice" | "message" | "deadline";
export type ActivityKind = "approval" | "proposal" | "milestone" | "meeting" | "contract";
export type ClientStatusTone = "emerald" | "amber" | "blue" | "violet" | "rose";

export type ActionCenterItem = {
  id: string;
  title: string;
  context: string;
  detail: string;
  time: string;
  kind: ActionKind;
  unread?: boolean;
  href?: string;
};

export type RecentActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  kind: ActivityKind;
  href?: string;
};

export type PriorityClient = {
  id: string;
  name: string;
  initials: string;
  status: string;
  statusTone: ClientStatusTone;
  avatarUrl?: string;
  href?: string;
};

// Temporary adapter data. Detail routes and authenticated workspace queries do
// not exist yet, so href values are intentionally omitted until they are real.
export const mockActionCenterItems: ActionCenterItem[] = [
  {
    id: "scope-request",
    title: "Scope request awaiting approval",
    context: "Website Redesign",
    detail: "Proposed additional price: +$250",
    time: "10 minutes ago",
    kind: "scope",
    unread: true,
  },
  {
    id: "invoice-overdue",
    title: "Invoice overdue",
    context: "Branding Project",
    detail: "Due yesterday",
    time: "Yesterday",
    kind: "invoice",
    unread: true,
  },
  {
    id: "client-message",
    title: "Client message unread",
    context: "Sarah Lopez sent feedback",
    detail: "Feedback needs a response",
    time: "35 minutes ago",
    kind: "message",
    unread: true,
  },
  {
    id: "deadline-approaching",
    title: "Deadline approaching",
    context: "Landing Page delivery",
    detail: "Due tomorrow",
    time: "Tomorrow",
    kind: "deadline",
  },
];

export const mockRecentActivityItems: RecentActivityItem[] = [
  {
    id: "feature-approved",
    title: "Extra feature approved",
    description: "+$180 added to Website Redesign",
    time: "Just now",
    kind: "approval",
  },
  {
    id: "proposal-sent",
    title: "Proposal sent",
    description: "E-commerce Store",
    time: "1 hour ago",
    kind: "proposal",
  },
  {
    id: "milestone-approved",
    title: "Client approved milestone",
    description: "Design phase completed",
    time: "3 hours ago",
    kind: "milestone",
  },
  {
    id: "meeting-scheduled",
    title: "Meeting scheduled",
    description: "Kickoff call with Veronica Hall",
    time: "5 hours ago",
    kind: "meeting",
  },
  {
    id: "contract-signed",
    title: "Contract signed",
    description: "Brand Identity Project",
    time: "12 hours ago",
    kind: "contract",
  },
];

export const mockPriorityClients: PriorityClient[] = [
  {
    id: "veronica-hall",
    name: "Veronica Hall",
    initials: "VH",
    status: "2 active projects",
    statusTone: "emerald",
  },
  {
    id: "drew-cano",
    name: "Drew Cano",
    initials: "DC",
    status: "Awaiting feedback",
    statusTone: "amber",
  },
  {
    id: "andi-lane",
    name: "Andi Lane",
    initials: "AL",
    status: "Invoice sent",
    statusTone: "blue",
  },
  {
    id: "koray-okumus",
    name: "Koray Okumus",
    initials: "KO",
    status: "Project starts Monday",
    statusTone: "violet",
  },
  {
    id: "kate-morrison",
    name: "Kate Morrison",
    initials: "KM",
    status: "New lead",
    statusTone: "emerald",
  },
  {
    id: "melody-macy",
    name: "Melody Macy",
    initials: "MM",
    status: "Scope review",
    statusTone: "rose",
  },
];
