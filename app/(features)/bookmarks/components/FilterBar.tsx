import FilterBar from "@/components/ui/FilterBar";

const filters = [
  { label: "All", value: "all" },
  { label: "Reading", value: "reading" },
  { label: "Plan To Read", value: "plan-to-read" },
  { label: "On Hold", value: "on-hold" },
  { label: "Dropped", value: "dropped" },
];

const sortOptions = [
  { label: "Last Added", value: "last-added" },
  { label: "Title", value: "title" },
  { label: "Rating", value: "rating" },
];

export default function BookmarkFilterBar() {
  return (
    <FilterBar
      filters={filters}
      activeFilter="all"
      sortOptions={sortOptions}
      activeSort="last-added"
      theme="primary"
    />
  );
}
