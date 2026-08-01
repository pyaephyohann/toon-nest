import HistoryHeader from "./components/HistoryHeader";
import FilterBar from "./components/FilterBar";
import HistoryPageContainer from "./components/HistoryPageContainer";
import ReadingStats from "./components/ReadingStats";
import RecentlyFinished from "./components/RecentlyFinished";
import FavoriteGenres from "./components/FavoriteGenres";
import ReadingCalendar from "./components/ReadingCalendar";
import ResumeJourney from "./components/ResumeJourney";

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <HistoryHeader />

      <FilterBar />

      <section className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Left */}
        <div className="space-y-8">
          <HistoryPageContainer />
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
