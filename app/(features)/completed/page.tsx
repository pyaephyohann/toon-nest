import {
  CompletedHeader,
  FilterBar,
  CompletedList,
  CompletedSidebar,
  LoadMore,
  completedSeries,
} from "./components";

export default function CompletedPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <CompletedHeader />

      {/* Filters */}
      <FilterBar />

      {/* Content */}
      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Left */}
        <div className="min-w-0 space-y-8">
          <CompletedList items={completedSeries} />

          <LoadMore />
        </div>

        {/* Right */}
        <CompletedSidebar />
      </section>
    </div>
  );
}
