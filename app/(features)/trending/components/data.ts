import { PopularManga } from "./types";

export const trendingData: PopularManga[] = [
  {
    id: "1",
    rank: 1,
    title: "Solo Necromancer",
    slug: "solo-necromancer",
    cover: "/banners/the-beginning-after-the-end.jpeg",
    genres: ["Action", "Fantasy", "Adventure"],
    rating: 4.9,
    readers: "2.8M",
    trend: 12,
    isHot: true,
  },
  {
    id: "2",
    rank: 2,
    title: "Solo Leveling",
    slug: "solo-leveling",
    cover: "/banners/the-beginning-after-the-end.jpeg",
    genres: ["Action", "Fantasy"],
    rating: 4.9,
    readers: "2.5M",
    trend: 8,
  },
  {
    id: "3",
    rank: 3,
    title: "Omniscient Reader",
    slug: "omniscient-reader",
    cover: "/banners/the-beginning-after-the-end.jpeg",
    genres: ["Fantasy", "Adventure"],
    rating: 4.8,
    readers: "2.2M",
    trend: 6,
  },

  // continue...
];

export const statistics = [
  {
    title: "Readers Today",
    value: "128K",
    change: "+18%",
  },
  {
    title: "New Comments",
    value: "14K",
    change: "+11%",
  },
  {
    title: "Bookmarks",
    value: "32K",
    change: "+24%",
  },
];

export const genreTrends = [
  {
    name: "Fantasy",
    readers: "2.8M",
    percentage: 92,
  },
  {
    name: "Action",
    readers: "2.4M",
    percentage: 84,
  },
  {
    name: "Adventure",
    readers: "1.8M",
    percentage: 73,
  },
  {
    name: "Romance",
    readers: "1.4M",
    percentage: 61,
  },
];
