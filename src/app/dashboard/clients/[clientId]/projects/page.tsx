import { ClientProjects } from "@/components/dashboard/clients/client-projects";

export default async function ClientProjectsPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return <ClientProjects key={clientId} clientId={clientId} />;
}
