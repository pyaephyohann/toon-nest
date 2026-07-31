import {
  GenrePopularity,
  HallOfFameManga,
  RankingManga,
  TrendingItem,
  GainerItem,
  PodiumItem,
} from "./types";

export const rankingData: RankingManga[] = [
  {
    id: "1",
    rank: 1,
    title: "Solo Leveling",
    slug: "solo-leveling",
    cover: "/series/solo-leveling.jpeg",
    author: "Chugong",
    rating: 5,
    readers: "3.2M",
    genres: ["Action", "Fantasy"],
    chapters: 200,
    trend: 3,
    completed: true,
    verified: true,
  },

  {
    id: "2",
    rank: 2,
    title: "Omniscient Reader",
    slug: "omniscient-reader",
    cover: "/series/omniscient-reader.jpeg",
    author: "Sing-Shong",
    rating: 4.9,
    readers: "2.7M",
    genres: ["Fantasy", "Action"],
    chapters: 260,
    trend: 2,
    completed: false,
    verified: true,
  },

  {
    id: "3",
    rank: 3,
    title: "The Beginning After The End",
    slug: "tbate",
    cover: "/series/solo-leveling.jpeg",
    author: "TurtleMe",
    rating: 4.9,
    readers: "2.5M",
    genres: ["Fantasy", "Adventure"],
    chapters: 220,
    trend: 1,
    completed: false,
    verified: true,
  },

  {
    id: "4",
    rank: 4,
    title: "Nano Machine",
    slug: "nano-machine",
    cover: "/series/solo-leveling.jpeg",
    author: "Jeolmu Hyeon",
    rating: 4.8,
    readers: "2.2M",
    genres: ["Murim", "Action"],
    chapters: 240,
    trend: 4,
    completed: false,
    verified: true,
  },
];

export const hallOfFameData: HallOfFameManga[] = [
  {
    id: "1",
    title: "Solo Leveling",
    slug: "solo-leveling",
    cover: "/series/solo-leveling.jpeg",
    subtitle:
      "The legendary manhwa that introduced millions of readers to Korean webcomics.",
    rating: 5,
  },

  {
    id: "2",
    title: "Tower of God",
    slug: "tower-of-god",
    cover: "/series/solo-leveling.jpeg",
    subtitle:
      "A timeless fantasy adventure filled with mystery and unforgettable characters.",
    rating: 4.9,
  },

  {
    id: "3",
    title: "Omniscient Reader",
    slug: "omniscient-reader",
    cover: "/series/solo-leveling.jpeg",
    subtitle: "One of the highest-rated fantasy series loved around the world.",
    rating: 4.9,
  },
];

export const genrePopularityData: GenrePopularity[] = [
  {
    id: "1",
    name: "Action",
    percentage: 95,
    color: "#ef4444",
  },

  {
    id: "2",
    name: "Fantasy",
    percentage: 91,
    color: "#8b5cf6",
  },

  {
    id: "3",
    name: "Adventure",
    percentage: 82,
    color: "#10b981",
  },

  {
    id: "4",
    name: "Romance",
    percentage: 74,
    color: "#ec4899",
  },

  {
    id: "5",
    name: "Comedy",
    percentage: 68,
    color: "#f59e0b",
  },
];

export const trendingData: TrendingItem[] = [
  {
    rank: 1,
    title: "Solo Leveling",
    slug: "solo-leveling",
    cover: "/covers/solo-leveling.jpg",
    change: "up",
  },
  {
    rank: 2,
    title: "Nano Machine",
    slug: "nano-machine",
    cover: "/covers/nano-machine.jpg",
    change: "up",
  },
  {
    rank: 3,
    title: "Omniscient Reader",
    slug: "omniscient-reader",
    cover: "/covers/orv.jpg",
    change: "down",
  },
  {
    rank: 4,
    title: "TBATE",
    slug: "tbate",
    cover: "/covers/tbate.jpg",
    change: "up",
  },
];

export const gainersData: GainerItem[] = [
  {
    title: "Return of the Mount Hua Sect",
    change: "+12",
  },
  {
    title: "Eleceed",
    change: "+9",
  },
  {
    title: "Legend of the Northern Blade",
    change: "+8",
  },
  {
    title: "Swordmaster's Youngest Son",
    change: "+6",
  },
];

export const podiumData: PodiumItem[] = [
  {
    rank: 2,
    title: "Omniscient Reader",
    slug: "omniscient-reader",
    cover: "/series/solo-leveling.jpeg",
    rating: 4.9,
    readers: "2.4M",
  },
  {
    rank: 1,
    title: "Solo Leveling",
    slug: "solo-leveling",
    cover: "/series/solo-leveling.jpeg",
    rating: 5.0,
    readers: "3.2M",
  },
  {
    rank: 3,
    title: "The Beginning After The End",
    slug: "tbate",
    cover: "/series/solo-leveling.jpeg",
    rating: 4.8,
    readers: "2.2M",
  },
];
