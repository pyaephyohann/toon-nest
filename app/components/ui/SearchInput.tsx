"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useGetMangaSuggestionsQuery } from "@/store/api";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import Link from "next/link";
import Image from "next/image";

interface Props {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
}

export default function SearchInput({ placeholder = "Search...", value, onChange, onClear }: Props) {
  const [localValue, setLocalValue] = useState(value || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebouncedSearch(localValue, 300);
  const { data: suggestions, isLoading } = useGetMangaSuggestionsQuery(
    { search: debouncedSearch, limit: 5 },
    { skip: debouncedSearch.length < 2 }
  );

  // Update local value when external value changes
  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value);
    }
  }, [value]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    setShowSuggestions(true);
    onChange?.(newValue);
  };

  const handleClear = () => {
    setLocalValue("");
    setShowSuggestions(false);
    onChange?.("");
    onClear?.();
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (slug: string) => {
    setShowSuggestions(false);
    setLocalValue("");
    onChange?.("");
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={handleChange}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-border bg-background pl-10 pr-10 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {localValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {showSuggestions && debouncedSearch.length >= 2 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-background shadow-lg">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading suggestions...
            </div>
          ) : suggestions && suggestions.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <Link
                  key={suggestion.id}
                  href={`/series/${suggestion.slug}`}
                  onClick={() => handleSuggestionClick(suggestion.slug)}
                  className="flex items-center gap-3 p-3 hover:bg-accent transition-colors"
                >
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={suggestion.coverImage}
                      alt={suggestion.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{suggestion.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{suggestion.slug}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
