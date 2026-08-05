"use client";

import { Chapter } from "@/store/api/chapterApi";
import { GetChaptersParams } from "@/store/api/chapterApi";
import { useGetChaptersQuery, useDeleteChapterMutation, useUpdateChapterMutation, useDuplicateChapterMutation } from "@/store/api/chapterApi";
import { useState } from "react";
import { Search, ArrowUpDown, Edit, Trash2, Copy, ChevronLeft, ChevronRight, Eye, Lock, LockOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onEdit: (chapter: Chapter) => void;
  onPreview: (chapter: Chapter) => void;
}

export default function ChapterList({ onEdit, onPreview }: Props) {
  const [params, setParams] = useState<GetChaptersParams>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useGetChaptersQuery(params);
  const [deleteChapter] = useDeleteChapterMutation();
  const [updateChapter] = useUpdateChapterMutation();
  const [duplicateChapter] = useDuplicateChapterMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams({ ...params, search: searchQuery, page: 1 });
  };

  const handleSort = (sortBy: "chapterNumber" | "views" | "createdAt" | "updatedAt") => {
    if (params.sortBy === sortBy) {
      setParams({ ...params, sortOrder: params.sortOrder === "asc" ? "desc" : "asc" });
    } else {
      setParams({ ...params, sortBy, sortOrder: "asc" });
    }
  };

  const handleFilter = (filter: keyof GetChaptersParams, value: string | undefined) => {
    setParams({ ...params, [filter]: value, page: 1 });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this chapter? This will also delete all associated pages.")) {
      try {
        await deleteChapter(id).unwrap();
      } catch (error) {
        console.error("Failed to delete chapter:", error);
      }
    }
  };

  const handleTogglePremium = async (chapter: Chapter) => {
    try {
      const newUnlockType = chapter.unlockType === "PREMIUM" ? "FREE" : "PREMIUM";
      await updateChapter({ id: chapter.id, data: { unlockType: newUnlockType } }).unwrap();
    } catch (error) {
      console.error("Failed to toggle premium status:", error);
    }
  };

  const handleDuplicate = async (chapter: Chapter) => {
    const newChapterNumber = prompt(
      "Enter new chapter number:",
      String(Number(chapter.chapterNumber) + 0.1)
    );

    if (!newChapterNumber) return;

    const parsedNumber = parseFloat(newChapterNumber);
    if (isNaN(parsedNumber)) {
      alert("Invalid chapter number");
      return;
    }

    try {
      await duplicateChapter({ id: chapter.id, newChapterNumber: parsedNumber }).unwrap();
    } catch (error) {
      console.error("Failed to duplicate chapter:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setParams({ ...params, page });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-center text-muted-foreground">Failed to load chapters</p>
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No chapters found</p>
      </div>
    );
  }

  const totalPages = Math.ceil(data.total / data.limit);

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search chapters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </form>

        <div className="flex gap-2 flex-wrap">
          <select
            value={params.unlockType || "all"}
            onChange={(e) => handleFilter("unlockType", e.target.value === "all" ? undefined : e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Types</option>
            <option value="FREE">Free</option>
            <option value="AD">Ad-Supported</option>
            <option value="PREMIUM">Premium</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium">Series</th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  <button
                    onClick={() => handleSort("chapterNumber")}
                    className="flex items-center gap-2 hover:text-foreground transition"
                  >
                    Chapter
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  <button
                    onClick={() => handleSort("views")}
                    className="flex items-center gap-2 hover:text-foreground transition"
                  >
                    <Eye className="h-4 w-4" />
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">Pages</th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  <button
                    onClick={() => handleSort("createdAt")}
                    className="flex items-center gap-2 hover:text-foreground transition"
                  >
                    Created
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((chapter) => (
                <tr key={chapter.id} className="border-b border-border hover:bg-muted/50 transition">
                  <td className="px-4 py-3">
                    <div className="font-medium">{chapter.series?.title || "-"}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium">#{chapter.chapterNumber}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{chapter.title || "-"}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      chapter.unlockType === "FREE" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                      chapter.unlockType === "AD" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                      chapter.unlockType === "PREMIUM" && "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                    )}>
                      {chapter.unlockType || "FREE"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{chapter.views.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">{chapter._count?.pages || 0}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(chapter.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onPreview(chapter)}
                        className="p-2 rounded-lg hover:bg-accent transition"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleTogglePremium(chapter)}
                        className={cn(
                          "p-2 rounded-lg hover:bg-accent transition",
                          chapter.unlockType === "PREMIUM" ? "text-purple-600" : "text-muted-foreground"
                        )}
                        title={chapter.unlockType === "PREMIUM" ? "Make Free" : "Make Premium"}
                      >
                        {chapter.unlockType === "PREMIUM" ? <LockOpen className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDuplicate(chapter)}
                        className="p-2 rounded-lg hover:bg-accent transition"
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(chapter)}
                        className="p-2 rounded-lg hover:bg-accent transition"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(chapter.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {((params.page || 1) - 1) * (params.limit || 10) + 1} to{" "}
              {Math.min((params.page || 1) * (params.limit || 10), data.total)} of {data.total} chapters
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange((params.page || 1) - 1)}
                disabled={(params.page || 1) === 1}
                className="p-2 rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm">
                Page {params.page || 1} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange((params.page || 1) + 1)}
                disabled={(params.page || 1) === totalPages}
                className="p-2 rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
