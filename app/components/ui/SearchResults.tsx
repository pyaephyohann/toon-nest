"use client";

import { useGetMangaListQuery } from "@/store/api";
import { Manga } from "@/store/api";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface Props {
  search?: string;
  genreId?: string;
  status?: string;
  year?: number;
  orderByField?: string;
  orderByDirection?: string;
  page?: number;
  onPageChange?: (page: number) => void;
}

export default function SearchResults({
  search,
  genreId,
  status,
  year,
  orderByField,
  orderByDirection,
  page = 1,
  onPageChange,
}: Props) {
  const { data, isLoading, error } = useGetMangaListQuery({
    page,
    limit: 20,
    search,
    genreId,
    status,
    year,
    orderByField,
    orderByDirection,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-border bg-card p-8">
        <p className="text-muted-foreground">
          Failed to load results. Please try again later.
        </p>
      </div>
    );
  }

  // Empty state
  if (!data || data.items.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-border bg-card p-8">
        <div className="text-center">
          <p className="text-muted-foreground">No results found.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(data.total / data.limit);

  return (
    <div className="space-y-6">
      {/* Results Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.items.map((manga: Manga) => (
          <MangaCard key={manga.id} manga={manga} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onPageChange?.(page - 1)}
            disabled={page === 1}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm disabled:opacity-50 hover:border-primary hover:bg-accent"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange?.(page + 1)}
            disabled={page === totalPages}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm disabled:opacity-50 hover:border-primary hover:bg-accent"
          >
            Next
          </button>
        </div>
      )}

      {/* Results Count */}
      <p className="text-center text-sm text-muted-foreground">
        Showing {data.items.length} of {data.total} results
      </p>
    </div>
  );
}

function MangaCard({ manga }: { manga: Manga }) {
  return (
    <Link
      href={`/series/${manga.slug}`}
      className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary hover:shadow-lg"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={manga.coverImage}
          alt={manga.title}
          fill
          className="object-cover transition group-hover:scale-105"
        />
        {manga.isNew && (
          <span className="absolute right-2 top-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            NEW
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold line-clamp-2 group-hover:text-primary">{manga.title}</h3>
        <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>{manga.totalChapters} chapters</span>
          <span>{manga.averageRating.toFixed(1)} ⭐</span>
        </div>
      </div>
    </Link>
  );
}
