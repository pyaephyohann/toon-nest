interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function ProgressBar({ 
  progress, 
  showLabel = true,
  size = "md" 
}: ProgressBarProps) {
  const heights = {
    sm: "h-1",
    md: "h-1.5",
    lg: "h-2",
  };

  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{progress}%</span>
        </div>
      )}

      <div className={`overflow-hidden rounded-full bg-secondary ${heights[size]}`}>
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}
