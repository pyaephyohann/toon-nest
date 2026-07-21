export interface BookmarkManga {
  id: string;

  rank: number;

  title: string;

  slug: string;

  cover: string;

  chapter: number;

  rating: number;

  readers: string;

  genres: string[];

  progress: number;

  verified?: boolean;

  status: "Reading" | "Plan To Read" | "Completed" | "On Hold";
}
