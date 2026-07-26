import FilterBar from "@/components/ui/FilterBar";

const timeFilters = [
  { label: "Today", value: "today" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "All Time", value: "all-time" },
];

const genreFilters = [
  { label: "All", value: "all" },
  { label: "Action", value: "action" },
  { label: "Fantasy", value: "fantasy" },
  { label: "Romance", value: "romance" },
  { label: "Comedy", value: "comedy" },
  { label: "Drama", value: "drama" },
  { label: "School", value: "school" },
];

const sortOptions = [
  { label: "Popularity", value: "popularity" },
  { label: "Rating", value: "rating" },
  { label: "Title", value: "title" },
];

export default function PopularFilterBar() {
  return (
    <FilterBar
      filters={genreFilters}
      activeFilter="all"
      sortOptions={sortOptions}
      activeSort="popularity"
      theme="default"
    />
  );
}
