/**
 * Genre Constants
 * Genre definitions with icons and colors for UI
 */

export const GENRES = [
  {
    name: "Action",
    slug: "action",
    icon: "⚔️",
    color: "bg-red-500",
  },
  {
    name: "Fantasy",
    slug: "fantasy",
    icon: "✨",
    color: "bg-violet-500",
  },
  {
    name: "Romance",
    slug: "romance",
    icon: "💜",
    color: "bg-pink-500",
  },
  {
    name: "Adventure",
    slug: "adventure",
    icon: "🧭",
    color: "bg-emerald-500",
  },
  {
    name: "Comedy",
    slug: "comedy",
    icon: "😂",
    color: "bg-yellow-500",
  },
  {
    name: "School",
    slug: "school",
    icon: "🎓",
    color: "bg-blue-500",
  },
  {
    name: "Horror",
    slug: "horror",
    icon: "👻",
    color: "bg-red-600",
  },
  {
    name: "Drama",
    slug: "drama",
    icon: "🎭",
    color: "bg-purple-500",
  },
  {
    name: "Sci-Fi",
    slug: "sci-fi",
    icon: "🚀",
    color: "bg-cyan-500",
  },
  {
    name: "Mystery",
    slug: "mystery",
    icon: "🔍",
    color: "bg-indigo-500",
  },
  {
    name: "Sports",
    slug: "sports",
    icon: "⚽",
    color: "bg-green-500",
  },
  {
    name: "Slice of Life",
    slug: "slice-of-life",
    icon: "🌸",
    color: "bg-pink-400",
  },
] as const;

export const GENRE_BY_SLUG = GENRES.reduce(
  (acc, genre) => ({
    ...acc,
    [genre.slug]: genre,
  }),
  {} as Record<string, (typeof GENRES)[number]>
);
