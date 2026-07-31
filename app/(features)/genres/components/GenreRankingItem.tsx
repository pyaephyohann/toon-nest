"use client";

import ProgressBar from "@/components/ui/ProgressBar";
import { getRankColor } from "@/lib/utils";

interface Props {
  rank: number;
  name: string;
  total: number;
  progress: number;
  color: string;
}

export default function GenreRankingItem({
  rank,
  name,
  total,
  progress,
  color,
}: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold ${getRankColor(rank)}`}
          >
            {rank}
          </span>

          <div>
            <p className="font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">
              {total.toLocaleString()} Series
            </p>
          </div>
        </div>

        <span className="text-sm font-semibold" style={{ color }}>
          {progress}%
        </span>
      </div>

      <ProgressBar
        progress={progress}
        showLabel={false}
        size="md"
        customColor={color}
      />
    </div>
  );
}
