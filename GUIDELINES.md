# ClientScope Engineering Guidelines

## Stack and structure
Next.js App Router, TypeScript strict, React, Tailwind CSS v4, Prisma ORM v7, PostgreSQL hosted on Supabase. Use server components by default and client components only for interaction. Prefer `src/app`, `src/lib`, `src/generated/prisma`, `prisma`, `scripts`, `skills`.

## Design principles
- Multi-tenant: workspace owns projects/clients; all access requires membership + project scope. Do not trust client-provided workspaceId.
- Separate immutable **commercial acceptance** from mutable backlog state.
- Keep forms reusable and snapshot their definition per project.
- Store monetary values as PostgreSQL Decimal, currency as ISO 4217 string. Never JS float arithmetic for pricing.
- Keep assets private with opaque storage keys; never persist public service-role credentials.
- Use UUID keys, explicit relations, indexes on foreign keys used for filters, and DB constraints for critical invariants.
- Preserve approved quotes and scopes; edits create new revisions.
- No dynamic/unvalidated raw SQL, no runtime migrations, no database queries in edge runtime.

## Code conventions
- CamelCase for TypeScript variables, PascalCase for Prisma models/types, explicit descriptive enum names.
- Perform server-side validation via Zod at external boundaries once APIs are introduced.
- Avoid prematurely building generic workflows and unnecessary dependencies.
- Keep secrets in `.env` or deployment secret store, never commit `.env` or log its values.
- Use minimal tests that verify meaningful behavior, no fake success messages.
- Theme parity: All UI components, pages, and interactive views must support both Light and Dark mode using Tailwind CSS v4 `dark:` classes and `ThemeProvider`. Always test and verify contrast in both modes.


## Prisma specifics
- Prisma v7: datasource provider belongs in `schema.prisma`; database URL is configured in `prisma.config.ts`.
- `prisma-client` generator requires an explicit output directory. Import generated client from `src/generated/prisma/client` (adjust relative paths where needed).
- Instantiate with `@prisma/adapter-pg` and pooled runtime URL.
- Use reviewed migrations; avoid `prisma db push` as the default for an existing shared project.
- Avoid `migrate reset`, `db push --force-reset`, `db execute` destructive SQL, and broad data writes unless explicitly authorized.

## Milestone 1 definition of done
1. `npx prisma format --check` if supported, otherwise `npx prisma format` and diff review.
2. `npx prisma validate` succeeds.
3. `npx prisma generate` succeeds.
4. Schema migration reviewed and applied to intended *development* database only after confirmation.
5. `npx tsx scripts/db-smoke-test.ts` outputs `SELECT 1`, Workspace count, Project count, without leaking secrets.
6. Evidence of tables in Supabase Table Editor or equivalent read-only introspection.

## Out of scope for milestone 1
No UI, payments, real-time sockets, calendar OAuth, email dispatch, AI, scope auto-detection, or complex Scrum features.
