import "dotenv/config";
import { Client } from "pg";

const expectedTables = [
  "User",
  "Workspace",
  "WorkspaceMember",
  "WorkspaceBranding",
  "Client",
  "ClientContact",
  "Project",
  "ProjectMember",
  "ProjectInvitation",
  "OnboardingTemplate",
  "OnboardingForm",
  "OnboardingSubmission",
  "FormAnswer",
  "ProjectPage",
  "PageSection",
  "Ticket",
  "TicketComment",
  "ClientActionItem",
  "Meeting",
  "MeetingAttendee",
  "MeetingNote",
  "File",
  "FileAttachment",
  "ScopeVersion",
  "ScopeItem",
  "ChangeRequest",
  "Quote",
  "QuoteItem",
  "Approval",
  "Deliverable",
  "DeliverableReview",
  "Notification",
  "NotificationPreference",
  "Reminder",
  "AuditEvent",
  "Export",
] as const;

async function main() {
  const connectionString = process.env.DIRECT_URL;
  if (!connectionString) throw new Error("Missing DIRECT_URL");

  const client = new Client({ connectionString });
  await client.connect();

  try {
    const result = await client.query<{ table_name: string }>(
      `SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = $1 AND table_type = $2`,
      ["public", "BASE TABLE"],
    );
    const actualTables = new Set(result.rows.map(({ table_name }) => table_name));
    const missingTables = expectedTables.filter((table) => !actualTables.has(table));

    console.log(
      JSON.stringify(
        {
          connection: "PASS",
          publicBaseTables: actualTables.size,
          expectedClientScopeTables: expectedTables.length,
          missingClientScopeTables: missingTables.length,
        },
        null,
        2,
      ),
    );

    if (missingTables.length > 0) process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error("Schema verification FAILED:", message);
  process.exitCode = 1;
});
