# Skill: Architecture
Read when organizing modules and determining ownership.

Flow: freelancer signs in -> creates workspace -> creates client and project -> invites client -> receives onboarding submissions and assets -> resolves questions and approves scope + price -> processes tickets and meeting requests -> raises additional quote for out-of-scope work -> client approves -> reviews deliverables.

Domains: Identity/Core (9 models), Onboarding (6), Collaboration (8), Commercial/Delivery/Ops (13). The single `prisma/schema.prisma` includes all 36. Client's business and user's identity are separate; a client organization can have multiple contacts/projects.

`Project` is central but always belongs to `Workspace` and `Client`. Enforce that Client.workspaceId equals Project.workspaceId using transactions/service checks or composite foreign keys if later required. Avoid tightly coupling the UI to raw Prisma shapes.
