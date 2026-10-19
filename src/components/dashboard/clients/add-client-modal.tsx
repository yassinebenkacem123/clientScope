"use client";

import { useEffect, useRef, useState } from "react";
import { Briefcase, Building2, Mail, Sparkles, Upload, User, X } from "lucide-react";
import type { ClientRecord, ClientStatus } from "./clients-data";

type AddClientModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (client: ClientRecord) => void;
  existingCount?: number;
};

const statusOptions: { value: ClientStatus; label: string; dotClass: string }[] = [
  { value: "in-progress", label: "In Progress", dotClass: "bg-[#9B8AFB] dark:bg-[#B4A7FC]" },
  { value: "pending", label: "Pending", dotClass: "bg-[#46B5FF] dark:bg-[#68C5FF]" },
  { value: "approved", label: "Approved", dotClass: "bg-[#FBA645] dark:bg-[#FCB86B]" },
  { value: "complete", label: "Complete", dotClass: "bg-[#4BD37B] dark:bg-[#5FE38E]" },
  { value: "rejected", label: "Rejected", dotClass: "bg-zinc-400 dark:bg-zinc-500" },
];

export const DEFAULT_CLIENT_AVATAR = "/avatars/avatar-1.png";

export const AVATAR_PRESETS = [
  { id: "preset-1", label: "Avatar 1 (Default)", url: "/avatars/avatar-1.png" },
  { id: "preset-2", label: "Avatar 2", url: "/avatars/avatar-2.png" },
  { id: "preset-3", label: "Avatar 3", url: "/avatars/avatar-3.png" },
  { id: "preset-4", label: "Avatar 4", url: "/avatars/avatar-4.png" },
  { id: "preset-5", label: "Avatar 5", url: "/avatars/avatar-5.png" },
];

const inputClass =
  "h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-xs text-slate-900 outline-none transition-all placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-950/5 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:hover:border-zinc-600 dark:focus:border-zinc-500";

const labelClass = "block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1.5";

