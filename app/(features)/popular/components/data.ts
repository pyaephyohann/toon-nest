import { GenreStat, PopularManga, PopularStat } from "./types";

export const topThree: PopularManga[] = [
  {
    id: "1",
    rank: 1,
    title: "Solo Necromancer",
    slug: "solo-necromancer",
    cover: "/series/solo-leveling.jpeg",
    genres: ["Action", "Fantasy", "Adventure"],
    rating: 4.9,
    readers: "2.8M",
    chapters: 182,
    isTrending: true,
  },

  {
    id: "2",
    rank: 2,
    title: "Solo Leveling",
    slug: "solo-leveling",
    cover: "/series/solo-leveling.jpeg",
    genres: ["Action", "Fantasy"],
    rating: 4.9,
    readers: "2.1M",
    chapters: 200,
  },

  {
    id: "3",
    rank: 3,
    title: "Omniscient Reader's Viewpoint",
    slug: "omniscient-readers-viewpoint",
    cover: "/series/solo-leveling.jpeg",
    genres: ["Action", "Fantasy", "Sci-Fi"],
    rating: 4.8,
    readers: "1.9M",
    chapters: 264,
  },
];

export const rankings: PopularManga[] = [
  {
    id: "4",
    rank: 4,
    title: "The Beginning After The End",
    slug: "tbate",
    cover: "/series/solo-leveling.jpeg",
    genres: ["Fantasy", "Adventure", "Magic"],
    rating: 4.8,
    readers: "1.7M",
    chapters: 215,
  },

  {
    id: "5",
    rank: 5,
    title: "Return of the Disaster-Class Hero",
    slug: "return-disaster-class-hero",
    cover: "/series/solo-leveling.jpeg",
    genres: ["Action", "Fantasy"],
    rating: 4.8,
    readers: "1.6M",
    chapters: 127,
  },

  {
    id: "6",
    rank: 6,
    title: "Tower of God",
    slug: "tower-of-god",
    cover: "/series/solo-leveling.jpeg",
    genres: ["Action", "Adventure", "Fantasy"],
    rating: 4.8,
    readers: "1.5M",
    chapters: 675,
  },

  {
    id: "7",
    rank: 7,
    title: "I Became the Male Lead's Adopted Daughter",
    slug: "male-leads-adopted-daughter",
    cover: "/series/solo-leveling.jpeg",
    genres: ["Romance", "Fantasy", "Drama"],
    rating: 4.7,
    readers: "1.3M",
    chapters: 89,
  },

  {
    id: "8",
    rank: 8,
    title: "The World After The Fall",
    slug: "world-after-the-fall",
    cover: "/series/solo-leveling.jpeg",
    genres: ["Action", "Fantasy"],
    rating: 4.7,
    readers: "1.2M",
    chapters: 176,
  },
];

export const stats: PopularStat[] = [
  {
    title: "Most Read",
    value: "12.4M",
    change: "+12.5%",
  },

  {
    title: "Updated Today",
    value: "254",
    change: "+8.2%",
  },

  {
    title: "Readers Online",
    value: "18.7K",
    change: "+15.3%",
  },

  {
    title: "Premium Users",
    value: "23%",
    change: "+5.7%",
  },
];

export const genres: GenreStat[] = [
  {
    id: "1",
    name: "Action",
    readers: "4.2M",
    percentage: 95,
  },

  {
    id: "2",
    name: "Fantasy",
    readers: "3.8M",
    percentage: 85,
  },

  {
    id: "3",
    name: "Adventure",
    readers: "2.6M",
    percentage: 70,
  },

  {
    id: "4",
    name: "Drama",
    readers: "1.8M",
    percentage: 52,
  },

  {
    id: "5",
    name: "Romance",
    readers: "1.5M",
    percentage: 45,
  },
];
