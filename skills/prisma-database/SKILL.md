# Skill: Prisma Database
Read before changing `prisma/schema.prisma` or migrations.

Use Prisma v7 syntax. `generator client { provider = "prisma-client"; output = "../src/generated/prisma" }`; datasource only `provider = "postgresql"`. CLI URL in `prisma.config.ts` uses `DIRECT_URL`; runtime adapter uses `DATABASE_URL`.

Model intent: 36 tables across core/onboarding/collaboration/commercial. Relations are explicit, optional foreign keys are nullable, many-to-many membership tables have unique pairs. Add SQL CHECK constraints in migration SQL for: approval exactly one of quoteId and scopeVersionId; quote total and unit price >= 0; valid meeting end > start; nonnegative file bytes. Prisma schema cannot express all database CHECK constraints; annotate hand-edited migrations.

`FileAttachment` and `Reminder` use targetType/targetId generic references not enforced as foreign keys. Validate referenced targets and project scope in server services or replace with specific join tables later. `User.authUserId` points to Supabase Auth user id, but is not declared as a cross-schema FK.

Run: `npx prisma validate`, `npx prisma generate`; review migration SQL; apply only to approved development DB. Supabase may require a reachable direct/session-pooler URL for CLI (not transaction pooler). In CI/prod `npx prisma migrate deploy`, never `migrate dev`.
