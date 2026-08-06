/**
 * TermsCheckbox Component
 * Checkbox for terms of service and privacy policy agreement
 */

import { InputHTMLAttributes, forwardRef } from "react";
import Link from "next/link";

interface TermsCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  termsHref?: string;
  privacyHref?: string;
  error?: string;
  containerClassName?: string;
}

export const TermsCheckbox = forwardRef<HTMLInputElement, TermsCheckboxProps>(
  ({ 
    termsHref = "/terms", 
    privacyHref = "/privacy", 
    error,
    containerClassName,
    className,
    ...props 
  }, ref) => {
    return (
      <div className={containerClassName}>
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5">
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
              ${error ? 'border-red-500 peer-checked:border-red-500 peer-checked:bg-red-500' : ''}
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
            I agree to the{" "}
            <Link 
              href={termsHref} 
              className="text-orange-400 hover:text-orange-300 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </Link>
            {" "}and{" "}
            <Link 
              href={privacyHref} 
              className="text-orange-400 hover:text-orange-300 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </Link>
          </span>
        </label>
        
        {error && (
          <p className="mt-1 text-sm text-red-400 ml-8">
            {error}
          </p>
        )}
      </div>
    );
  }
);

TermsCheckbox.displayName = "TermsCheckbox";
