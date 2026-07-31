interface TagButtonProps {
  children: string;
  onClick?: () => void;
  variant?: "default" | "primary";
}

export default function TagButton({
  children,
  onClick,
  variant = "default",
}: TagButtonProps) {
  const variants = {
    default:
      "rounded-full border border-border bg-secondary px-4 py-2 text-sm transition hover:border-primary hover:bg-primary hover:text-white",
    primary:
      "rounded-full border border-primary bg-primary px-4 py-2 text-sm text-white transition hover:bg-primary-hover",
  };

  return (
    <button onClick={onClick} className={variants[variant]}>
      {children}
    </button>
  );
}
