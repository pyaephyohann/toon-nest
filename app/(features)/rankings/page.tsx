import RankingsHeader from "./components/RankingsHeader";
import RankingTabs from "./components/RankingTabs";
import RankingFilters from "./components/RankingFilters";
import TopThreePodiumContainer from "./components/TopThreePodiumContainer";
import RankingTableContainer from "./components/RankingTableContainer";
import TrendingSidebar from "./components/TrendingSidebar";
import TopGainers from "./components/TopGainers";
import GenreRanking from "./components/GenreRanking";
import HallOfFame from "./components/HallOfFame";

export default function Rankings() {
  return (
    <div className="container-width space-y-8 py-8">
      <RankingsHeader />

      <RankingTabs />

      <RankingFilters />

      <TopThreePodiumContainer />

      <section className="grid gap-8 xl:grid-cols-[1fr_330px]">
        {/* Left */}

        <div className="space-y-8">
          <RankingTableContainer />

          <HallOfFame />
        </div>

        {/* Right */}

        <aside className="space-y-6">
          <TrendingSidebar />

          <TopGainers />

          <GenreRanking />
        </aside>
      </section>
    </div>
  );
}
