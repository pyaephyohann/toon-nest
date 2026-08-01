"use client";

import { Grid2X2, List, ChevronDown } from "lucide-react";
import { useState } from "react";
import TagButton from "@/components/ui/TagButton";

type OrderByField = "views" | "averageRating" | "bookmarksCount";

const genres = ["All", "Action", "Fantasy", "Romance", "Comedy", "Adventure"];

const sortOptions = [
  { label: "Views", value: "views" as OrderByField },
  { label: "Rating", value: "averageRating" as OrderByField },
  { label: "Bookmarks", value: "bookmarksCount" as OrderByField },
];

interface Props {
  orderByField: OrderByField;
  onOrderByChange: (field: OrderByField) => void;
}

export default function RankingFilters({ orderByField, onOrderByChange }: Props) {
  const [activeGenre, setActiveGenre] = useState("All");

  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-wrap gap-3">
        {genres.map((genre) => (
          <TagButton
            key={genre}
            variant={activeGenre === genre ? "primary" : "default"}
            onClick={() => setActiveGenre(genre)}
          >
            {genre}
          </TagButton>
        ))}

        <button className="flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm text-muted-foreground transition hover:border-primary">
          More
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={orderByField}
          onChange={(e) => onOrderByChange(e.target.value as OrderByField)}
          className="rounded-xl border border-border bg-secondary px-4 py-2 text-sm text-muted-foreground transition hover:border-primary focus:border-primary focus:outline-none"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button className="rounded-xl border border-border bg-secondary p-3 transition hover:border-primary">
          <Grid2X2 size={18} />
        </button>

        <button className="rounded-xl border border-border bg-secondary p-3 transition hover:border-primary">
          <List size={18} />
        </button>
      </div>
    </div>
  );
}
