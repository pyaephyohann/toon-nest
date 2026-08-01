/**
 * Series Types
 * Series-related TypeScript types
 */

export interface Series {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  bannerImage?: string;
  author?: string;
  artist?: string;
  status: "ONGOING" | "COMPLETED" | "HIATUS";
  views: number;
  averageRating: number;
  totalRatings: number;
  totalChapters: number;
  readersCount: number;
  verified: boolean;
  isFeatured: boolean;
  isNew: boolean;
  createdAt: Date;
  updatedAt: Date;
  genres?: Genre[];
  tags?: Tag[];
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface SeriesFilters {
  status?: "ONGOING" | "COMPLETED" | "HIATUS";
  genreId?: string;
  search?: string;
  orderBy?: "views" | "averageRating" | "readersCount" | "createdAt" | "updatedAt";
  orderDirection?: "asc" | "desc";
}

export interface SeriesListResponse {
  series: Series[];
  total: number;
  page: number;
  limit: number;
}
