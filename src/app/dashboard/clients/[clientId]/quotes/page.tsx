import { ClientQuotes } from "@/components/dashboard/clients/client-quotes";

export default async function ClientQuotesPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return <ClientQuotes key={clientId} clientId={clientId} />;
}
