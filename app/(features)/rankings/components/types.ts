import { BaseManga } from "@/types/manga";

export interface RankingManga extends BaseManga {
  rank: number;
  author: string;
  readers: string;
  chapters: number;
  trend: number;
  completed: boolean;
  verified: boolean;
}

export interface HallOfFameManga {
  id: string;
  title: string;
  slug: string;
  cover: string;
  subtitle: string;
  rating: number;
}

export interface GenrePopularity {
  id: string;
  name: string;
  percentage: number;
  color: string;
}

export interface TrendingItem {
  rank: number;
  title: string;
  slug: string;
  cover: string;
  change: "up" | "down";
}

export interface GainerItem {
  title: string;
  change: string;
}

export interface PodiumItem {
  rank: number;
  title: string;
  slug: string;
  cover: string;
  rating: number;
  readers: string;
}
