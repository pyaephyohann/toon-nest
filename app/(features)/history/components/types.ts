export interface HistoryItem {
  id: string;
  rank: number;

  title: string;
  slug: string;
  cover: string;

  chapter: number;
  totalChapters: number;

  progress: number;

  genres: string[];

  rating: number;
  readers: string;

  verified?: boolean;

  lastRead: string;
}

export interface GenreStat {
  name: string;
  count: number;
}

export interface FinishedSeries {
  id: string;
  title: string;
  cover: string;
}

export interface ReadingStat {
  label: string;
  value: string;
}
