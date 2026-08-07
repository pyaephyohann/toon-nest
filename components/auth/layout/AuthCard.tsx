/**
 * AuthCard Component
 * Glassmorphism card container for authentication forms
 * Includes Framer Motion animations for smooth entry with reduced motion support
 */

"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface AuthCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function AuthCard({ children, title, subtitle, className = "" }: AuthCardProps) {
  const prefersReducedMotion = useReducedMotion();

  // Animation variants with reduced motion support
  const cardVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.5,
      },
    },
  };

  return (
    <motion.div
      className={`relative bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl shadow-black/50 p-8 sm:p-10 ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      role="region"
      aria-labelledby={title ? "auth-card-title" : undefined}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {(title || subtitle) && (
          <div className="text-center mb-8">
            {title && (
              <h1 id="auth-card-title" className="text-3xl sm:text-4xl font-bold text-white mb-2">
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
    </motion.div>
  );
}
