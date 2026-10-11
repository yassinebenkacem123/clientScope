# Skill: Security
- Treat workspace/project membership as mandatory on every read/write; verify invited client ownership of project.
- Separate workspace roles from project roles. Clients cannot assign developer tasks, edit agreed totals, or access internal comments.
- Store only one-way hashes of invitation tokens; expire and revoke links; rate-limit sensitive endpoints when implemented.
- Use private Supabase Storage buckets and short-lived signed URLs later.
- Do not put DATABASE_URL, DIRECT_URL, service-role keys, or raw invite tokens into browser/client components or logs.
- Prisma server access with DB credentials can bypass RLS, so app authorization is required regardless of Supabase RLS settings. Use least privilege for production DB roles.
- Record audit events for price/scope approval, invitations, exports and access changes; never log secrets or unnecessary sensitive fields.
- Never run destructive commands against production or shared databases without explicit human approval and backup.
