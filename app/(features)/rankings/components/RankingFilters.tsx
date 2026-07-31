"use client";

import { Grid2X2, List, ChevronDown } from "lucide-react";
import { useState } from "react";
import TagButton from "@/components/ui/TagButton";

const genres = ["All", "Action", "Fantasy", "Romance", "Comedy", "Adventure"];

export default function RankingFilters() {
  const [active, setActive] = useState("All");

  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-wrap gap-3">
        {genres.map((genre) => (
          <TagButton
            key={genre}
            variant={active === genre ? "primary" : "default"}
            onClick={() => setActive(genre)}
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
        <button className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-2 text-sm text-muted-foreground transition hover:border-primary">
          All Types
          <ChevronDown size={16} />
        </button>

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
