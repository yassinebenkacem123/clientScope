# ClientScope Workspace Agents Instructions

## Mandatory Directives for All Agents

### 1. Dark and Light Mode Parity (Non-Negotiable)
Every agent modifying or creating user interface elements (components, layouts, pages, widgets, dialogs, forms, badges, dropdowns, headers, tooltips) MUST account for both **Light Mode** and **Dark Mode**:
- Always provide reciprocal Tailwind classes for dark mode: `dark:bg-...`, `dark:text-...`, `dark:border-...`, `dark:ring-...`.
- Never hardcode light-only color hex values or classes without their corresponding dark counterpart.
- Ensure high contrast and accessibility according to WCAG standards in both modes.
- Refer to `.agents/rules/dark-light-mode.md` for specific color pairings and design conventions.

### 2. Architecture & Backend Separation
- Follow domain-driven boundaries defined in `skills/architecture/SKILL.md`.
- Prisma access must remain server-side only; never expose Prisma or database credentials directly to client components.
- Keep multi-tenant isolation enforced at all times.
