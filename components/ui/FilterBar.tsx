"use client";

import { ChevronDown, LayoutGrid, List, Grid2X2 } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface SortOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  filters?: FilterOption[];
  activeFilter?: string;
  sortOptions?: SortOption[];
  activeSort?: string;
  showViewToggle?: boolean;
  theme?: "primary" | "completed" | "default";
  onFilterChange?: (value: string) => void;
  onSortChange?: (value: string) => void;
  onViewChange?: (view: "grid" | "list") => void;
}

export default function FilterBar({
  filters = [],
  activeFilter = filters[0]?.value,
  sortOptions = [],
  activeSort = sortOptions[0]?.value,
  showViewToggle = true,
  theme = "primary",
  onFilterChange,
  onSortChange,
  onViewChange,
}: FilterBarProps) {
  const themeStyles = {
    primary: {
      active: "border-primary bg-primary text-white shadow-lg shadow-primary/30",
      inactive: "border-border bg-card hover:border-primary hover:text-primary",
      hover: "hover:border-primary",
    },
    completed: {
      active: "border-completed bg-completed text-white shadow-lg shadow-completed/25",
      inactive: "border-border bg-card hover:border-completed hover:text-completed-400",
      hover: "hover:border-emerald-500",
    },
    default: {
      active: "bg-primary text-white",
      inactive: "bg-card hover:bg-secondary",
      hover: "hover:bg-secondary",
    },
  };

  const currentTheme = themeStyles[theme];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* Left - Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onFilterChange?.(filter.value)}
              className={`rounded-xl border px-5 py-2.5 text-sm font-medium transition ${
                activeFilter === filter.value
                  ? currentTheme.active
                  : currentTheme.inactive
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}

      {/* Right - Sort and View Toggle */}
      <div className="flex items-center gap-3">
        {sortOptions.length > 0 && (
          <button
            onClick={() => onSortChange?.(activeSort)}
            className={`flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 transition ${currentTheme.hover}`}
          >
            {sortOptions.find((s) => s.value === activeSort)?.label || "Sort"}
            <ChevronDown size={16} />
          </button>
        )}

        {showViewToggle && (
          <>
            <button
              onClick={() => onViewChange?.("grid")}
              className={`rounded-xl border border-border bg-card p-3 transition ${currentTheme.hover}`}
            >
              {theme === "default" ? <LayoutGrid size={18} /> : <Grid2X2 size={18} />}
            </button>

            <button
              onClick={() => onViewChange?.("list")}
              className={`rounded-xl border border-border bg-card p-3 transition ${currentTheme.hover}`}
            >
              <List size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
