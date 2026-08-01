"use client";

import { useState } from "react";
import { useGetRatingSummaryQuery, useGetRatingsBySeriesIdQuery, useAddRatingMutation, useUpdateRatingMutation, useDeleteRatingMutation, Rating } from "@/store/api";
import { useSession } from "next-auth/react";
import { Star, StarHalf } from "lucide-react";

interface Props {
  seriesId: string;
}

export default function RatingsSection({ seriesId }: Props) {
  const { data: summary, isLoading: summaryLoading } = useGetRatingSummaryQuery({ seriesId });
  const { data: ratings, isLoading: ratingsLoading, refetch } = useGetRatingsBySeriesIdQuery({ seriesId });
  const [addRating] = useAddRatingMutation();
  const [updateRating] = useUpdateRatingMutation();
  const [deleteRating] = useDeleteRatingMutation();
  const { data: session } = useSession();
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleRating = async (rating: number) => {
    if (!session?.user?.id) return;

    try {
      await addRating({ seriesId, rating }).unwrap();
      setUserRating(rating);
      refetch();
    } catch (error) {
      console.error("Failed to save rating:", error);
    }
  };

  const handleUpdateRating = async (rating: number) => {
    if (!session?.user?.id) return;

    try {
      // Find user's existing rating
      const existingRating = ratings?.find((r: Rating) => r.userId === session.user.id);
      if (existingRating) {
        await updateRating({ id: existingRating.id, rating }).unwrap();
        setUserRating(rating);
        refetch();
      }
    } catch (error) {
      console.error("Failed to update rating:", error);
    }
  };

  const handleDeleteRating = async () => {
    if (!session?.user?.id) return;

    try {
      const existingRating = ratings?.find((r: Rating) => r.userId === session.user.id);
      if (existingRating) {
        await deleteRating(existingRating.id).unwrap();
        setUserRating(0);
        refetch();
      }
    } catch (error) {
      console.error("Failed to delete rating:", error);
    }
  };

  // Loading state
  if (summaryLoading || ratingsLoading) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Ratings & Reviews</h2>
        <div className="h-48 animate-pulse rounded-2xl bg-muted" />
      </section>
    );
  }

  const userCurrentRating = ratings?.find((r) => r.userId === session?.user?.id);
  const displayRating = userCurrentRating?.rating || userRating;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Ratings & Reviews</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Rating Summary */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-5xl font-bold">{summary?.averageRating.toFixed(1) || "0.0"}</p>
              <p className="text-sm text-muted-foreground">
                {summary?.totalRatings || 0} ratings
              </p>
            </div>
            <div className="flex-1">
              <StarRating rating={summary?.averageRating || 0} readonly />
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="mt-6 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = summary?.distribution[star as keyof typeof summary.distribution] || 0;
              const percentage = summary?.totalRatings ? (count / summary.totalRatings) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-8 text-muted-foreground">{star}★</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-12 text-muted-foreground text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Rating */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-semibold mb-4">Rate this manga</h3>
          {session ? (
            <div className="space-y-4">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => {
                      if (displayRating) {
                        handleUpdateRating(star);
                      } else {
                        handleRating(star);
                      }
                    }}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        (hoverRating || displayRating) >= star
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {displayRating
                  ? `You rated this ${displayRating} stars`
                  : "Click to rate"}
              </p>
              {displayRating > 0 && (
                <button
                  onClick={handleDeleteRating}
                  className="text-sm text-destructive hover:underline"
                >
                  Remove rating
                </button>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">
              Please <span className="text-primary font-medium">sign in</span> to rate this manga.
            </p>
          )}
        </div>
      </div>

      {/* Recent Ratings */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-semibold mb-4">Recent Ratings</h3>
        {ratings && ratings.length > 0 ? (
          <div className="space-y-4">
            {ratings.slice(0, 5).map((rating: Rating) => (
              <div key={rating.id} className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {rating.user?.name?.[0] || "U"}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{rating.user?.name || "Anonymous"}</p>
                    <StarRating rating={rating.rating} readonly size="sm" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No ratings yet.</p>
        )}
      </div>
    </section>
  );
}

function StarRating({ rating, readonly = false, size = "md" }: { rating: number; readonly?: boolean; size?: "sm" | "md" }) {
  const sizeClasses = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFull = rating >= star;
        const isHalf = rating >= star - 0.5 && rating < star;

        if (isFull) {
          return <Star key={star} className={`${sizeClasses} fill-yellow-400 text-yellow-400`} />;
        }
        if (isHalf) {
          return <StarHalf key={star} className={`${sizeClasses} fill-yellow-400 text-yellow-400`} />;
        }
        return <Star key={star} className={`${sizeClasses} text-muted-foreground`} />;
      })}
    </div>
  );
}
