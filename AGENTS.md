# ClientScope — Agent Instructions

You are implementing **ClientScope**, a multi-tenant B2B SaaS where freelancers/agencies onboard clients, collect project requirements and assets, manage tickets and meetings, approve scope/quotes and paid changes, and review deliverables.

## Read first (in this order)
1. `GUIDELINES.md` — non-negotiable engineering conventions.
2. `skills/architecture/SKILL.md` — domain and boundaries.
3. `skills/prisma-database/SKILL.md` — model and migration rules.
4. `skills/supabase-connection/SKILL.md` — setup and connection URLs.
5. `skills/security/SKILL.md` — tenant and secrets protections.
6. `skills/verification/SKILL.md` — exact acceptance criteria.
7. `skills/domain-workflows/SKILL.md` — onboarding, ticket and quote lifecycle.

## Scope for milestone 1 — database only
- Inspect the repository and package versions before modifying it; keep existing files and commands when compatible.
- Set up Next.js App Router + TypeScript + Tailwind only if the project isn't initialized.
- Install matching major versions of `prisma` and `@prisma/client`, `@prisma/adapter-pg`, `pg`, `dotenv`, `tsx`, and `@types/pg`.
- Use `prisma/schema.prisma` as the initial complete 36-model reference and `prisma.config.ts` for connection configuration (Prisma 7 style).
- Create `src/lib/prisma.ts` as a server-only singleton Prisma Client using PrismaPg and `DATABASE_URL`.
- Read `.env` only from local configuration. Use `DIRECT_URL` for Prisma CLI/migrations, pooled `DATABASE_URL` for runtime.
- Run schema format/validation/generation locally before touching remote Supabase.
- Ask for confirmation before running the first migration against an existing or nonempty remote database. Never reset/drop objects without explicit consent.
- After approval, migrate using `prisma migrate dev --name init` only if the environment supports it safely; use `migrate deploy` to apply reviewed migrations to non-development databases.
- Verify connection with `scripts/db-smoke-test.ts`: `SELECT 1` and read counts for Workspace and Project; report actual results.
- Stop after DB proof. No dashboard, auth pages, ticket UI, integrations or AI for milestone 1.

## Agent output required
Show: changed files; commands run; schema validation status; client generation status; migration applied/pending; actual connection test result; blockers. Never report success without running the checks. Redact connection strings/passwords/tokens from output.

## Guardrails
- Database is PostgreSQL on Supabase, ORM is Prisma; use Supabase Storage later for uploads, Supabase Auth later for login (design user mapping now).
- Client must not approve arbitrary extra work by creating a ticket; approval occurs on explicit quote/scope versions.
- Do not add smart requirements AI, automated scope-creep detection, or dependency/delay tracking yet.
- Do not use Prisma directly from the browser; all Prisma access must be trusted server code.
- **Theme parity (Dark and Light mode)**: Whenever writing or modifying UI components, layouts, pages, or widgets, always implement complete support for both Light Mode and Dark Mode. Never write single-mode CSS or Tailwind classes without their `dark:` counterparts. Refer to `.agents/rules/dark-light-mode.md` and `.agents/skills/dark-light-mode/SKILL.md`.

