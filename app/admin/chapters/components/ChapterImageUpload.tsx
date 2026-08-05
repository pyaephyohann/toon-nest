"use client";

import { useState } from "react";
import { Upload, X, Image as ImageIcon, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
}

export default function ChapterImageUpload({ images, onChange, label }: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length === 0) {
      alert("Please select image files");
      return;
    }

    const oversizedFiles = validFiles.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert("Some files are too large. Max file size: 5MB");
      return;
    }

    const readers = validFiles.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((base64Images) => {
      onChange([...images, ...base64Images]);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {label && <label className="block text-sm font-medium">{label}</label>}

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        )}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files) handleFileSelect(e.target.files);
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground text-center">
          Drag and drop images, or click to select
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Max file size: 5MB per image
        </p>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border border-border"
            >
              <img
                src={image}
                alt={`Page ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleMove(index, Math.max(0, index - 1))}
                  disabled={index === 0}
                  className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  title="Move left"
                >
                  ←
                </button>
                <button
                  onClick={() => handleMove(index, Math.min(images.length - 1, index + 1))}
                  disabled={index === images.length - 1}
                  className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  title="Move right"
                >
                  →
                </button>
                <button
                  onClick={() => handleRemove(index)}
                  className="p-2 rounded-full bg-red-500/80 text-white hover:bg-red-500 transition"
                  title="Remove"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Page Count */}
      {images.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {images.length} page{images.length !== 1 ? "s" : ""} uploaded
        </p>
      )}
    </div>
  );
}
