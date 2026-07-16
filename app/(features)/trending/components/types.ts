export interface PopularManga {
  id: string;
  rank: number;

  title: string;
  slug: string;

  cover: string;

  genres: string[];

  rating: number;

  readers: string;

  trend: number;

  isHot?: boolean;
}
