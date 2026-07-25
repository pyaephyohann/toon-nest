interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  size?: "sm" | "md";
}

export default function Badge({ 
  children, 
  variant = "default",
  size = "sm" 
}: BadgeProps) {
  const variants = {
    default: "bg-secondary text-foreground",
    primary: "bg-primary text-white",
    success: "bg-emerald-500 text-white",
    warning: "bg-yellow-500 text-white",
    danger: "bg-red-500 text-white",
  };

  const sizes = {
    sm: "px-2 py-1 text-[10px]",
    md: "px-3 py-1 text-xs",
  };

  return (
    <span className={`rounded-md font-semibold ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}
