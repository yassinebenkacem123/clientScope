# ClientScope — Agent & Database Starter

**Milestone 1:** define the Prisma schema, connect to Supabase PostgreSQL, review/apply a migration, and verify an actual query. No features/UI yet.

## For an existing Next.js project
Copy `AGENTS.md`, `GUIDELINES.md`, `skills/`, `prisma/schema.prisma`, `prisma.config.ts`, `scripts/`, `src/lib/prisma.ts`, `.env.example` into the repository. Merge rather than overwrite existing configuration. Ensure `.gitignore` contains the ignore entries here.

## For a new project
```bash
npx create-next-app@latest clientscope --ts --tailwind --eslint --app --src-dir
cd clientscope
npm install @prisma/client@7 @prisma/adapter-pg pg dotenv server-only
npm install -D prisma@7 tsx @types/pg
```
Copy the starter contents into the new Next.js project, retaining the Next.js package.json and its generated configuration.

## Configure database
```bash
cp .env.example .env  # on Windows PowerShell: Copy-Item .env.example .env
# Fill DATABASE_URL and DIRECT_URL with values from your Supabase project
npx prisma validate
npx prisma generate
```
**Important:** These local commands do not prove a connection to Supabase.

For a brand-new *development* Supabase database only, after reviewing the schema and explicitly approving remote changes:
```bash
npx prisma migrate dev --name init
npx prisma migrate status
npx tsx scripts/db-smoke-test.ts
```
On environments where `migrate dev` requires a shadow database privilege not provided by Supabase, use a dedicated dev shadow database or generate a reviewed SQL migration locally and apply it through the supported deployment workflow; do not blindly switch to destructive `db push`.

## What success looks like
`prisma validate` and `generate` pass; migration shows as applied; smoke test prints `connection: PASS`, `select1: PASS`, and integer counts. Verify table list in Supabase Dashboard. **This package cannot test your Supabase database until you supply credentials locally and execute the commands.**

## Prisma URL notes
`DIRECT_URL` = direct/session endpoint for migrations. `DATABASE_URL` = runtime pooled endpoint. Some environments cannot reach Supabase's IPv6-only direct endpoint; use the Supabase-provided session-pooler endpoint when appropriate. Do not invent hostnames.

## Docs
- https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/postgresql
- https://supabase.com/docs/guides/database/prisma
