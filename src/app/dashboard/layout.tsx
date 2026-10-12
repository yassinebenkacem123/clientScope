import { DashboardLayoutShell } from "@/components/dashboard/dashboard-layout-shell";
import { SidebarProvider } from "@/components/dashboard/sidebar-context";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <DashboardLayoutShell workspaceName="My Workspace">{children}</DashboardLayoutShell>
    </SidebarProvider>
  );
}
