import { ClientDetailsShell } from "@/components/dashboard/clients/client-details-shell";

export default async function ClientDetailsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  return <ClientDetailsShell clientId={clientId}>{children}</ClientDetailsShell>;
}
