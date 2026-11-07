"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { PROJECT_CURRENCIES, PROJECT_STATUSES, validateProjectForm, type ClientProject, type ProjectDraft } from "./client-projects-data";

export const projectFocusClass = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900 dark:focus-visible:outline-zinc-100";
export const projectSecondaryButtonClass = `inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 ${projectFocusClass}`;
export const projectPrimaryButtonClass = `inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 ${projectFocusClass}`;
const fieldClass = "mt-2 min-h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-900/10 aria-invalid:border-red-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:hover:border-zinc-600 dark:focus:border-zinc-400 dark:focus:ring-white/10 dark:aria-invalid:border-red-400";

function Field({ name, label, error, children }: { name: string; label: string; error?: string; children: ReactNode }) {
  return <div className="min-w-0">
    <label htmlFor={`project-${name}`} className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">{label}</label>
    {children}
    {error && <p id={`project-${name}-error`} className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
  </div>;
}

export function ClientProjectForm({ clientName, project, onSave, onCancel }: {
  clientName: string;
  project?: ClientProject;
  onSave: (value: ProjectDraft) => void;
  onCancel: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState(project?.status ?? "DRAFT");
  const [progress, setProgress] = useState(String(project?.progress ?? 0));
  const attributes = (name: string) => ({
    id: `project-${name}`, name, className: fieldClass,
    "aria-invalid": errors[name] ? true as const : undefined,
    "aria-describedby": errors[name] ? `project-${name}-error` : undefined,
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validateProjectForm(new FormData(event.currentTarget));
    setErrors(result.errors);
    if (result.value) onSave(result.value);
    else {
      const field = event.currentTarget.elements.namedItem(Object.keys(result.errors)[0]);
      if (field instanceof HTMLElement) field.focus();
    }
  }

  return <form onSubmit={submit} noValidate className="space-y-5 p-6">
    <div className="rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800/70">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">Client</p>
      <p className="mt-1 break-words text-sm font-medium text-zinc-800 dark:text-zinc-100">{clientName}</p>
    </div>
    <Field name="name" label="Project name *" error={errors.name}>
      <input {...attributes("name")} required maxLength={120} defaultValue={project?.name} placeholder="e.g. Website redesign" autoFocus />
    </Field>
    <Field name="description" label="Description (optional)" error={errors.description}>
      <textarea {...attributes("description")} rows={3} maxLength={5000} defaultValue={project?.description} placeholder="Describe the project goals and scope of work" />
    </Field>
    <Field name="deliverables" label="Deliverables (optional)" error={errors.deliverables}>
      <textarea {...attributes("deliverables")} rows={3} maxLength={5000} defaultValue={project?.deliverables} placeholder="List the work you plan to deliver" />
    </Field>
    <div className="grid gap-5 sm:grid-cols-2">
      <Field name="budget" label="Planned budget (optional)" error={errors.budget}>
        <input {...attributes("budget")} inputMode="decimal" maxLength={15} defaultValue={project?.budget ?? ""} placeholder="0.00" />
        <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">Internal planning estimate.</p>
      </Field>
      <Field name="currency" label="Currency *" error={errors.currency}>
        <select {...attributes("currency")} required defaultValue={project?.currency ?? "USD"}>{PROJECT_CURRENCIES.map((currency) => <option key={currency} value={currency}>{currency}</option>)}</select>
      </Field>
      <Field name="startDate" label="Start date (optional)" error={errors.startDate}>
        <input {...attributes("startDate")} type="date" defaultValue={project?.startDate} />
      </Field>
      <Field name="deadline" label="Deadline (optional)" error={errors.deadline}>
        <input {...attributes("deadline")} type="date" defaultValue={project?.deadline} />
      </Field>
      <Field name="status" label="Status *" error={errors.status}>
        <select {...attributes("status")} required value={status} onChange={(event) => {
          const value = event.target.value as keyof typeof PROJECT_STATUSES;
          setStatus(value);
          if (value === "COMPLETED") setProgress("100");
        }}>{Object.entries(PROJECT_STATUSES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
      </Field>
      <Field name="progress" label="Progress (%) *" error={errors.progress}>
        <input {...attributes("progress")} type="number" min={0} max={100} step={1} required value={progress} onChange={(event) => setProgress(event.target.value)} />
      </Field>
    </div>
    {Object.keys(errors).length > 0 && <p role="alert" className="text-sm text-red-600 dark:text-red-400">Check the highlighted fields before saving.</p>}
    <div className="flex flex-wrap justify-end gap-3 border-t border-zinc-100 pt-5 dark:border-zinc-800">
      <button type="button" onClick={onCancel} className={projectSecondaryButtonClass}>Cancel</button>
      <button type="submit" className={projectPrimaryButtonClass}>{project ? "Save changes" : "Create project"}</button>
    </div>
  </form>;
}
