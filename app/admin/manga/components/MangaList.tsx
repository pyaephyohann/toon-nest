"use client";

import { Manga } from "@/store/api";
import { GetMangaListParams } from "@/store/api/mangaApi";
import { useGetMangaListQuery, useDeleteMangaMutation, useUpdateMangaMutation } from "@/store/api";
import { useState } from "react";
import { Search, ArrowUpDown, Edit, Trash2, ChevronLeft, ChevronRight, Eye, Star, BookOpen, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onEdit: (manga: Manga) => void;
}

export default function MangaList({ onEdit }: Props) {
  const [params, setParams] = useState<GetMangaListParams>({
    page: 1,
    limit: 10,
    orderByField: "createdAt",
    orderByDirection: "desc",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useGetMangaListQuery(params);
  const [deleteManga] = useDeleteMangaMutation();
  const [updateManga] = useUpdateMangaMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams({ ...params, search: searchQuery, page: 1 });
  };

  const handleSort = (field: string) => {
    if (params.orderByField === field) {
      setParams({ ...params, orderByDirection: params.orderByDirection === "asc" ? "desc" : "asc" });
    } else {
      setParams({ ...params, orderByField: field, orderByDirection: "asc" });
    }
  };

  const handleFilter = (filter: keyof GetMangaListParams, value: boolean | undefined) => {
    setParams({ ...params, [filter]: value, page: 1 });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this manga? This will also delete all associated chapters.")) {
      try {
        await deleteManga(id).unwrap();
      } catch (error) {
        console.error("Failed to delete manga:", error);
      }
    }
  };

  const handleToggleVerified = async (manga: Manga) => {
    try {
      await updateManga({ id: manga.id, data: { verified: !manga.verified } }).unwrap();
    } catch (error) {
      console.error("Failed to toggle verified status:", error);
    }
  };

  const handleToggleFeatured = async (manga: Manga) => {
    try {
      await updateManga({ id: manga.id, data: { isFeatured: !manga.isFeatured } }).unwrap();
    } catch (error) {
      console.error("Failed to toggle featured status:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setParams({ ...params, page });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-center text-muted-foreground">Failed to load manga</p>
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No manga found</p>
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
              placeholder="Search manga..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </form>

        <div className="flex gap-2 flex-wrap">
          <select
            value={params.status || "all"}
            onChange={(e) => setParams({ ...params, status: e.target.value === "all" ? undefined : e.target.value, page: 1 })}
            className="px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="HIATUS">Hiatus</option>
            <option value="DROPPED">Dropped</option>
          </select>

          <select
            value={params.verified === undefined ? "all" : params.verified.toString()}
            onChange={(e) => handleFilter("verified", e.target.value === "all" ? undefined : e.target.value === "true")}
            className="px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Verified</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>

          <select
            value={params.isFeatured === undefined ? "all" : params.isFeatured.toString()}
            onChange={(e) => handleFilter("isFeatured", e.target.value === "all" ? undefined : e.target.value === "true")}
            className="px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Featured</option>
            <option value="true">Featured</option>
            <option value="false">Not Featured</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium">Cover</th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  <button
                    onClick={() => handleSort("title")}
                    className="flex items-center gap-2 hover:text-foreground transition"
                  >
                    Title
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">Author</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  <button
                    onClick={() => handleSort("views")}
                    className="flex items-center gap-2 hover:text-foreground transition"
                  >
                    <Eye className="h-4 w-4" />
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  <button
                    onClick={() => handleSort("averageRating")}
                    className="flex items-center gap-2 hover:text-foreground transition"
                  >
                    <Star className="h-4 w-4" />
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  <button
                    onClick={() => handleSort("totalChapters")}
                    className="flex items-center gap-2 hover:text-foreground transition"
                  >
                    <BookOpen className="h-4 w-4" />
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">Verified</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((manga) => (
                <tr key={manga.id} className="border-b border-border hover:bg-muted/50 transition">
                  <td className="px-4 py-3">
                    <img
                      src={manga.coverImage}
                      alt={manga.title}
                      className="h-12 w-8 rounded object-cover"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{manga.title}</div>
                    <div className="text-xs text-muted-foreground">{manga.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{manga.author || "-"}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      manga.status === "ONGOING" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                      manga.status === "COMPLETED" && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                      manga.status === "HIATUS" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                      manga.status === "DROPPED" && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    )}>
                      {manga.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{manga.views.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">{manga.averageRating.toFixed(1)}</td>
                  <td className="px-4 py-3 text-sm">{manga.totalChapters}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleVerified(manga)}
                      className={cn(
                        "p-1 rounded transition",
                        manga.verified ? "text-green-600 hover:bg-green-100" : "text-gray-400 hover:bg-gray-100"
                      )}
                      title={manga.verified ? "Verified" : "Unverified"}
                    >
                      {manga.verified ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(manga)}
                        className="p-2 rounded-lg hover:bg-accent transition"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(manga.id)}
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
              {Math.min((params.page || 1) * (params.limit || 10), data.total)} of {data.total} manga
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
