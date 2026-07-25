export interface BaseManga {
  id: string;
  title: string;
  slug: string;
  cover: string;
  genres: string[];
  rating: number;
  verified?: boolean;
}

export interface MangaWithRank extends BaseManga {
  rank: number;
}

export interface MangaWithProgress extends BaseManga {
  chapter: number;
  progress: number;
}

export interface MangaWithReaders extends BaseManga {
  readers: string;
}
