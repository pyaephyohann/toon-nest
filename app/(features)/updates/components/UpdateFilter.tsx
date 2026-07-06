const filters = [
  "All",
  "Action",
  "Fantasy",
  "Romance",
  "School",
  "Comedy",
  "Drama",
  "Completed",
];

export default function UpdateFilter() {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`rounded-xl px-5 py-2 transition ${
            filter === "All"
              ? "bg-primary text-white"
              : "bg-card hover:bg-secondary"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
