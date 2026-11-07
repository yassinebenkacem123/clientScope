import type { ClientRecord } from "./clients-data";

export const PROJECT_STATUSES = {
  DRAFT: "Draft",
  ONBOARDING: "Onboarding",
  ACTIVE: "Active",
  ON_HOLD: "On Hold",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
} as const;

export const PROJECT_CURRENCIES = ["USD", "EUR", "GBP", "MAD", "CAD", "AUD"] as const;
export type ClientProjectStatus = keyof typeof PROJECT_STATUSES;
export type ProjectDraft = {
  name: string;
  description: string;
  deliverables: string;
  budget: string | null;
  currency: typeof PROJECT_CURRENCIES[number];
  startDate: string;
  deadline: string;
  progress: number | null;
  status: ClientProjectStatus | null;
};
export type ClientProject = ProjectDraft & { id: string; clientId: string; createdAt?: string };

export function getClientProjects(client: ClientRecord): ClientProject[] {
  if (client.projects !== undefined) return client.projects.filter((project) => project.clientId === client.id);
  // Legacy client records only contain a project name. Do not invent its details.
  return client.project.trim() ? [{
    id: `${client.id}-existing-project`, clientId: client.id, name: client.project,
    description: "", deliverables: "", budget: null, currency: "USD",
    startDate: "", deadline: "", progress: null, status: null,
  }] : [];
}

export function projectStatistics(projects: ClientProject[]) {
  return {
    all: projects.length,
    active: projects.filter((project) => project.status === "ACTIVE").length,
    completed: projects.filter((project) => project.status === "COMPLETED").length,
    onHold: projects.filter((project) => project.status === "ON_HOLD").length,
  };
}

function withProjects(client: ClientRecord, projects: ClientProject[]): ClientRecord {
  return { ...client, projects, project: projects[0]?.name ?? "", activeProjects: projectStatistics(projects).active };
}

export function saveClientProject(clients: ClientRecord[], clientId: string, project: ClientProject): ClientRecord[] {
  if (project.clientId !== clientId) return clients;
  return clients.map((client) => {
    if (client.id !== clientId) return client;
    const projects = getClientProjects(client);
    const exists = projects.some((item) => item.id === project.id);
    return withProjects(client, exists ? projects.map((item) => item.id === project.id ? project : item) : [project, ...projects]);
  });
}

export function deleteClientProject(clients: ClientRecord[], clientId: string, projectId: string): ClientRecord[] {
  return clients.map((client) => client.id === clientId
    ? withProjects(client, getClientProjects(client).filter((project) => project.id !== projectId)) : client);
}

export function validateProjectForm(form: FormData): { value?: ProjectDraft; errors: Record<string, string> } {
  const text = (key: string) => String(form.get(key) ?? "").trim();
  const errors: Record<string, string> = {};
  const name = text("name");
  const description = text("description");
  const deliverables = text("deliverables");
  const budget = text("budget");
  const currency = text("currency");
  const startDate = text("startDate");
  const deadline = text("deadline");
  const progress = text("progress");
  const status = text("status");
  if (!name || name.length > 120) errors.name = "Enter a project name of up to 120 characters.";
  if (description.length > 5000) errors.description = "Keep the description within 5,000 characters.";
  if (deliverables.length > 5000) errors.deliverables = "Keep deliverables within 5,000 characters.";
  if (budget && !/^\d{1,12}(\.\d{1,2})?$/.test(budget)) errors.budget = "Enter a nonnegative budget with up to two decimal places.";
  if (!PROJECT_CURRENCIES.some((item) => item === currency)) errors.currency = "Select a supported currency.";
  for (const [key, value] of [["startDate", startDate], ["deadline", deadline]]) {
    if (value && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value)) {
      errors[key] = "Enter a valid date.";
    }
  }
  if (startDate && deadline && deadline < startDate) errors.deadline = "The deadline must be on or after the start date.";
  if (!/^\d{1,3}$/.test(progress) || Number(progress) > 100) errors.progress = "Enter a whole percentage between 0 and 100.";
  if (!Object.hasOwn(PROJECT_STATUSES, status)) errors.status = "Select a project status.";
  if (status === "COMPLETED" && Number(progress) !== 100) errors.progress = "Completed projects must have 100% progress.";
  if (Object.keys(errors).length) return { errors };
  return { errors, value: {
    name, description, deliverables, budget: budget || null,
    currency: currency as ProjectDraft["currency"], startDate, deadline,
    progress: Number(progress), status: status as ClientProjectStatus,
  } };
}

export function formatProjectBudget(budget: string | null, currency: string) {
  if (budget === null) return "Not recorded";
  // Format the decimal string exactly, including amounts above JS integer precision.
  const [whole, fraction = ""] = budget.split(".");
  return new Intl.NumberFormat("en-US", { style: "currency", currency, currencyDisplay: "code" })
    .formatToParts(BigInt(whole)).map((part) => part.type === "fraction" ? fraction.padEnd(2, "0") : part.value).join("");
}

export function formatProjectDate(value: string) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}
