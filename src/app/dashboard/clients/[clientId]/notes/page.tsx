import { ClientNotes } from "@/components/dashboard/clients/client-notes";

export default async function ClientNotesPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return <ClientNotes key={clientId} clientId={clientId} />;
}