export function AddClientModal({
  isOpen,
  onClose,
  onAddClient,
  existingCount = 15,
}: AddClientModalProps) {
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("Design & Tech");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [projectName, setProjectName] = useState("");
  const [status, setStatus] = useState<ClientStatus>("in-progress");
  const [selectedAvatar, setSelectedAvatar] = useState<string>(DEFAULT_CLIENT_AVATAR);
  const [uploadedAvatar, setUploadedAvatar] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, avatar: "Please select a valid image file" }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, avatar: "Image file size should be under 5MB" }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setUploadedAvatar(result);
      setSelectedAvatar(result);
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.avatar;
        return copy;
      });
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveUploaded() {
    setUploadedAvatar(null);
    setSelectedAvatar(DEFAULT_CLIENT_AVATAR);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!contactName.trim()) newErrors.contactName = "Contact name is required";
    if (!contactEmail.trim()) newErrors.contactEmail = "Email is required";
    if (!projectName.trim()) newErrors.projectName = "Project name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const nextIdNum = 9800 + existingCount + 1;
    const statusOption = statusOptions.find((s) => s.value === status);

    const newClient: ClientRecord = {
      id: `cl-${Date.now()}`,
      clientId: `#CL${nextIdNum}`,
      user: {
        name: contactName.trim(),
        avatarUrl: selectedAvatar || DEFAULT_CLIENT_AVATAR,
      },
      project: projectName.trim(),
      contact: contactEmail.trim(),
      activeProjects: 1,
      status,
      statusLabel: statusOption ? statusOption.label : "In Progress",
      lastActivity: "Just now",
    };

    onAddClient(newClient);

    // Reset form
    setBusinessName("");
    setContactName("");
    setContactEmail("");
    setProjectName("");
    setSelectedAvatar(DEFAULT_CLIENT_AVATAR);
    setUploadedAvatar(null);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-client-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity dark:bg-black/60"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-200/90 bg-white shadow-2xl transition-all dark:border-zinc-800 dark:bg-zinc-900 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
         
            <div>
              <h2
                id="add-client-dialog-title"
                className="text-base font-semibold text-slate-950 dark:text-zinc-100"
              >
                Add New Client
              </h2>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Onboard a new client and configure their primary contact
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="grid size-8 place-items-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            <X aria-hidden="true" className="size-4.5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 scrollbar-thin">
          {/* Section 1: Business / Company */}
          <div className="space-y-3.5">
            <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              <Building2 className="size-3.5" />
              <span>Company Information</span>
            </h3>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label htmlFor="business-name" className={labelClass}>
                  Business / Company Name
                </label>
                <input
                  id="business-name"
                  type="text"
                  placeholder="e.g. Acme Studio"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="industry" className={labelClass}>
                  Industry
                </label>
                <select
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className={inputClass}
                >
                  <option value="Design & Tech">Design & Tech</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="SaaS & Cloud">SaaS & Cloud</option>
                  <option value="Marketing & Media">Marketing & Media</option>
                  <option value="Fintech">Fintech</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Primary Contact User */}
          <div className="border-t border-zinc-100 pt-5 dark:border-zinc-800/80 space-y-3.5">
            <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              <User className="size-3.5" />
              <span>Primary Contact</span>
            </h3>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className={labelClass}>
                  Contact Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={contactName}
                  onChange={(e) => {
                    setContactName(e.target.value);
                    if (errors.contactName) setErrors({ ...errors, contactName: "" });
                  }}
                  className={`${inputClass} ${errors.contactName ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10" : ""}`}
                />
                {errors.contactName ? (
                  <p className="mt-1 text-[11px] text-rose-500">{errors.contactName}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="contact-email" className={labelClass}>
                  Contact Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
                  />
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="sarah@acme.com"
                    value={contactEmail}
                    onChange={(e) => {
                      setContactEmail(e.target.value);
                      if (errors.contactEmail) setErrors({ ...errors, contactEmail: "" });
                    }}
                    className={`${inputClass} pl-9 ${errors.contactEmail ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10" : ""}`}
                  />
                </div>
                {errors.contactEmail ? (
                  <p className="mt-1 text-[11px] text-rose-500">{errors.contactEmail}</p>
                ) : null}
              </div>
            </div>

            {/* Avatar & Photo Upload Section */}
            <div>
              <p className={labelClass}>Client Avatar / Picture</p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/40">
                {/* Live Preview */}
                <div className="relative shrink-0">
                  <img
                    src={selectedAvatar || DEFAULT_CLIENT_AVATAR}
                    alt="Client avatar preview"
                    className="size-13 rounded-full object-cover ring-2 ring-violet-500/30 dark:ring-violet-400/30 shadow-xs"
                  />
                  {uploadedAvatar ? (
                    <button
                      type="button"
                      onClick={handleRemoveUploaded}
                      title="Remove uploaded image"
                      aria-label="Remove uploaded image"
                      className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-rose-500 text-white shadow-xs hover:bg-rose-600 transition-colors"
                    >
                      <X aria-hidden="true" className="size-3 stroke-2" />
                    </button>
                  ) : null}
                </div>

                {/* Upload action */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={fileInputRef}
                      id="avatar-upload-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-2xs hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700/70 transition-colors"
                    >
                      <Upload aria-hidden="true" className="size-3.5 text-violet-600 dark:text-violet-400" />
                      <span>{uploadedAvatar ? "Change Picture" : "Upload Picture"}</span>
                    </button>

                    {uploadedAvatar ? (
                      <button
                        type="button"
                        onClick={handleRemoveUploaded}
                        className="rounded-xl px-2 py-1.5 text-xs font-medium text-zinc-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 transition-colors"
                      >
                        Reset to default
                      </button>
                    ) : null}
                  </div>

                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    PNG, JPG, or WEBP up to 5MB. If unprovided, default avatar is assigned.
                  </p>
                  {errors.avatar ? (
                    <p className="text-[11px] text-rose-500">{errors.avatar}</p>
                  ) : null}
                </div>
              </div>

              {/* Or choose from assets/avatars presets */}
              <div className="mt-3">
                <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Or pick a preset avatar:
                </p>
                <div className="flex items-center gap-2.5">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedAvatar(preset.url);
                        setUploadedAvatar(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      title={preset.label}
                      className={`relative rounded-full transition-all ${
                        selectedAvatar === preset.url && !uploadedAvatar
                          ? "scale-110 ring-2 ring-violet-600 ring-offset-2 dark:ring-violet-400 dark:ring-offset-zinc-900"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="size-8 rounded-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Project Setup */}
          <div className="border-t border-zinc-100 pt-5 dark:border-zinc-800/80 space-y-3.5">
            <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              <Briefcase className="size-3.5" />
              <span>Project Details</span>
            </h3>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label htmlFor="project-name" className={labelClass}>
                  Initial Project <span className="text-rose-500">*</span>
                </label>
                <input
                  id="project-name"
                  type="text"
                  placeholder="e.g. Website Redesign"
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                    if (errors.projectName) setErrors({ ...errors, projectName: "" });
                  }}
                  className={`${inputClass} ${errors.projectName ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10" : ""}`}
                />
                {errors.projectName ? (
                  <p className="mt-1 text-[11px] text-rose-500">{errors.projectName}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="initial-status" className={labelClass}>
                  Status
                </label>
                <select
                  id="initial-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ClientStatus)}
                  className={inputClass}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="h-9 rounded-xl border border-zinc-200 bg-white px-4 text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700/60 dark:hover:text-zinc-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 rounded-xl bg-slate-900 px-5 text-xs font-medium text-white shadow-xs hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-zinc-100 transition-colors"
            >
              Create Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
