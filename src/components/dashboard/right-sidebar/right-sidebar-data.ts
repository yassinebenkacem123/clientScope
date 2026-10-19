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
  avatarUrl?: string;
  clientName?: string;
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
    context: "Website redesign • +$250 • 10 min ago",
    detail: "+$250",
    time: "10 min ago",
    kind: "scope",
    unread: true,
  },
  {
    id: "invoice-overdue",
    title: "Invoice overdue",
    context: "Branding project • Due yesterday",
    detail: "Due yesterday",
    time: "Due yesterday",
    kind: "invoice",
    unread: true,
  },
  {
    id: "client-message",
    title: "Client message unread",
    context: "Sarah Lopez sent feedback • 35 min ago",
    detail: "Feedback needs a response",
    time: "35 min ago",
    kind: "message",
    unread: true,
  },
  {
    id: "deadline-approaching",
    title: "Deadline approaching",
    context: "Landing page delivery • Tomorrow",
    detail: "Due tomorrow",
    time: "Tomorrow",
    kind: "deadline",
    unread: false,
  },
];

export const mockRecentActivityItems: RecentActivityItem[] = [
  {
    id: "feature-approved",
    title: "Extra feature approved",
    description: "+$180 added to project",
    time: "Just now",
    kind: "approval",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    clientName: "Sarah Lopez",
  },
  {
    id: "proposal-sent",
    title: "Proposal sent",
    description: "E-commerce store",
    time: "1 hour ago",
    kind: "proposal",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    clientName: "David Miller",
  },
  {
    id: "milestone-approved",
    title: "Client approved milestone",
    description: "Design phase completed",
    time: "3 hours ago",
    kind: "milestone",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    clientName: "Emily Chen",
  },
  {
    id: "meeting-scheduled",
    title: "Meeting scheduled",
    description: "Kickoff call with Veronica Hall",
    time: "5 hours ago",
    kind: "meeting",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    clientName: "Alex Rivera",
  },
  {
    id: "contract-signed",
    title: "Contract signed",
    description: "Brand Identity Project",
    time: "12 hours ago",
    kind: "contract",
    avatarUrl:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
    clientName: "Marcus Vance",
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
