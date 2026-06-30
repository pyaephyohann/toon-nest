import Link from "next/link";

import { Genre } from "./types";

interface Props {
  genre: Genre;
}

import {
  Sword,
  Sparkles,
  Heart,
  GraduationCap,
  Laugh,
  Drama,
} from "lucide-react";

const icons = {
  Sword,
  Sparkles,
  Heart,
  GraduationCap,
  Laugh,
  Drama,
};

export default function GenreCard({ genre }: Props) {
  const Icon = icons[genre.icon as keyof typeof icons];

  return (
    <Link
      href={`/genres/${genre.slug}`}
      className="group flex min-w-45 items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${genre.color}`}
      >
        <Icon className="size-6 text-white" />
      </div>

      <div>
        <h4 className="font-semibold transition-colors group-hover:text-primary">
          {genre.name}
        </h4>

        <p className="text-sm text-muted-foreground">
          {genre.total.toLocaleString()} Series
        </p>
      </div>
    </Link>
  );
}
