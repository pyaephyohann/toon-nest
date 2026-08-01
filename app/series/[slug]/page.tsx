import { notFound } from "next/navigation";
import { useGetMangaByIdQuery } from "@/store/api";
import { useGetChaptersBySeriesIdQuery } from "@/store/api";
import ChapterList from "./components/ChapterList";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function SeriesPage({ params }: PageProps) {
  const { slug } = await params;

  // For now, we'll use the slug as the ID since we don't have a slug lookup endpoint
  // In production, you'd want to add a GET /api/manga/by-slug/[slug] endpoint
  const seriesId = slug;

  return (
    <div className="container-width space-y-8 py-8">
      <ChapterList seriesId={seriesId} />
    </div>
  );
}
