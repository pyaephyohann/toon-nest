import { Star } from "lucide-react";

interface RatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

export default function Rating({ rating, size = "sm" }: RatingProps) {
  const iconSizes = {
    sm: "size-3",
    md: "size-4",
    lg: "size-5",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className="flex items-center gap-1">
      <Star className={`${iconSizes[size]} fill-yellow-400 text-yellow-400`} />
      <span className={`${textSizes[size]} font-medium text-yellow-400`}>
        {rating}
      </span>
    </div>
  );
}
