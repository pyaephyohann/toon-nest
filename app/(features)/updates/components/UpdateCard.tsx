import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";

import { UpdateItem } from "./types";

interface Props {
  manga: UpdateItem;
}

export default function UpdateCard({ manga }: Props) {
  return (
    <div className="group flex items-center rounded-2xl border border-border bg-card p-5 transition hover:border-primary hover:shadow-lg hover:shadow-primary/10">
      {/* Cover */}
      <div className="relative h-24 w-44 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={manga.cover}
          alt={manga.title}
          fill
          sizes="176px"
          className="object-cover transition-all duration-500 group-hover:scale-110"
        />

        {manga.isNew && (
          <span className="absolute left-2 top-2 rounded-md bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
            NEW
          </span>
        )}
      </div>

      {/* Title */}
      <div className="ml-5 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold">{manga.title}</h3>

          <BadgeCheck size={18} className="fill-primary text-primary" />
        </div>

        <div className="mt-3 flex gap-2">
          {manga.genres.map((genre) => (
            <span
              key={genre}
              className="rounded-full bg-secondary px-3 py-1 text-xs"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>

      {/* Chapter */}
      <div className="w-52">
        <h4 className="text-xl font-semibold">Chapter {manga.chapter}</h4>

        <p className="mt-2 text-primary">New Chapter</p>
      </div>

      {/* Time */}
      <div className="w-40 text-right">
        <p className="text-sm text-muted-foreground">• {manga.updatedAt}</p>
      </div>

      {/* Button */}
      <Link
        href={`/series/${manga.slug}/${manga.chapter}`}
        className="ml-8 flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-white transition hover:bg-primary-hover"
      >
        Read Now
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
