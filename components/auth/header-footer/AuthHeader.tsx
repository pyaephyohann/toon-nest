/**
 * AuthHeader Component
 * Page header with logo, title, and optional back navigation
 */

import { ReactNode } from "react";
import Link from "next/link";

interface AuthHeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  backHref?: string;
  extra?: ReactNode;
}

export function AuthHeader({ 
  title, 
  subtitle, 
  showBackButton = false, 
  backHref = "/",
  extra 
}: AuthHeaderProps) {
  return (
    <div className="mb-8">
      {showBackButton && (
        <Link 
          href={backHref}
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4 group"
        >
          <svg 
            className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      )}
      
      {title && (
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          {title}
        </h1>
      )}
      
      {subtitle && (
        <p className="text-gray-400 text-sm sm:text-base">
          {subtitle}
        </p>
      )}
      
      {extra && (
        <div className="mt-4">
          {extra}
        </div>
      )}
    </div>
  );
}
