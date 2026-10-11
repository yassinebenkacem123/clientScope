import type { LucideIcon } from "lucide-react";
import {
  Bell,
  CalendarDays,
  ClipboardList,
  FileCheck2,
  FolderKanban,
  FolderOpen,
  Inbox,
  LayoutDashboard,
  ListTodo,
  Settings,
  UsersRound,
} from "lucide-react";

export type DashboardRoute = `/dashboard${string}`;

export type NavigationItem = {
  label: string;
  href: DashboardRoute;
  icon: LucideIcon;
  description: string;
  badge?: number;
};

export type NavigationGroup = {
  label: "Main menu" | "Management" | "Workspace";
  items: readonly NavigationItem[];
};

export const navigationGroups = [
  {
    label: "Main menu",
    items: [
      {
        label: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
        description: "Active projects, pending responses, meetings, and recent activity",
      },
      {
        label: "Clients",
        href: "/dashboard/clients",
        icon: UsersRound,
        description: "Client directory, contacts, and associated projects",
      },
      {
        label: "Projects",
        href: "/dashboard/projects",
        icon: FolderKanban,
        description: "Project statuses, progress, budgets, and deadlines",
      },
      {
        label: "My Tasks",
        href: "/dashboard/tasks",
        icon: ListTodo,
        description: "Tickets assigned to you across projects",
      },
      {
        label: "Calendar",
        href: "/dashboard/calendar",
        icon: CalendarDays,
        description: "Meetings, requests, and deadlines",
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        label: "Client Requests",
        href: "/dashboard/requests",
        icon: Inbox,
        description: "Incoming requirements, tickets, and clarification requests",
      },
      {
        label: "Quotes & Approvals",
        href: "/dashboard/quotes",
        icon: FileCheck2,
        description: "Quotations, paid changes, and client approvals",
      },
      {
        label: "Onboarding Templates",
        href: "/dashboard/templates",
        icon: ClipboardList,
        description: "Reusable onboarding questionnaires",
      },
      {
        label: "Files",
        href: "/dashboard/files",
        icon: FolderOpen,
        description: "Uploaded documents, images, and client assets",
      },
    ],
  },
  {
    label: "Workspace",
    items: [
      {
        label: "Notifications",
        href: "/dashboard/notifications",
        icon: Bell,
        description: "Client responses, ticket updates, and meeting confirmations",
      },
      {
        label: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        description: "Workspace, team, branding, and user preferences",
      },
    ],
  },
] as const satisfies readonly NavigationGroup[];
