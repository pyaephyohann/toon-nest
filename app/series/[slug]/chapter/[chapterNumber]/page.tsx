import Reader from "./components/Reader";

interface PageProps {
  params: Promise<{ slug: string; chapterNumber: string }>;
}

export default async function ReaderPage({ params }: PageProps) {
  const { slug, chapterNumber } = await params;

  return (
    <div className="min-h-screen bg-background">
      <Reader seriesSlug={slug} chapterNumber={parseFloat(chapterNumber)} />
    </div>
  );
}
