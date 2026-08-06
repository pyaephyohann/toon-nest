/**
 * RememberMe Component
 * Styled checkbox for "Remember me" functionality
 */

import { InputHTMLAttributes, forwardRef } from "react";

interface RememberMeProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
}

export const RememberMe = forwardRef<HTMLInputElement, RememberMeProps>(
  ({ label = "Remember me", containerClassName, className, ...props }, ref) => {
    return (
      <label className={`flex items-center gap-3 cursor-pointer group ${containerClassName}`}>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className="sr-only peer"
            {...props}
          />
          
          <div className={`
            w-5 h-5 rounded-md border-2 border-gray-600
            peer-checked:bg-orange-500 peer-checked:border-orange-500
            transition-all duration-200
            peer-focus:ring-2 peer-focus:ring-orange-500/50 peer-focus:ring-offset-2 peer-focus:ring-offset-gray-900
            ${className}
          `}>
            <svg 
              className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
          {label}
        </span>
      </label>
    );
  }
);

RememberMe.displayName = "RememberMe";
