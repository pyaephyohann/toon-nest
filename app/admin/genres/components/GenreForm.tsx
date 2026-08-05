"use client";

import { useState, useEffect } from "react";
import { Genre } from "@/store/api";
import { useCreateGenreMutation, useUpdateGenreMutation } from "@/store/api";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  genre?: Genre;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GenreForm({ genre, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    name: genre?.name || "",
    slug: genre?.slug || "",
    icon: genre?.icon || "",
    color: genre?.color || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createGenre, { isLoading: isCreating }] = useCreateGenreMutation();
  const [updateGenre, { isLoading: isUpdating }] = useUpdateGenreMutation();

  const isLoading = isCreating || isUpdating;

  // Auto-generate slug from name
  useEffect(() => {
    if (!genre) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.name, genre]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      if (genre) {
        await updateGenre({ id: genre.id, data: formData }).unwrap();
      } else {
        await createGenre(formData).unwrap();
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      if (error.data?.message) {
        setErrors({ form: error.data.message });
      } else {
        setErrors({ form: "Failed to save genre. Please try again." });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">{genre ? "Edit Genre" : "Create Genre"}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent transition"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.form && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {errors.form}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Action"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g., action"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
            {errors.slug && <p className="text-sm text-destructive mt-1">{errors.slug}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Icon URL</label>
            <input
              type="url"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="https://example.com/icon.png"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
            {errors.icon && <p className="text-sm text-destructive mt-1">{errors.icon}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <div className="flex gap-3">
              <input
                type="color"
                value={formData.color || "#000000"}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="h-10 w-10 rounded-lg cursor-pointer"
                disabled={isLoading}
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="#FF5733"
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
            </div>
            {errors.color && <p className="text-sm text-destructive mt-1">{errors.color}</p>}
          </div>

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
              disabled={isLoading || !formData.name}
              className={cn(
                "flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium transition",
                (isLoading || !formData.name) && "opacity-50 cursor-not-allowed"
              )}
            >
              {isLoading ? "Saving..." : genre ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
