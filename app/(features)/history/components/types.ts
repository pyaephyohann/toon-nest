import { MangaWithRank, MangaWithProgress, MangaWithReaders } from "@/types/manga";

export interface HistoryItem extends MangaWithRank, MangaWithProgress, MangaWithReaders {
  totalChapters: number;
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
