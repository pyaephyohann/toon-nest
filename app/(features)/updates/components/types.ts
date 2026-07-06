export interface UpdateItem {
  id: string;
  title: string;
  slug: string;
  cover: string;
  chapter: number;
  genres: string[];
  updatedAt: string;
  rating?: number;
  views?: string;
  isNew?: boolean;
  isPremium?: boolean;
}
