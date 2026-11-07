"use client";

import { useEffect, useRef, useState } from "react";
import { notFound } from "next/navigation";
import { BriefcaseBusiness, CheckCircle2, Eye, FolderKanban, MoreHorizontal, PauseCircle, Pencil, Plus, Trash2, X } from "lucide-react";
import { StatCard } from "../overview/stat-card";
import { useClients } from "./clients-provider";
import { ClientProjectForm, projectFocusClass, projectPrimaryButtonClass, projectSecondaryButtonClass } from "./client-project-form";
import { formatProjectBudget, formatProjectDate, getClientProjects, projectStatistics, PROJECT_STATUSES, type ClientProject, type ClientProjectStatus, type ProjectDraft } from "./client-projects-data";

const statusStyles: Record<ClientProjectStatus, string> = {
  DRAFT: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
  ONBOARDING: "bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
  ACTIVE: "bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300",
  ON_HOLD: "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
  COMPLETED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  ARCHIVED: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

function StatusBadge({ status }: { status: ClientProjectStatus | null }) {
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status ?? "DRAFT"]}`}>
    {status && <span aria-hidden="true" className="size-1.5 rounded-full bg-current dark:bg-current" />}
    {status ? PROJECT_STATUSES[status] : "Not recorded"}
  </span>;
}

type DialogState = { type: "add" } | { type: "edit" | "details" | "delete"; project: ClientProject };

export function ClientProjects({ clientId }: { clientId: string }) {
  const { clients, saveProject, deleteProject } = useClients();
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [actionProject, setActionProject] = useState<ClientProject | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [notice, setNotice] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const addButton = useRef<HTMLButtonElement>(null);
  const client = clients.find((item) => item.id === clientId);

  useEffect(() => {
    const closeActions = () => actionsRef.current?.hidePopover();
    window.addEventListener("scroll", closeActions, true);
    window.addEventListener("resize", closeActions);
    return () => {
      window.removeEventListener("scroll", closeActions, true);
      window.removeEventListener("resize", closeActions);
    };
  }, []);

  if (!client) notFound();
  const projects = getClientProjects(client);
  const stats = projectStatistics(projects);
  const selected = dialog && "project" in dialog ? dialog.project : undefined;
  const menuId = `project-actions-${clientId}`;

  function openDialog(value: DialogState) {
    actionsRef.current?.hidePopover();
    setDialog(value);
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
  }
  function closeDialog() { dialogRef.current?.close(); }
  function save(value: ProjectDraft) {
    const project: ClientProject = {
      ...value, id: selected?.id ?? crypto.randomUUID(), clientId,
      createdAt: selected?.createdAt ?? new Date().toISOString(),
    };
    saveProject(clientId, project);
    setNotice(`${project.name} ${selected ? "updated" : "created"}.`);
    closeDialog();
  }

  return <div className="space-y-6">
    <section aria-label="Client project statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="All Projects" value={String(stats.all)} icon={FolderKanban} iconClassName="text-violet-600 dark:text-violet-300" surfaceClassName="bg-[#F0F0FF] dark:bg-[#24213D]" />
      <StatCard label="Active Projects" value={String(stats.active)} icon={BriefcaseBusiness} iconClassName="text-sky-600 dark:text-sky-300" surfaceClassName="bg-[#E7F2FF] dark:bg-[#172C3F]" />
      <StatCard label="Completed Projects" value={String(stats.completed)} icon={CheckCircle2} iconClassName="text-violet-600 dark:text-violet-300" surfaceClassName="bg-[#F0F0FF] dark:bg-[#24213D]" />
      <StatCard label="On Hold" value={String(stats.onHold)} icon={PauseCircle} iconClassName="text-sky-600 dark:text-sky-300" surfaceClassName="bg-[#E7F2FF] dark:bg-[#172C3F]" />
    </section>

    <section aria-labelledby="client-projects-title" className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 id="client-projects-title" className="text-base font-semibold text-slate-950 dark:text-zinc-100">Projects <span className="ml-2 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{stats.all}</span></h2>
          <p className="mt-1 break-words text-xs text-zinc-500 dark:text-zinc-400">Manage projects for {client.user.name}.</p>
        </div>
        <button ref={addButton} type="button" onClick={(event) => { lastTrigger.current = event.currentTarget; openDialog({ type: "add" }); }} className={projectPrimaryButtonClass}><Plus aria-hidden="true" className="size-4" />Add Project</button>
      </header>
      <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">Project changes are kept until the page is reloaded.</p>
      <p role="status" aria-live="polite" className="mt-2 text-sm text-emerald-700 empty:hidden dark:text-emerald-300">{notice}</p>

      <div className="mt-5 overflow-x-auto rounded-lg focus-visible:outline-2 focus-visible:outline-slate-900 dark:focus-visible:outline-zinc-100" tabIndex={0} role="region" aria-label="Projects table, scroll horizontally on smaller screens">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <caption className="sr-only">Projects belonging to {client.user.name}</caption>
          <thead><tr className="border-b border-zinc-100 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            {["Project Name", "Progress", "Budget", "Deadline", "Status", "Actions"].map((label) => <th key={label} scope="col" className={`px-3 pb-4 font-medium ${label === "Actions" ? "text-right" : ""}`}>{label}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {projects.map((project) => <tr key={project.id} className="transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40">
              <th scope="row" className="max-w-64 px-3 py-5 text-left font-medium">
                <button type="button" onClick={() => { lastTrigger.current = null; openDialog({ type: "details", project }); }} className={`rounded-sm text-left text-slate-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400 ${projectFocusClass}`}><span className="line-clamp-2 break-words">{project.name}</span></button>
              </th>
              <td className="min-w-36 px-3 py-5">{project.progress === null ? <span className="text-xs text-zinc-500 dark:text-zinc-400">Not recorded</span> : <div className="flex items-center gap-3">
                <div role="progressbar" aria-label={`${project.name} progress`} aria-valuenow={project.progress} aria-valuemin={0} aria-valuemax={100} className="h-1.5 w-20 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"><div className={`h-full rounded-full ${project.status === "COMPLETED" ? "bg-emerald-500 dark:bg-emerald-400" : "bg-violet-500 dark:bg-violet-400"}`} style={{ width: `${project.progress}%` }} /></div>
                <span className="text-xs tabular-nums text-zinc-600 dark:text-zinc-300">{project.progress}%</span>
              </div>}</td>
              <td className="whitespace-nowrap px-3 py-5 text-xs tabular-nums text-zinc-600 dark:text-zinc-300">{formatProjectBudget(project.budget, project.currency)}</td>
              <td className="whitespace-nowrap px-3 py-5 text-xs text-zinc-600 dark:text-zinc-300">{project.deadline ? <time dateTime={project.deadline}>{formatProjectDate(project.deadline)}</time> : "Not recorded"}</td>
              <td className="px-3 py-5"><StatusBadge status={project.status} /></td>
              <td className="px-3 py-5 text-right"><button type="button" popoverTarget={menuId} aria-label={`Actions for ${project.name}`} onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                setActionProject(project);
                lastTrigger.current = event.currentTarget;
                setMenuPosition({ left: Math.max(8, Math.min(rect.right - 192, window.innerWidth - 200)), top: Math.max(8, Math.min(rect.bottom + 6, window.innerHeight - 154)) });
              }} className={`inline-flex size-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 ${projectFocusClass}`}><MoreHorizontal aria-hidden="true" className="size-4" /></button></td>
            </tr>)}
            {!projects.length && <tr><td colSpan={6} className="py-14 text-center">
              <FolderKanban aria-hidden="true" className="mx-auto size-7 text-zinc-400 dark:text-zinc-500" />
              <p className="mt-3 font-medium text-zinc-700 dark:text-zinc-200">No projects yet</p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Add a project to get started with this client.</p>
            </td></tr>}
          </tbody>
        </table>
      </div>
    </section>

    <div id={menuId} ref={actionsRef} popover="auto" style={menuPosition} className="fixed inset-auto m-0 w-48 rounded-xl border border-zinc-200 bg-white p-1.5 text-sm text-zinc-700 shadow-lg dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:shadow-none">
      {([{ type: "details", label: "View details", icon: Eye }, { type: "edit", label: "Edit project", icon: Pencil }, { type: "delete", label: "Delete project", icon: Trash2 }] as const).map((action) => <button key={action.type} type="button" onClick={() => actionProject && openDialog({ type: action.type, project: actionProject })} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 ${action.type === "delete" ? "text-red-600 dark:text-red-400" : "text-zinc-700 dark:text-zinc-200"} ${projectFocusClass}`}><action.icon aria-hidden="true" className="size-4" />{action.label}</button>)}
    </div>

    <dialog ref={dialogRef} aria-labelledby="project-dialog-title" onClose={() => {
      setDialog(null);
      const trigger = lastTrigger.current;
      (trigger?.isConnected ? trigger : addButton.current)?.focus();
    }} className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-0 text-slate-950 shadow-xl backdrop:bg-slate-950/40 backdrop:backdrop-blur-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:shadow-none dark:backdrop:bg-black/60">
      {dialog && <>
        <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-6 py-5 dark:border-zinc-800">
          <h2 id="project-dialog-title" className="text-base font-semibold">{dialog.type === "add" ? "Add Project" : dialog.type === "edit" ? "Edit Project" : dialog.type === "delete" ? "Delete Project" : "Project Details"}</h2>
          <button type="button" aria-label="Close project dialog" onClick={closeDialog} className={`rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 ${projectFocusClass}`}><X aria-hidden="true" className="size-4" /></button>
        </div>
        {(dialog.type === "add" || dialog.type === "edit") && <ClientProjectForm key={`${dialog.type}-${selected?.id ?? "new"}`} clientName={client.user.name} project={dialog.type === "edit" ? dialog.project : undefined} onSave={save} onCancel={closeDialog} />}
        {dialog.type === "details" && <div className="space-y-6 p-6">
          <div className="space-y-3"><StatusBadge status={dialog.project.status} /><h3 className="break-words text-xl font-semibold">{dialog.project.name}</h3><p className="text-sm text-zinc-500 dark:text-zinc-400">{client.user.name}</p></div>
          <dl className="grid gap-5 sm:grid-cols-2">{[
            ["Progress", dialog.project.progress === null ? "Not recorded" : `${dialog.project.progress}%`],
            ["Planned budget", formatProjectBudget(dialog.project.budget, dialog.project.currency)],
            ["Start date", formatProjectDate(dialog.project.startDate)],
            ["Deadline", formatProjectDate(dialog.project.deadline)],
            ["Description", dialog.project.description || "Not recorded"],
            ["Deliverables", dialog.project.deliverables || "Not recorded"],
          ].map(([label, value]) => <div key={label} className={`min-w-0 space-y-2 ${label === "Description" || label === "Deliverables" ? "sm:col-span-2" : ""}`}><dt className="text-xs text-zinc-500 dark:text-zinc-400">{label}</dt><dd className="whitespace-pre-wrap break-words text-sm text-zinc-800 dark:text-zinc-200">{value}</dd></div>)}</dl>
          <div className="flex justify-end gap-3 border-t border-zinc-100 pt-5 dark:border-zinc-800"><button type="button" onClick={closeDialog} className={projectSecondaryButtonClass}>Close</button><button type="button" onClick={() => openDialog({ type: "edit", project: dialog.project })} className={projectPrimaryButtonClass}><Pencil aria-hidden="true" className="size-3.5" />Edit project</button></div>
        </div>}
        {dialog.type === "delete" && <div className="space-y-5 p-6">
          <p className="break-words text-sm text-zinc-600 dark:text-zinc-300">Delete <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{dialog.project.name}</strong> from {client.user.name}&apos;s projects?</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">This removes the project from this session. Other clients&apos; projects will stay unchanged.</p>
          <div className="flex flex-wrap justify-end gap-3"><button type="button" autoFocus onClick={closeDialog} className={projectSecondaryButtonClass}>Cancel</button><button type="button" onClick={() => {
            deleteProject(clientId, dialog.project.id);
            setNotice(`${dialog.project.name} deleted.`);
            closeDialog();
          }} className={`inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-500 dark:text-white dark:hover:bg-red-600 ${projectFocusClass}`}><Trash2 aria-hidden="true" className="size-4" />Delete project</button></div>
        </div>}
      </>}
    </dialog>
  </div>;
}
