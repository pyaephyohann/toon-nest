"use client";

import { useState, useEffect } from "react";
import { Manga } from "@/store/api";
import { useCreateMangaMutation, useUpdateMangaMutation, useGetGenresQuery } from "@/store/api";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import ImageUpload from "./ImageUpload";

interface Props {
  manga?: Manga;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MangaForm({ manga, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    title: manga?.title || "",
    slug: manga?.slug || "",
    description: manga?.description || "",
    coverImage: manga?.coverImage || "",
    bannerImage: manga?.bannerImage || "",
    author: manga?.author || "",
    artist: manga?.artist || "",
    status: manga?.status || "ONGOING",
    verified: manga?.verified || false,
    isFeatured: manga?.isFeatured || false,
    isNew: manga?.isNew || false,
    genreIds: manga?.genres?.map((g: any) => g.genreId) || [],
    tagIds: manga?.tags?.map((t: any) => t.tagId) || [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createManga, { isLoading: isCreating }] = useCreateMangaMutation();
  const [updateManga, { isLoading: isUpdating }] = useUpdateMangaMutation();
  const { data: genresData } = useGetGenresQuery({ limit: 100 });

  const isLoading = isCreating || isUpdating;

  // Auto-generate slug from title
  useEffect(() => {
    if (!manga) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, manga]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      if (manga) {
        await updateManga({ id: manga.id, data: formData }).unwrap();
      } else {
        await createManga(formData).unwrap();
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      if (error.data?.message) {
        setErrors({ form: error.data.message });
      } else {
        setErrors({ form: "Failed to save manga. Please try again." });
      }
    }
  };

  const handleGenreToggle = (genreId: string) => {
    setFormData((prev) => ({
      ...prev,
      genreIds: prev.genreIds.includes(genreId)
        ? prev.genreIds.filter((id) => id !== genreId)
        : [...prev.genreIds, genreId],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card rounded-2xl border border-border w-full max-w-4xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">{manga ? "Edit Manga" : "Create Manga"}</h2>
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
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., One Piece"
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
                  placeholder="e.g., one-piece"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="e.g., Eiichiro Oda"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Artist</label>
                <input
                  type="text"
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  placeholder="e.g., Eiichiro Oda"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isLoading}
                >
                  <option value="ONGOING">Ongoing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="HIATUS">Hiatus</option>
                  <option value="DROPPED">Dropped</option>
                </select>
              </div>
            </div>

            {/* Right Column - Images */}
            <div className="space-y-4">
              <ImageUpload
                value={formData.coverImage}
                onChange={(url) => setFormData({ ...formData, coverImage: url })}
                label="Cover Image *"
                aspectRatio="poster"
              />

              <ImageUpload
                value={formData.bannerImage}
                onChange={(url) => setFormData({ ...formData, bannerImage: url })}
                label="Banner Image"
                aspectRatio="banner"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter manga description..."
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Genres */}
          <div>
            <label className="block text-sm font-medium mb-2">Genres</label>
            <div className="flex flex-wrap gap-2">
              {genresData?.items.map((genre) => (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() => handleGenreToggle(genre.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border transition",
                    formData.genreIds.includes(genre.id)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary/50"
                  )}
                  disabled={isLoading}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.verified}
                onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                disabled={isLoading}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm">Verified (Published)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                disabled={isLoading}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm">Featured</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                disabled={isLoading}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm">New</span>
            </label>
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
              disabled={isLoading || !formData.title || !formData.description || !formData.coverImage}
              className={cn(
                "flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium transition",
                (isLoading || !formData.title || !formData.description || !formData.coverImage) && "opacity-50 cursor-not-allowed"
              )}
            >
              {isLoading ? "Saving..." : manga ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
