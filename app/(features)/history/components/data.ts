import { FinishedSeries, GenreStat, HistoryItem, ReadingStat } from "./types";

export const historyData: HistoryItem[] = [
  {
    id: "1",
    rank: 1,
    title: "Solo Necromancer",
    slug: "solo-necromancer",
    cover: "/series/solo-leveling.jpeg",

    chapter: 182,
    totalChapters: 250,

    progress: 73,

    genres: ["Action", "Fantasy", "Adventure"],

    rating: 4.9,
    readers: "2.8M",

    verified: true,

    lastRead: "10 mins ago",
  },

  {
    id: "2",
    rank: 2,
    title: "The Beginning After The End",
    slug: "tbate",
    cover: "/series/solo-leveling.jpeg",

    chapter: 156,
    totalChapters: 210,

    progress: 74,

    genres: ["Fantasy", "Adventure"],

    rating: 4.8,
    readers: "2.3M",

    verified: true,

    lastRead: "40 mins ago",
  },

  {
    id: "3",
    rank: 3,
    title: "Omniscient Reader's Viewpoint",
    slug: "orv",
    cover: "/series/solo-leveling.jpeg",

    chapter: 220,
    totalChapters: 260,

    progress: 84,

    genres: ["Action", "Fantasy", "Sci-Fi"],

    rating: 4.9,
    readers: "2.1M",

    verified: true,

    lastRead: "Yesterday",
  },

  {
    id: "4",
    rank: 4,
    title: "I Became The Male Lead's Adopted Daughter",
    slug: "adopted-daughter",
    cover: "/series/solo-leveling.jpeg",

    chapter: 89,
    totalChapters: 180,

    progress: 49,

    genres: ["Romance", "Fantasy", "Drama"],

    rating: 4.7,
    readers: "1.8M",

    verified: true,

    lastRead: "2 days ago",
  },

  {
    id: "5",
    rank: 5,
    title: "A Returner's Magic Should Be Special",
    slug: "returners-magic",
    cover: "/series/solo-leveling.jpeg",

    chapter: 133,
    totalChapters: 260,

    progress: 51,

    genres: ["Action", "Fantasy", "Magic"],

    rating: 4.7,
    readers: "1.6M",

    verified: true,

    lastRead: "Last Week",
  },
];

export const readingStats: ReadingStat[] = [
  {
    label: "Reading Time",
    value: "184 hrs",
  },
  {
    label: "Chapters Read",
    value: "2,483",
  },
  {
    label: "Series Finished",
    value: "47",
  },
  {
    label: "Reading Streak",
    value: "32 Days",
  },
];

export const favoriteGenres: GenreStat[] = [
  {
    name: "Fantasy",
    count: 24,
  },
  {
    name: "Action",
    count: 19,
  },
  {
    name: "Adventure",
    count: 16,
  },
  {
    name: "Romance",
    count: 11,
  },
  {
    name: "Drama",
    count: 8,
  },
];

export const finishedSeries: FinishedSeries[] = [
  {
    id: "1",
    title: "The Boxer",
    cover: "/banners/the-beginning-after-the-end.jpeg",
  },
  {
    id: "2",
    title: "Sweet Home",
    cover: "/banners/the-beginning-after-the-end.jpeg",
  },
  {
    id: "3",
    title: "Bastard",
    cover: "/banners/the-beginning-after-the-end.jpeg",
  },
];
