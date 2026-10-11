# Skill: Supabase + Prisma Connection
1. Create a **development** Supabase project and keep DB password securely.
2. Supabase Dashboard -> Connect -> Connection string. Copy the **transaction pooled** URL for `DATABASE_URL` (usually port 6543) and **direct** URL for `DIRECT_URL` (usually port 5432). If direct IPv6 is unreachable, obtain the Supabase session-pooler endpoint suitable for migrations instead of using transaction pooling for schema commands. Never guess project-ref/region/host.
3. Copy `.env.example` to `.env`, replace placeholders, URL-encode special characters in passwords. `.env` stays gitignored.
4. `prisma.config.ts` reads `DIRECT_URL` for CLI commands; `src/lib/prisma.ts` reads `DATABASE_URL` with `PrismaPg`.
5. `npx prisma validate && npx prisma generate`. For **approved dev database**, create/review/apply migration. Then `npx tsx scripts/db-smoke-test.ts`.
6. Verify table names under `public` in Supabase Table Editor (or read-only SQL). If tests fail: check password URL escaping, wrong pool mode, network IPv4/IPv6, SSL requirements, missing env, or migration not applied.

Runtime should be Node.js, not Edge. Supabase Auth/Storage are future steps, not required to pass milestone 1. Be careful with Supabase RLS: Prisma server access must enforce tenant-level authorization in application code; never assume authenticated Supabase client RLS automatically applies to Prisma queries.
