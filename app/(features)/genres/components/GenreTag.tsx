import TagButton from "@/components/ui/TagButton";

const tags = [
  "Action",
  "Fantasy",
  "Romance",
  "Adventure",
  "Comedy",
  "Drama",
  "School",
  "Murim",
  "Magic",
  "System",
  "Reincarnation",
  "Historical",
  "Horror",
  "Sci-Fi",
  "Sports",
  "Martial Arts",
];

export default function GenreTags() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <h2 className="text-xl font-bold">Browse by Tags</h2>

      <div className="mt-6 flex flex-wrap gap-3">
        {tags.map((tag) => (
          <TagButton key={tag}>{tag}</TagButton>
        ))}
      </div>
    </section>
  );
}
