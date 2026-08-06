/**
 * SubmitButton Component
 * Styled submit button with loading and disabled states
 */

import { ButtonHTMLAttributes, forwardRef } from "react";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary" | "outline";
}

export const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ 
    isLoading = false, 
    loadingText = "Loading...", 
    variant = "primary",
    className,
    children,
    disabled,
    ...props 
  }, ref) => {
    const baseStyles = "w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2";
    
    const variantStyles = {
      primary: "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg shadow-orange-500/25",
      secondary: "bg-gray-700 text-white hover:bg-gray-600 focus:ring-2 focus:ring-gray-500/50 focus:ring-offset-2 focus:ring-offset-gray-900",
      outline: "border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-gray-900",
    };

    const disabledStyles = "opacity-50 cursor-not-allowed";

    return (
      <button
        ref={ref}
        type="submit"
        disabled={isLoading || disabled}
        className={`${baseStyles} ${variantStyles[variant]} ${(isLoading || disabled) ? disabledStyles : ""} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {loadingText}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

SubmitButton.displayName = "SubmitButton";
