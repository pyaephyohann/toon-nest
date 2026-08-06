"use client";

import { useModerateRatingMutation } from "@/store/api/moderationApi";
import { useState } from "react";
import { Search, CheckCircle, Trash2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReviewModeration() {
  const [searchQuery, setSearchQuery] = useState("");
  const [moderateRating] = useModerateRatingMutation();

  const handleModerate = async (ratingId: string, action: "APPROVE" | "DELETE", reason?: string) => {
    try {
      await moderateRating({ id: ratingId, action, reason }).unwrap();
    } catch (error) {
      console.error("Failed to moderate rating:", error);
    }
  };

  // Placeholder data - in production, this would come from a moderation-specific API
  const ratings: any[] = [];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Review Moderation</h3>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search ratings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Rating List */}
      {ratings.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">No ratings to moderate</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ratings.map((rating: any) => (
            <div key={rating.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start gap-3 mb-2">
                {rating.user.avatar ? (
                  <img
                    src={rating.user.avatar}
                    alt={rating.user.username}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-xs font-medium">
                      {rating.user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-sm">{rating.user.username}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < rating.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(rating.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleModerate(rating.id, "APPROVE")}
                  className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 text-sm font-medium hover:bg-green-200 transition flex items-center gap-1"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleModerate(rating.id, "DELETE")}
                  className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 text-sm font-medium hover:bg-red-200 transition flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
