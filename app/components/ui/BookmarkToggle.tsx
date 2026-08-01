"use client";

import { useToggleBookmarkMutation } from "@/store/api";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface Props {
  seriesId: string;
  isBookmarked?: boolean;
  onToggle?: (bookmarked: boolean) => void;
}

export default function BookmarkToggle({ seriesId, isBookmarked = false, onToggle }: Props) {
  const [toggleBookmark, { isLoading }] = useToggleBookmarkMutation();

  const handleToggle = async () => {
    try {
      const result = await toggleBookmark({ seriesId }).unwrap();
      onToggle?.(result.bookmarked);
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className="rounded-full p-2 transition hover:bg-accent disabled:opacity-50"
      title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
    >
      {isBookmarked ? (
        <BookmarkCheck className="h-5 w-5 text-primary" />
      ) : (
        <Bookmark className="h-5 w-5 text-muted-foreground" />
      )}
    </button>
  );
}
