import type { Metadata } from "next";
import { ClientsSearchBar } from "@/components/dashboard/clients/clients-search-bar";

export const metadata: Metadata = {
  title: "Clients | ClientScope",
  description: "Client directory, contacts, and associated projects",
};

export default function ClientsPage() {
  return (
    <section aria-labelledby="clients-heading" className="space-y-6">


      {/* Toolbar / Search Component */}
      <ClientsSearchBar />

      {/* Empty State placeholder */}
      <div className="flex min-h-100 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 p-8 text-center dark:border-zinc-800">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Clients page is ready to be built.
        </p>
      </div>
    </section>
  );
}
