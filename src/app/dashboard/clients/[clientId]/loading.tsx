export default function LoadingClientOverview() {
  return <div role="status" className="space-y-6 animate-pulse motion-reduce:animate-none">
    <span className="sr-only">Loading client details…</span>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[0, 1, 2, 3].map((item) => <div key={item} className="h-28 rounded-[22px] bg-zinc-100 dark:bg-zinc-800" />)}</div>
    <div className="h-64 rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
  </div>;
}
