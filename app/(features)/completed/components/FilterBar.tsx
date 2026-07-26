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
  { label: "Rating", value: "rating" },
  { label: "Title", value: "title" },
  { label: "Chapters", value: "chapters" },
];

export default function CompletedFilterBar() {
  return (
    <FilterBar
      filters={filters}
      activeFilter="all"
      sortOptions={sortOptions}
      activeSort="rating"
      theme="completed"
    />
  );
}
