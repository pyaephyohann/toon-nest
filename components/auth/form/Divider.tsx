/**
 * Divider Component
 * Visual separator with "Or continue with" text
 */

interface DividerProps {
  text?: string;
  className?: string;
}

export function Divider({ text = "Or continue with", className = "" }: DividerProps) {
  return (
    <div className={`relative flex items-center gap-4 ${className}`}>
      <div className="flex-1 h-px bg-gray-700" />
      <span className="text-sm text-gray-500 whitespace-nowrap">
        {text}
      </span>
      <div className="flex-1 h-px bg-gray-700" />
    </div>
  );
}
