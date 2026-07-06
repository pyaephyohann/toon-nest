import {
  FilterBar,
  PopularHeader,
  PopularSidebar,
  rankings,
  RankingSection,
  topThree,
  TopThreeSection,
} from "./components";

export default function PopularPage() {
  return (
    <div className="space-y-10">
      {/* Header */}

      <PopularHeader />

      {/* Filter */}

      <FilterBar />

      {/* Top 3 */}

      <TopThreeSection items={topThree} />

      {/* Content */}

      <section className="grid gap-8 xl:grid-cols-[1fr_340px]">
        <RankingSection items={rankings} />

        <PopularSidebar />
      </section>
    </div>
  );
}
