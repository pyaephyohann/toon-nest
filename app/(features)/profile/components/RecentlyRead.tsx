"use client";

import { useGetHistoryQuery } from "@/store/api";
import { Clock } from "lucide-react";
import Link from "next/link";

interface Props {
  userId: string;
}

export default function RecentlyRead({ userId }: Props) {
  const { data: historyData, isLoading } = useGetHistoryQuery({ page: 1, limit: 5 });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-semibold mb-4">Recently Read</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  const history = historyData?.items || [];

  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recently Read
        </h3>
        <p className="text-muted-foreground">No reading history yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Recently Read
      </h3>
      <div className="space-y-3">
        {history.map((item: any) => (
          <Link
            key={item.id}
            href={`/series/${item.series.slug}/chapter/${parseFloat(item.chapter.chapterNumber.toString())}`}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition hover:border-primary hover:bg-accent"
          >
            <img
              src={item.series.coverImage}
              alt={item.series.title}
              className="h-12 w-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.series.title}</p>
              <p className="text-sm text-muted-foreground">
                Chapter {item.chapter.chapterNumber}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(item.updatedAt).toLocaleDateString()}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
