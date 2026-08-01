"use client";

import { useGetGenresQuery } from "@/store/api";

interface Props {
  genreId?: string;
  status?: string;
  year?: number;
  onGenreChange: (genreId: string | undefined) => void;
  onStatusChange: (status: string | undefined) => void;
  onYearChange: (year: number | undefined) => void;
}

export default function SearchFilters({
  genreId,
  status,
  year,
  onGenreChange,
  onStatusChange,
  onYearChange,
}: Props) {
  const { data: genresData } = useGetGenresQuery({ limit: 100 });

  const genres = genresData?.items || [];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="flex flex-wrap gap-3">
      {/* Genre Filter */}
      <select
        value={genreId || ""}
        onChange={(e) => onGenreChange(e.target.value || undefined)}
        className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>

      {/* Status Filter */}
      <select
        value={status || ""}
        onChange={(e) => onStatusChange(e.target.value || undefined)}
        className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="">All Status</option>
        <option value="ONGOING">Ongoing</option>
        <option value="COMPLETED">Completed</option>
        <option value="HIATUS">Hiatus</option>
        <option value="CANCELLED">Cancelled</option>
      </select>

      {/* Year Filter */}
      <select
        value={year || ""}
        onChange={(e) => onYearChange(e.target.value ? parseInt(e.target.value) : undefined)}
        className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="">All Years</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
