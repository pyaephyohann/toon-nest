import FilterBar from "@/components/ui/FilterBar";

const filters = [
  { label: "All", value: "all" },
  { label: "Action", value: "action" },
  { label: "Fantasy", value: "fantasy" },
  { label: "Romance", value: "romance" },
  { label: "School", value: "school" },
  { label: "Comedy", value: "comedy" },
  { label: "Drama", value: "drama" },
  { label: "Completed", value: "completed" },
];

export default function UpdateFilter() {
  return (
    <FilterBar
      filters={filters}
      activeFilter="all"
      showViewToggle={false}
      theme="default"
    />
  );
}
