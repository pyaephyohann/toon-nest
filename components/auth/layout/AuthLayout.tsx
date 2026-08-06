/**
 * AuthLayout Component
 * Main layout wrapper for authentication pages
 * Features dark theme, orange accents, glassmorphism, and animated background
 */

import { ReactNode } from "react";
import { BackgroundGlow } from "../visual/BackgroundGlow";
import { FloatingShapes } from "../visual/FloatingShapes";

interface AuthLayoutProps {
  children: ReactNode;
  showIllustration?: boolean;
}

export function AuthLayout({ children, showIllustration = true }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background effects */}
      <BackgroundGlow />
      <FloatingShapes />
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
        {/* Illustration section (desktop) */}
        {showIllustration && (
          <div className="hidden lg:block flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full animate-pulse" />
              <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
                {/* Placeholder for illustration */}
                <div className="aspect-square flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/30">
                      <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Toon Nest</h3>
                    <p className="text-gray-400">Your favorite manga, all in one place</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Form section */}
        <div className="flex-1 w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
