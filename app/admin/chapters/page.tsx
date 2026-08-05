"use client";

import { useState } from "react";
import { useMeQuery } from "@/store/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Chapter } from "@/store/api/chapterApi";
import AdminSidebar from "../components/AdminSidebar";
import ChapterList from "./components/ChapterList";
import ChapterForm from "./components/ChapterForm";
import ChapterPreview from "./components/ChapterPreview";
import { Plus } from "lucide-react";

export default function AdminChapters() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useMeQuery();
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [previewChapterId, setPreviewChapterId] = useState<string | null>(null);

  useEffect(() => {
    if (!userLoading && user && user.role !== "ADMIN") {
      router.push("/");
    }
  }, [user, userLoading, router]);

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  const handleEdit = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedChapter(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedChapter(null);
  };

  const handleFormSuccess = () => {
    // The RTK Query cache will be invalidated automatically
  };

  const handlePreview = (chapter: Chapter) => {
    setPreviewChapterId(chapter.id);
  };

  const handlePreviewClose = () => {
    setPreviewChapterId(null);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar username={user.username} avatar={user.avatar} />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Chapters</h1>
              <p className="text-muted-foreground">
                Manage chapters across all manga series
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition"
            >
              <Plus className="h-5 w-5" />
              Create Chapter
            </button>
          </div>

          {/* Chapter List */}
          <ChapterList onEdit={handleEdit} onPreview={handlePreview} />

          {/* Form Modal */}
          {isFormOpen && (
            <ChapterForm
              chapter={selectedChapter || undefined}
              onClose={handleFormClose}
              onSuccess={handleFormSuccess}
            />
          )}

          {/* Preview Modal */}
          {previewChapterId && (
            <ChapterPreview
              chapterId={previewChapterId}
              onClose={handlePreviewClose}
            />
          )}
        </div>
      </main>
    </div>
  );
}
