"use client";

import { useState } from "react";
import RankingsHeader from "./components/RankingsHeader";
import RankingTabs from "./components/RankingTabs";
import RankingFilters from "./components/RankingFilters";
import TopThreePodiumContainer from "./components/TopThreePodiumContainer";
import RankingTableContainer from "./components/RankingTableContainer";
import TrendingSidebar from "./components/TrendingSidebar";
import TopGainers from "./components/TopGainers";
import GenreRanking from "./components/GenreRanking";
import HallOfFame from "./components/HallOfFame";

type TimePeriod = "daily" | "weekly" | "monthly" | "all";
type OrderByField = "views" | "averageRating" | "bookmarksCount";

export default function Rankings() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("all");
  const [orderByField, setOrderByField] = useState<OrderByField>("views");
  const [orderByDirection, setOrderByDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const handleTimePeriodChange = (period: TimePeriod) => {
    setTimePeriod(period);
    setPage(1);
  };

  const handleOrderByChange = (field: OrderByField) => {
    setOrderByField(field);
    setPage(1);
  };

  return (
    <div className="container-width space-y-8 py-8">
      <RankingsHeader />

      <RankingTabs 
        timePeriod={timePeriod}
        onTimePeriodChange={handleTimePeriodChange}
      />

      <RankingFilters
        orderByField={orderByField}
        onOrderByChange={handleOrderByChange}
      />

      <TopThreePodiumContainer
        timePeriod={timePeriod}
        orderByField={orderByField}
        orderByDirection={orderByDirection}
      />

      <section className="grid gap-8 xl:grid-cols-[1fr_330px]">
        {/* Left */}

        <div className="space-y-8">
          <RankingTableContainer
            timePeriod={timePeriod}
            orderByField={orderByField}
            orderByDirection={orderByDirection}
            page={page}
            onPageChange={setPage}
          />

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
