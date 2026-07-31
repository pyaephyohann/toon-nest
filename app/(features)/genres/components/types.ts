import { BaseManga } from "@/types/manga";

export interface Genre {
  id: number;
  name: string;
  slug: string;
  icon: string;

  cover: string;

  seriesCount: number;

  color: string;
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
