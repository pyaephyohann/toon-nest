import BookmarkHeader from "./components/BookmarkHeader";
import FilterBar from "./components/FilterBar";
import BookmarksPageContainer from "./components/BookmarksPageContainer";
import BookmarkSideBar from "./components/BookmarkSideBar";

export default function BookmarksPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <BookmarkHeader />

      {/* Filters */}
      <FilterBar />

      {/* Main */}
      <section className="grid gap-8 xl:grid-cols-[1fr_320px]">
        {/* Left */}
        <div className="space-y-6 min-w-0">
          <BookmarksPageContainer />
        </div>

        {/* Right */}
        <BookmarkSideBar />
      </section>
    </div>
  );
}
