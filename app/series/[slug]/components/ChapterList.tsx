"use client";

import { useGetMangaByIdQuery } from "@/store/api";
import { useGetChaptersBySeriesIdQuery } from "@/store/api";
import { Chapter } from "@/store/api";
import RatingsSection from "./RatingsSection";

interface Props {
  seriesId: string;
}

export default function ChapterList({ seriesId }: Props) {
  const { data: series, isLoading: seriesLoading, error: seriesError } = useGetMangaByIdQuery(seriesId);
  const { data: chaptersData, isLoading: chaptersLoading, error: chaptersError } = useGetChaptersBySeriesIdQuery({ 
    id: seriesId,
    orderBy: "desc",
    limit: 100
  });

  // Loading state
  if (seriesLoading || chaptersLoading) {
    return (
      <div className="space-y-6">
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (seriesError || chaptersError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-border bg-card p-8">
        <p className="text-muted-foreground">
          Failed to load series information. Please try again later.
        </p>
      </div>
    );
  }

  // Empty state
  if (!series) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-border bg-card p-8">
        <p className="text-muted-foreground">Series not found.</p>
      </div>
    );
  }

  const chapters = chaptersData?.chapters || [];

  return (
    <div className="space-y-6">
      {/* Series Info */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h1 className="text-3xl font-bold">{series.title}</h1>
        <p className="mt-2 text-muted-foreground">{series.description}</p>
        <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
          <span>{series.totalChapters} chapters</span>
          <span>•</span>
          <span>{series.averageRating.toFixed(1)} rating</span>
          <span>•</span>
          <span>{series.views} views</span>
        </div>
      </div>

      {/* Chapter List */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-2xl font-bold">Chapters</h2>

        {chapters.length === 0 ? (
          <p className="mt-4 text-muted-foreground">No chapters available yet.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {chapters.map((chapter: Chapter) => (
              <ChapterRow key={chapter.id} chapter={chapter} seriesSlug={series.slug} />
            ))}
          </div>
        )}
      </div>

      {/* Ratings Section */}
      <RatingsSection seriesId={seriesId} />
    </div>
  );
}

function ChapterRow({ chapter, seriesSlug }: { chapter: Chapter; seriesSlug: string }) {
  const chapterNumber = parseFloat(chapter.chapterNumber.toString());
  const isLocked = chapter.unlockType !== "FREE";

  return (
    <a
      href={`/series/${seriesSlug}/chapter/${chapterNumber}`}
      className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition hover:border-primary hover:bg-accent"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
          {chapterNumber}
        </div>
        <div>
          <h3 className="font-semibold">
            {chapter.title || `Chapter ${chapterNumber}`}
          </h3>
          <p className="text-sm text-muted-foreground">
            {new Date(chapter.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {isLocked && (
          <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-600">
            {chapter.unlockType}
          </span>
        )}
        <span className="text-sm text-muted-foreground">{chapter.views} views</span>
      </div>
    </a>
  );
}
