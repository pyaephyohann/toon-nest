"use client";

import { useState, useEffect } from "react";
import { Chapter } from "@/store/api/chapterApi";
import { useCreateChapterMutation, useUpdateChapterMutation, useUploadChapterPagesMutation } from "@/store/api/chapterApi";
import { useGetMangaListQuery } from "@/store/api/mangaApi";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import ChapterImageUpload from "./ChapterImageUpload";

interface Props {
  chapter?: Chapter;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ChapterForm({ chapter, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    seriesId: chapter?.seriesId || "",
    chapterNumber: chapter?.chapterNumber || 1,
    title: chapter?.title || "",
    slug: chapter?.slug || "",
    unlockType: chapter?.unlockType || "FREE",
  });
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createChapter, { isLoading: isCreating }] = useCreateChapterMutation();
  const [updateChapter, { isLoading: isUpdating }] = useUpdateChapterMutation();
  const [uploadPages, { isLoading: isUploading }] = useUploadChapterPagesMutation();
  const { data: mangaData } = useGetMangaListQuery({ limit: 100 });

  const isLoading = isCreating || isUpdating || isUploading;

  // Auto-generate slug from chapter number
  useEffect(() => {
    if (!chapter) {
      setFormData((prev) => ({ ...prev, slug: `${prev.chapterNumber}` }));
    }
  }, [formData.chapterNumber, chapter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      let chapterId: string;

      if (chapter) {
        const updated = await updateChapter({ id: chapter.id, data: formData }).unwrap();
        chapterId = updated.id;
      } else {
        const created = await createChapter(formData).unwrap();
        chapterId = created.id;
      }

      // Upload images if provided
      if (images.length > 0) {
        await uploadPages({ id: chapterId, pages: images.map((url) => ({ imageUrl: url })) }).unwrap();
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      if (error.data?.message) {
        setErrors({ form: error.data.message });
      } else {
        setErrors({ form: "Failed to save chapter. Please try again." });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card rounded-2xl border border-border w-full max-w-4xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">{chapter ? "Edit Chapter" : "Create Chapter"}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent transition"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.form && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {errors.form}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Series *</label>
                <select
                  value={formData.seriesId}
                  onChange={(e) => setFormData({ ...formData, seriesId: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isLoading || !!chapter}
                  required
                >
                  <option value="">Select a series</option>
                  {mangaData?.items.map((manga) => (
                    <option key={manga.id} value={manga.id}>
                      {manga.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Chapter Number *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.chapterNumber}
                  onChange={(e) => setFormData({ ...formData, chapterNumber: parseFloat(e.target.value) })}
                  placeholder="e.g., 1, 1.5, 2"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isLoading || !!chapter}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., The Beginning"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g., 1"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Unlock Type</label>
                <select
                  value={formData.unlockType}
                  onChange={(e) => setFormData({ ...formData, unlockType: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isLoading}
                >
                  <option value="FREE">Free</option>
                  <option value="AD">Ad-Supported</option>
                  <option value="PREMIUM">Premium</option>
                </select>
              </div>
            </div>

            {/* Right Column - Images */}
            <div className="space-y-4">
              <ChapterImageUpload
                images={images}
                onChange={setImages}
                label="Chapter Pages *"
              />
              <p className="text-xs text-muted-foreground">
                Upload chapter pages in order. Use the arrow buttons to reorder pages.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-accent transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.seriesId || !formData.chapterNumber || (!chapter && images.length === 0)}
              className={cn(
                "flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium transition",
                (isLoading || !formData.seriesId || !formData.chapterNumber || (!chapter && images.length === 0)) && "opacity-50 cursor-not-allowed"
              )}
            >
              {isLoading ? "Saving..." : chapter ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
