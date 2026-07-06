"use client";

interface Props {
  name: string;
  readers: string;
  percentage: number;
}

export default function GenreProgress({ name, readers, percentage }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <div>
          <p className="font-medium">{name}</p>

          <p className="text-xs text-muted-foreground">{readers} readers</p>
        </div>

        <span className="text-sm font-semibold">{percentage}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          style={{
            width: `${percentage}%`,
          }}
          className="h-full rounded-full bg-primary"
        />
      </div>
    </div>
  );
}
