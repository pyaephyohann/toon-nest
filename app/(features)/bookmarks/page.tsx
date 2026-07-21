import {
  BookmarkHeader,
  FilterBar,
  BookmarkList,
  BookmarkSideBar,
  LoadMore,
  bookmarks,
} from "./components";

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
          <BookmarkList items={bookmarks} />

          <LoadMore />
        </div>

        {/* Right */}
        <BookmarkSideBar />
      </section>
    </div>
  );
}
