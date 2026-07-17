export interface CompletedManga {
  id: string;
  rank: number;
  title: string;
  slug: string;
  cover: string;

  genres: string[];

  rating: number;

  readers: string;

  chapters: number;

  completed: boolean;

  verified?: boolean;
}

export interface Collection {
  id: string;
  title: string;
  image: string;
  series: number;
}

export interface Stats {
  totalSeries: number;
  averageChapters: number;
  highestRated: string;
  longestSeries: string;
}
