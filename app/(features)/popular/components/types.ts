export interface PopularManga {
  id: string;
  rank: number;

  title: string;
  slug: string;

  cover: string;

  genres: string[];

  rating: number;

  readers: string;

  chapters: number;

  isPremium?: boolean;

  isTrending?: boolean;
}

export interface GenreStat {
  id: string;
  name: string;
  readers: string;
  percentage: number;
}

export interface PopularStat {
  title: string;
  value: string;
  change: string;
}
