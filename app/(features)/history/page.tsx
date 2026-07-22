import {
  FavoriteGenres,
  FilterBar,
  HistoryHeader,
  HistoryTimeline,
  LoadMore,
  ReadingCalendar,
  ReadingStats,
  RecentlyFinished,
  ResumeJourney,
  historyData,
} from "./components";

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <HistoryHeader />

      <FilterBar />

      <section className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Left */}
        <div className="space-y-8">
          <HistoryTimeline items={historyData} />

          <LoadMore />
        </div>

        {/* Right Sidebar */}
        <aside className="sticky top-24 h-fit space-y-6">
          <ReadingStats />

          <RecentlyFinished />

          <FavoriteGenres />

          <ReadingCalendar />

          <ResumeJourney />
        </aside>
      </section>
    </div>
  );
}
