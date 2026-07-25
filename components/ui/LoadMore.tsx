import { ChevronDown } from "lucide-react";

interface LoadMoreProps {
  onClick?: () => void;
  variant?: "default" | "primary" | "completed";
}

export default function LoadMore({ onClick, variant = "default" }: LoadMoreProps) {
  const variants = {
    default: "border-border bg-card hover:border-primary hover:text-primary",
    primary: "border-border bg-card hover:border-primary hover:text-primary",
    completed: "border-border bg-card hover:border-emerald-500 hover:bg-emerald-500/10",
  };

  return (
    <div className="flex justify-center pt-4">
      <button
        onClick={onClick}
        className={`group flex items-center gap-2 rounded-xl border px-8 py-3 font-medium transition-all duration-300 ${variants[variant]}`}
      >
        Load More
        <ChevronDown
          size={18}
          className="transition-transform group-hover:translate-y-1"
        />
      </button>
    </div>
  );
}
