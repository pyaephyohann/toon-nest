import { BaseManga } from "@/types/manga";

export interface Genre {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  cover?: string;
  seriesCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TrendingGenre {
  rank: number;

  name: string;

  percentage: number;

  icon: string;
}

export interface GenreSeries extends BaseManga {
  chapter: number;
}
