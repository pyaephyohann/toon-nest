import {
  TrendingHeader,
  FilterBar,
  StatisticsCard,
  GenreTrend,
  LoadMore,
  statistics,
  genreTrends,
} from "./components";
import TrendingListContainer from "./components/TrendingListContainer";
import TrendingSidebarContainer from "./components/TrendingSidebarContainer";

export default function Trending() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <TrendingHeader />

      {/* Filter */}
      <FilterBar />

      {/* Main Content */}
      <section className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Left Side */}
        <div className="space-y-8">
          <TrendingListContainer />

          <LoadMore />
        </div>

        {/* Right Side */}
        <div className="space-y-6">
          <TrendingSidebarContainer />

          {/* Statistics */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">📈 Trending Statistics</h2>

            {statistics.map((item) => (
              <StatisticsCard
                key={item.title}
                title={item.title}
                value={item.value}
                change={item.change}
              />
            ))}
          </div>

          {/* Genre Trends */}
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="mb-6 text-xl font-bold">🔥 Genre Trends</h2>

            <div className="space-y-5">
              {genreTrends.map((genre) => (
                <GenreTrend
                  key={genre.name}
                  name={genre.name}
                  readers={genre.readers}
                  percentage={genre.percentage}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
