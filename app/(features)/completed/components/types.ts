import { MangaWithRank, MangaWithReaders } from "@/types/manga";

export interface CompletedManga extends MangaWithRank, MangaWithReaders {
  chapters: number;
  completed: boolean;
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
