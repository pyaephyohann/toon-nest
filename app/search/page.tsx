"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SearchInput from "../components/ui/SearchInput";
import SearchFilters from "../components/ui/SearchFilters";
import SearchResults from "../components/ui/SearchResults";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("q") || "";
  
  const [search, setSearch] = useState(initialSearch);
  const [genreId, setGenreId] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [year, setYear] = useState<number | undefined>();
  const [orderByField, setOrderByField] = useState<string>("updatedAt");
  const [orderByDirection, setOrderByDirection] = useState<string>("desc");
  const [page, setPage] = useState(1);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to page 1 on search change
  };

  const handleFilterChange = () => {
    setPage(1); // Reset to page 1 on filter change
  };

  const handleSortChange = (field: string, direction: string) => {
    setOrderByField(field);
    setOrderByDirection(direction);
    setPage(1);
  };

  return (
    <div className="container-width space-y-8 py-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Search</h1>
        <SearchInput
          placeholder="Search by title, author, or artist..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchFilters
          genreId={genreId}
          status={status}
          year={year}
          onGenreChange={(value: string | undefined) => {
            setGenreId(value);
            handleFilterChange();
          }}
          onStatusChange={(value: string | undefined) => {
            setStatus(value);
            handleFilterChange();
          }}
          onYearChange={(value: number | undefined) => {
            setYear(value);
            handleFilterChange();
          }}
        />

        {/* Sort Options */}
        <div className="flex gap-2">
          <select
            value={`${orderByField}-${orderByDirection}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split("-");
              handleSortChange(field, direction);
            }}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="updatedAt-desc">Recently Updated</option>
            <option value="createdAt-desc">Latest</option>
            <option value="views-desc">Popular</option>
            <option value="averageRating-desc">Rating</option>
            <option value="createdAt-asc">Oldest</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <SearchResults
        search={search || undefined}
        genreId={genreId}
        status={status}
        year={year}
        orderByField={orderByField}
        orderByDirection={orderByDirection}
        page={page}
        onPageChange={setPage}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-width py-8">Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
