# Skill: Domain Workflows

## Onboarding
Project invite -> client joins -> project-specific form made from template snapshot -> draft submission with answers -> submitted -> freelancer review. `ProjectPage`/`PageSection` let website clients describe pages without editing raw HTML.

## Tickets
Client creates `Ticket` with `SUBMITTED` / `PENDING_REVIEW`; freelancer triages. Work only enters in-progress once classified as included or quote approved. `TicketStatus` is execution; `ScopeStatus` is commercial decision. Backlog = view/filter over tickets, no separate Backlog table.

## Changes & quotes
Original scope v1 approved; new request creates `ChangeRequest` and one or more `Quote` revisions with `QuoteItem`s; approved quote results in v2 scope snapshot and updates agreed total transactionally. Never modify previously approved revisions. Record approver and timestamp. `Approval` points to exactly one scope version or quote; enforce at DB layer.

## Meetings and delivery
Client requests meeting, agency confirms/declines; attendees get invitation and notes. Deliverable published for review; approved or revision requested. Reminders target outstanding tasks; notification messages should be idempotent.
