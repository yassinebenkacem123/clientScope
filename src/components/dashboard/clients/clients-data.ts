export type ClientStatus = "in-progress" | "complete" | "pending" | "approved" | "rejected";

export type ClientSortOption =
  | "recent"
  | "name-asc"
  | "name-desc"
  | "projects-desc"
  | "id-asc";

export type ClientFilterState = {
  status: ClientStatus | "all";
  activity: "all" | "active" | "inactive";
};

export type ClientRecord = {
  id: string;
  clientId: string;
  user: {
    name: string;
    avatarUrl: string;
  };
  project: string;
  contact: string;
  activeProjects: number;
  status: ClientStatus;
  statusLabel: string;
  lastActivity: string;
};

export const DEFAULT_CLIENTS: ClientRecord[] = [
  {
    id: "cl-1",
    clientId: "#CL9801",
    user: {
      name: "Natali Craig",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
    project: "Landing Page",
    contact: "natali.craig@acme.com",
    activeProjects: 2,
    status: "in-progress",
    statusLabel: "In Progress",
    lastActivity: "Just now",
  },
  {
    id: "cl-2",
    clientId: "#CL9802",
    user: {
      name: "Kate Morrison",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    },
    project: "CRM Admin pages",
    contact: "kate.m@apex.design",
    activeProjects: 3,
    status: "complete",
    statusLabel: "Complete",
    lastActivity: "1 minute ago",
  },
  {
    id: "cl-3",
    clientId: "#CL9803",
    user: {
      name: "Drew Cano",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    },
    project: "Client Project",
    contact: "drew.cano@prism.co",
    activeProjects: 1,
    status: "pending",
    statusLabel: "Pending",
    lastActivity: "1 hour ago",
  },
  {
    id: "cl-4",
    clientId: "#CL9804",
    user: {
      name: "Orlando Diggs",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    },
    project: "Admin Dashboard",
    contact: "orlando.d@diggs.agency",
    activeProjects: 4,
    status: "approved",
    statusLabel: "Approved",
    lastActivity: "Yesterday",
  },
  {
    id: "cl-5",
    clientId: "#CL9805",
    user: {
      name: "Andi Lane",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    },
    project: "App Landing Page",
    contact: "andi.lane@lane.studio",
    activeProjects: 2,
    status: "rejected",
    statusLabel: "Rejected",
    lastActivity: "Feb 2, 2026",
  },
  {
    id: "cl-6",
    clientId: "#CL9806",
    user: {
      name: "Koray Okumus",
      avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
    },
    project: "Brand Identity",
    contact: "koray@okumus.design",
    activeProjects: 1,
    status: "in-progress",
    statusLabel: "In Progress",
    lastActivity: "Feb 1, 2026",
  },
  {
    id: "cl-7",
    clientId: "#CL9807",
    user: {
      name: "Melody Macy",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    },
    project: "E-Commerce Store",
    contact: "melody.macy@flow.dev",
    activeProjects: 2,
    status: "complete",
    statusLabel: "Complete",
    lastActivity: "Jan 29, 2026",
  },
  {
    id: "cl-8",
    clientId: "#CL9808",
    user: {
      name: "Veronica Hall",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    },
    project: "SaaS Onboarding",
    contact: "veronica@hall.tech",
    activeProjects: 3,
    status: "approved",
    statusLabel: "Approved",
    lastActivity: "Jan 27, 2026",
  },
  {
    id: "cl-9",
    clientId: "#CL9809",
    user: {
      name: "Marcus Vance",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80",
    },
    project: "Mobile Application",
    contact: "marcus@vance.io",
    activeProjects: 1,
    status: "pending",
    statusLabel: "Pending",
    lastActivity: "Jan 25, 2026",
  },
  {
    id: "cl-10",
    clientId: "#CL9810",
    user: {
      name: "Sophia Martinez",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    },
    project: "Design System 2.0",
    contact: "sophia@martinez.design",
    activeProjects: 2,
    status: "in-progress",
    statusLabel: "In Progress",
    lastActivity: "Jan 22, 2026",
  },
  {
    id: "cl-11",
    clientId: "#CL9811",
    user: {
      name: "Liam O'Connor",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
    },
    project: "Cloud Migration",
    contact: "liam@oconnor.cloud",
    activeProjects: 2,
    status: "complete",
    statusLabel: "Complete",
    lastActivity: "Jan 20, 2026",
  },
  {
    id: "cl-12",
    clientId: "#CL9812",
    user: {
      name: "Elena Rostova",
      avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80",
    },
    project: "Brand Strategy",
    contact: "elena@rostova.co",
    activeProjects: 1,
    status: "rejected",
    statusLabel: "Rejected",
    lastActivity: "Jan 18, 2026",
  },
  {
    id: "cl-13",
    clientId: "#CL9813",
    user: {
      name: "Benjamin Hayes",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    },
    project: "Portfolio Showcase",
    contact: "ben@hayes.studio",
    activeProjects: 3,
    status: "approved",
    statusLabel: "Approved",
    lastActivity: "Jan 15, 2026",
  },
  {
    id: "cl-14",
    clientId: "#CL9814",
    user: {
      name: "Chloe Dupont",
      avatarUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=100&auto=format&fit=crop&q=80",
    },
    project: "Checkout Optimization",
    contact: "chloe@dupont.fr",
    activeProjects: 2,
    status: "in-progress",
    statusLabel: "In Progress",
    lastActivity: "Jan 12, 2026",
  },
  {
    id: "cl-15",
    clientId: "#CL9815",
    user: {
      name: "Daniel Kim",
      avatarUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=80",
    },
    project: "API Gateway Integration",
    contact: "dan@kimtech.kr",
    activeProjects: 1,
    status: "pending",
    statusLabel: "Pending",
    lastActivity: "Jan 10, 2026",
  },
];
