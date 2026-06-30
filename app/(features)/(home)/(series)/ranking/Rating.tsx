import { Star } from "lucide-react";

interface Props {
  rating: number;
}

export default function Rating({ rating }: Props) {
  return (
    <div className="flex items-center gap-1">
      <Star className="size-3 fill-yellow-400 text-yellow-400" />
      <span className="text-xs font-medium text-yellow-400">{rating}</span>
    </div>
  );
}
