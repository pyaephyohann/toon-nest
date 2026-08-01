import {
  FilterBar,
  PopularHeader,
  PopularSidebar,
  RankingSection,
  TopThreeSection,
} from "./components";
import TopThreeContainer from "./components/TopThreeContainer";
import RankingContainer from "./components/RankingContainer";

export default function PopularPage() {
  return (
    <div className="space-y-10">
      {/* Header */}

      <PopularHeader />

      {/* Filter */}

      <FilterBar />

      {/* Top 3 */}

      <TopThreeContainer />

      {/* Content */}

      <section className="grid gap-8 xl:grid-cols-[1fr_340px]">
        <RankingContainer />

        <PopularSidebar />
      </section>
    </div>
  );
}
