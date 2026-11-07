"use client";

export default function ClientOverviewError({ reset }: { reset: () => void }) {
  return <div role="alert" className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
    <h2 className="text-sm font-semibold text-slate-950 dark:text-zinc-100">Client details could not be loaded</h2>
    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Please try again to load this client’s information.</p>
    <button type="button" onClick={reset} className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 dark:focus-visible:outline-zinc-100">Try again</button>
  </div>;
}
