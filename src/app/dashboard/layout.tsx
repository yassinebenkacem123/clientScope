import { DashboardLayoutShell } from "@/components/dashboard/dashboard-layout-shell";
import { SidebarProvider } from "@/components/dashboard/sidebar-context";
import { ClientsProvider } from "@/components/dashboard/clients/clients-provider";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <ClientsProvider>
        <DashboardLayoutShell workspaceName="My Workspace">{children}</DashboardLayoutShell>
      </ClientsProvider>
    </SidebarProvider>
  );
}
