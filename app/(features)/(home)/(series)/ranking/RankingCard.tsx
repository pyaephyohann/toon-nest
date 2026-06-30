import Image from "next/image";
import Link from "next/link";

import Rating from "./Rating";
import Badge from "./Badge";
import { RankingSeries } from "./types";

interface Props {
  manga: RankingSeries;
}

export default function RankingCard({ manga }: Props) {
  return (
    <Link href={`/series/${manga.slug}`} className="group w-[170px] shrink-0">
      <div className="relative overflow-hidden rounded-2xl">
        <Image
          src={manga.image}
          alt={manga.title}
          width={170}
          height={240}
          className="aspect-[3/4] rounded-2xl object-cover transition duration-300 group-hover:scale-105"
        />

        <div className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-orange-400 text-sm font-bold text-white shadow">
          {manga.rank}
        </div>

        <Badge badge={manga.badge} />
      </div>

      <div className="mt-3 space-y-2">
        <p className="line-clamp-2 text-lg font-semibold transition group-hover:text-primary">
          {manga.title}
        </p>

        <p className="line-clamp-1 text-xs text-muted-foreground">
          {manga.genres.join(" • ")}
        </p>

        <Rating rating={manga.rating} />
      </div>
    </Link>
  );
}
