"use client";

import { Genre } from "@/store/api";
import { GetGenresParams } from "@/store/api/genreApi";
import { useGetGenresQuery, useDeleteGenreMutation } from "@/store/api";
import { useState } from "react";
import { Search, Filter, ArrowUpDown, MoreVertical, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onEdit: (genre: Genre) => void;
}

export default function GenreList({ onEdit }: Props) {
  const [params, setParams] = useState<GetGenresParams>({
    page: 1,
    limit: 10,
    sortBy: "name",
    sortOrder: "asc",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useGetGenresQuery(params);
  const [deleteGenre] = useDeleteGenreMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams({ ...params, search: searchQuery, page: 1 });
  };

  const handleSort = (sortBy: "name" | "createdAt" | "seriesCount") => {
    if (params.sortBy === sortBy) {
      setParams({ ...params, sortOrder: params.sortOrder === "asc" ? "desc" : "asc" });
    } else {
      setParams({ ...params, sortBy, sortOrder: "asc" });
    }
  };

  const handleFilter = (filter: "hasIcon" | "hasColor", value: boolean | undefined) => {
    setParams({ ...params, [filter]: value, page: 1 });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this genre?")) {
      try {
        await deleteGenre(id).unwrap();
      } catch (error) {
        console.error("Failed to delete genre:", error);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setParams({ ...params, page });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-center text-muted-foreground">Failed to load genres</p>
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No genres found</p>
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
              placeholder="Search genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </form>

        <div className="flex gap-2">
          <select
            value={params.hasIcon === undefined ? "all" : params.hasIcon.toString()}
            onChange={(e) => handleFilter("hasIcon", e.target.value === "all" ? undefined : e.target.value === "true")}
            className="px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Icons</option>
            <option value="true">Has Icon</option>
            <option value="false">No Icon</option>
          </select>

          <select
            value={params.hasColor === undefined ? "all" : params.hasColor.toString()}
            onChange={(e) => handleFilter("hasColor", e.target.value === "all" ? undefined : e.target.value === "true")}
            className="px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Colors</option>
            <option value="true">Has Color</option>
            <option value="false">No Color</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-2 hover:text-foreground transition"
                  >
                    Name
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">Slug</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Icon</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Color</th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  <button
                    onClick={() => handleSort("seriesCount")}
                    className="flex items-center gap-2 hover:text-foreground transition"
                  >
                    Series Count
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
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
              {data.items.map((genre) => (
                <tr key={genre.id} className="border-b border-border hover:bg-muted/50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {genre.icon && (
                        <img
                          src={genre.icon}
                          alt={genre.name}
                          className="h-8 w-8 rounded-lg object-cover"
                        />
                      )}
                      <span className="font-medium">{genre.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{genre.slug}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {genre.icon ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    {genre.color && (
                      <div className="flex items-center gap-2">
                        <div
                          className="h-6 w-6 rounded"
                          style={{ backgroundColor: genre.color }}
                        />
                        <span className="text-sm text-muted-foreground">{genre.color}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{genre._count?.series || 0}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(genre.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(genre)}
                        className="p-2 rounded-lg hover:bg-accent transition"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(genre.id)}
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
              {Math.min((params.page || 1) * (params.limit || 10), data.total)} of {data.total} genres
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
