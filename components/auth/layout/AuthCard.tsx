/**
 * AuthCard Component
 * Glassmorphism card container for authentication forms
 */

import { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function AuthCard({ children, title, subtitle, className = "" }: AuthCardProps) {
  return (
    <div className={`relative bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl shadow-black/50 p-8 sm:p-10 ${className}`}>
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {(title || subtitle) && (
          <div className="text-center mb-8">
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
          </div>
        )}
        {children}
      </div>
      
      {/* Subtle border glow */}
      <div className="absolute inset-0 rounded-3xl border border-orange-500/20 pointer-events-none" />
    </div>
  );
}
