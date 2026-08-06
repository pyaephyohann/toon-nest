/**
 * Database test helpers
 */

import prisma from "@/lib/prisma";

export const cleanDatabase = async () => {
  // Clean tables in order to respect foreign key constraints
  await prisma.moderationAction.deleteMany();
  await prisma.report.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.readingHistory.deleteMany();
  await prisma.userSeriesStatus.deleteMany();
  await prisma.series.deleteMany();
  await prisma.systemSetting.deleteMany();
  await prisma.user.deleteMany();
};

export const createTestUser = async (data: {
  username: string;
  email: string;
  password: string;
  role?: string;
}) => {
  return prisma.user.create({
    data: {
      ...data,
      role: data.role as any || "USER",
    },
  });
};

export const createTestManga = async (data: {
  title: string;
  slug: string;
  description: string;
  author: string;
  artist: string;
  genreIds?: string[];
}) => {
  return prisma.series.create({
    data: {
      ...data,
      coverImage: "",
      status: "ONGOING",
    },
  });
};

export const createTestChapter = async (data: {
  mangaId: string;
  chapterNumber: number;
  title: string;
}) => {
  return prisma.chapter.create({
    data: {
      ...data,
      slug: `chapter-${data.chapterNumber}`,
      series: {
        connect: { id: data.mangaId },
      },
    },
  });
};
