/**
 * FormError Component
 * Form-level error display with validation errors
 */

import { ReactNode } from "react";

interface FormErrorProps {
  errors?: string[];
  onClear?: () => void;
  className?: string;
}

export function FormError({ errors = [], onClear, className = "" }: FormErrorProps) {
  if (errors.length === 0) return null;

  return (
    <div className={`p-4 rounded-xl bg-red-500/10 border border-red-500/50 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          
          <div className="flex-1">
            <p className="text-sm font-medium text-red-400 mb-1">
              {errors.length === 1 ? "Error" : "Errors"}
            </p>
            <ul className="text-sm text-red-300 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        </div>
        
        {onClear && (
          <button
            onClick={onClear}
            className="flex-shrink-0 text-red-400 hover:text-red-300 transition-colors"
            aria-label="Clear errors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
