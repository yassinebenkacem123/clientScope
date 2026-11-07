import { ClientRequestsFiles } from "@/components/dashboard/clients/client-requests-files";

export default async function ClientRequestsFilesPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return <ClientRequestsFiles key={clientId} clientId={clientId} />;
}
