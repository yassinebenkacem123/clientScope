import { DashboardSidebar } from "@/components/dashboard/sidebar/dashboard-sidebar";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <DashboardSidebar workspaceName="My Workspace" />
      <main className="min-h-screen lg:pl-[280px]">
        <div className="mx-auto w-full max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
