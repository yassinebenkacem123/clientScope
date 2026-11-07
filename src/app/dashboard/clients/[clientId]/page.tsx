import { ClientOverview } from "@/components/dashboard/clients/client-overview";

export default async function ClientDetailsPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return <ClientOverview key={clientId} clientId={clientId} />;
}
