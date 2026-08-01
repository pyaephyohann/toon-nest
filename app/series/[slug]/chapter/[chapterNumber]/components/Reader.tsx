"use client";

import { useEffect, useState } from "react";
import { useGetChapterByIdQuery } from "@/store/api";
import { useGetChaptersBySeriesIdQuery } from "@/store/api";
import { useSaveHistoryMutation } from "@/store/api";
import { ChevronLeft, ChevronRight, BookOpen, Lock } from "lucide-react";
import Link from "next/link";

interface Props {
  seriesSlug: string;
  chapterNumber: number;
}

export default function Reader({ seriesSlug, chapterNumber }: Props) {
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);
  
  // Get all chapters for navigation
  const { data: chaptersData } = useGetChaptersBySeriesIdQuery({
    id: seriesSlug, // Using slug as ID for now
    orderBy: "asc",
    limit: 1000,
  });

  // Find current chapter by chapter number
  const chapters = chaptersData?.chapters || [];
  const currentChapter = chapters.find(
    (ch) => parseFloat(ch.chapterNumber.toString()) === chapterNumber
  );

  const currentChapterIndex = currentChapter 
    ? chapters.findIndex((ch) => ch.id === currentChapter.id)
    : -1;

  const prevChapter = currentChapterIndex > 0 ? chapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < chapters.length - 1 ? chapters[currentChapterIndex + 1] : null;

  // Get current chapter details
  const { data: chapter, isLoading, error } = useGetChapterByIdQuery(
    currentChapter?.id || "",
    {
      skip: !currentChapter?.id,
    }
  );

  const [saveHistory] = useSaveHistoryMutation();

  // Save reading progress when chapter is loaded
  useEffect(() => {
    if (chapter && currentChapter?.id) {
      saveHistory({ chapterId: currentChapter.id });
    }
  }, [chapter, currentChapter?.id, saveHistory]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 animate-pulse text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Loading chapter...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !chapter) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">
            Failed to load chapter. Please try again later.
          </p>
          <Link
            href={`/series/${seriesSlug}`}
            className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-primary-foreground"
          >
            Back to Series
          </Link>
        </div>
      </div>
    );
  }

  // Locked chapter
  if (chapter.access && !chapter.access.canAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-bold">Chapter Locked</h2>
          <p className="mt-2 text-muted-foreground">{chapter.access.reason}</p>
          <Link
            href={`/series/${seriesSlug}`}
            className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-primary-foreground"
          >
            Back to Series
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="container-width flex items-center justify-between px-4 py-4">
          <Link
            href={`/series/${seriesSlug}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>

          <div className="text-center">
            <h1 className="font-semibold">
              {chapter.title || `Chapter ${chapterNumber}`}
            </h1>
            <p className="text-sm text-muted-foreground">
              {chapter.series?.title || "Unknown Series"}
            </p>
          </div>

          <div className="w-20" /> {/* Spacer for balance */}
        </div>
      </header>

      {/* Chapter Content */}
      <main className="container-width mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-4">
          {chapter.pages && chapter.pages.length > 0 ? (
            chapter.pages.map((page: any) => (
              <img
                key={page.id}
                src={page.imageUrl}
                alt={`Page ${page.pageNumber}`}
                className="mx-auto w-full rounded-lg"
              />
            ))
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-border bg-card p-8">
              <p className="text-muted-foreground">
                No pages available for this chapter yet.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Navigation */}
      <footer className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur">
        <div className="container-width flex items-center justify-between px-4 py-4">
          {prevChapter ? (
            <Link
              href={`/series/${seriesSlug}/chapter/${parseFloat(prevChapter.chapterNumber.toString())}`}
              className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 hover:bg-accent/80"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="hidden sm:inline">
                Chapter {parseFloat(prevChapter.chapterNumber.toString())}
              </span>
              <span className="sm:hidden">Prev</span>
            </Link>
          ) : (
            <div className="w-32" />
          )}

          <div className="text-center">
            <p className="text-sm font-medium">
              {currentChapterIndex + 1} / {chapters.length}
            </p>
          </div>

          {nextChapter ? (
            <Link
              href={`/series/${seriesSlug}/chapter/${parseFloat(nextChapter.chapterNumber.toString())}`}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              <span className="hidden sm:inline">
                Chapter {parseFloat(nextChapter.chapterNumber.toString())}
              </span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="h-5 w-5" />
            </Link>
          ) : (
            <div className="w-32" />
          )}
        </div>
      </footer>
    </div>
  );
}
