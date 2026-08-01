export interface RankingSeries {
  id: string;
  rank: number;
  title: string;
  slug: string;
  image: string;
  genres: string[];
  rating: number;
  badge?: string;
  totalChapters?: number;
  views?: number;
  readersCount?: number;
}
