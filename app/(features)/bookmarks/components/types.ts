import { MangaWithRank, MangaWithProgress, MangaWithReaders } from "@/types/manga";

export interface BookmarkManga extends MangaWithRank, MangaWithProgress, MangaWithReaders {
  status: "Reading" | "Plan To Read" | "Completed" | "On Hold";
}
