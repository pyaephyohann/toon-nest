"use client";

import { Search, SlidersHorizontal } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  showFilters?: boolean;
  onFilterClick?: () => void;
  value?: string;
  onChange?: (value: string) => void;
}

export default function SearchInput({
  placeholder = "Search...",
  showFilters = true,
  onFilterClick,
  value,
  onChange,
}: SearchInputProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />

        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 outline-none transition focus:border-primary"
        />
      </div>

      {showFilters && (
        <button
          onClick={onFilterClick}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 transition hover:border-primary hover:bg-primary/10"
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>
      )}
    </div>
  );
}
