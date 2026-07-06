import { june20, today, yesterday } from "./components/data";
import UpdateFilter from "./components/UpdateFilter";
import UpdateSection from "./components/UpdateSection";

export default function UpdatesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-10">
      {/* Header */}

      <div>
        <h1 className="text-4xl font-bold">⚡ Updates</h1>

        <p className="mt-2 text-muted-foreground">
          Stay updated with the latest chapters.
        </p>
      </div>

      {/* Filters */}

      <div className="flex items-center justify-between">
        <UpdateFilter />

        <select className="rounded-xl border border-border bg-card px-4 py-2">
          <option>Latest</option>
          <option>Oldest</option>
        </select>
      </div>

      <UpdateSection title="Today" items={today} />

      <UpdateSection title="Yesterday" items={yesterday} />

      <UpdateSection title="June 20, 2025" items={june20} />

      <div className="flex justify-center">
        <button className="rounded-xl border border-border px-8 py-3 hover:bg-secondary">
          Load More
        </button>
      </div>
    </div>
  );
}
