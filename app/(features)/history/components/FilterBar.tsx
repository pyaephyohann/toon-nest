import FilterBar from "@/components/ui/FilterBar";

const filters = [
  { label: "All", value: "all" },
  { label: "Action", value: "action" },
  { label: "Fantasy", value: "fantasy" },
  { label: "Romance", value: "romance" },
  { label: "Comedy", value: "comedy" },
  { label: "Drama", value: "drama" },
  { label: "School", value: "school" },
];

const sortOptions = [
  { label: "Last Read", value: "last-read" },
  { label: "Title", value: "title" },
  { label: "Progress", value: "progress" },
];

export default function HistoryFilterBar() {
  return (
    <FilterBar
      filters={filters}
      activeFilter="all"
      sortOptions={sortOptions}
      activeSort="last-read"
      theme="primary"
    />
  );
}
