import Image from "next/image";
import Link from "next/link";

import ProgressBar from "./ProgressBar";
import { ContinueReading } from "./types";

interface Props {
  manga: ContinueReading;
}

export default function ContinueReadingCard({ manga }: Props) {
  return (
    <Link
      href={`/series/${manga.slug}`}
      className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={manga.coverImage}
          alt={manga.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
      </div>

      <div className="space-y-3 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold transition group-hover:text-primary">
          {manga.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Chapter {manga.chapter}</span>

          <span>{manga.progress}%</span>
        </div>

        <ProgressBar progress={manga.progress} />
      </div>
    </Link>
  );
}
