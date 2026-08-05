"use client";

import { useState, useEffect } from "react";
import { Chapter } from "@/store/api/chapterApi";
import { useGetChapterByIdQuery } from "@/store/api/chapterApi";
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  chapterId: string;
  onClose: () => void;
}

export default function ChapterPreview({ chapterId, onClose }: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data: chapter, isLoading } = useGetChapterByIdQuery(chapterId);

  const pages = (chapter as any)?.pages || [];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "Escape") onClose();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, pages.length]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!chapter || pages.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl border border-border p-6 text-center">
          <p className="text-muted-foreground">No pages to preview</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "fixed inset-0 bg-black z-50 flex flex-col",
      isFullscreen ? "p-0" : "p-4"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between bg-card border-b border-border px-4 py-3">
        <div className="flex items-center gap-4">
          <h3 className="font-medium">
            {chapter.series?.title} - #{chapter.chapterNumber}
            {chapter.title && `: ${chapter.title}`}
          </h3>
          <span className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {pages.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg hover:bg-accent transition"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent transition"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Image Viewer */}
      <div className="flex-1 flex items-center justify-center bg-black/50 overflow-hidden">
        <div className="relative max-w-full max-h-full">
          {pages[currentPage] && (
            <img
              src={pages[currentPage].imageUrl}
              alt={`Page ${currentPage + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between bg-card border-t border-border px-4 py-3">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="h-5 w-5" />
          Previous
        </button>

        {/* Page Indicators */}
        <div className="flex items-center gap-1">
          {pages.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={cn(
                "w-2 h-2 rounded-full transition",
                index === currentPage ? "bg-primary" : "bg-muted-foreground/30"
              )}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === pages.length - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
