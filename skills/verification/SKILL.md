# Skill: Database Verification

## Checks (order)
1. Confirm Node version and installed Prisma version; install matching dependencies.
2. Ensure `.env` variables present (check only presence; never print values).
3. `npx prisma validate` -> PASS.
4. `npx prisma generate` -> PASS.
5. Create/inspect migration diff; ask permission before remote execution.
6. After migration: `npx prisma migrate status` should have no pending migrations.
7. `npx tsx scripts/db-smoke-test.ts` checks `SELECT 1` and `workspace.count()` and `project.count()`.
8. In Supabase Table Editor, confirm tables exist in expected schema.

## Typical blockers
- `P1001`: unreachable host / IPv4-only network vs direct IPv6; try provided session-pooler URL for migrations.
- `P1000`: wrong username/password or URL encoding.
- `P2021`: tables not yet migrated.
- Prepared statement/pool errors: CLI using transaction pooler; use direct/session connection.
- `SASL password must be a string`: missing runtime DATABASE_URL.

Only mark remote connection VERIFIED when actual remote query succeeds. Local `prisma validate` does not prove connectivity.
