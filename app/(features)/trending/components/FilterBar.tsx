import FilterBar from "@/components/ui/FilterBar";

const filters = [
  { label: "All", value: "all" },
  { label: "Action", value: "action" },
  { label: "Fantasy", value: "fantasy" },
  { label: "Romance", value: "romance" },
  { label: "Comedy", value: "comedy" },
  { label: "Drama", value: "drama" },
  { label: "School", value: "school" },
  { label: "Sci-Fi", value: "sci-fi" },
];

const sortOptions = [
  { label: "This Week", value: "this-week" },
  { label: "This Month", value: "this-month" },
  { label: "All Time", value: "all-time" },
];

export default function TrendingFilterBar() {
  return (
    <FilterBar
      filters={filters}
      activeFilter="all"
      sortOptions={sortOptions}
      activeSort="this-week"
      theme="primary"
    />
  );
}
