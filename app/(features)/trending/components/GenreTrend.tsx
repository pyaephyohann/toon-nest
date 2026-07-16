"use client";

interface Props {
  name: string;
  readers: string;
  percentage: number;
}

export default function GenreTrend({ name, readers, percentage }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold">{name}</h4>

          <p className="text-xs text-muted-foreground">{readers} Readers</p>
        </div>

        <span className="font-semibold text-primary">{percentage}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          style={{
            width: `${percentage}%`,
          }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-violet-400 transition-all duration-700"
        />
      </div>
    </div>
  );
}
