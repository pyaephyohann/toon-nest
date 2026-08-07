/**
 * StatusPage Component
 * Reusable status page component for success, error, warning, and info states
 * Supports Framer Motion animations and optional background
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BackgroundGlow, FloatingShapes } from "@/components/auth";

export type StatusType = "success" | "error" | "warning" | "info";

export interface StatusPageProps {
  type: StatusType;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  showBackground?: boolean;
  className?: string;
}

// Default icons for each status type
const DefaultIcons: Record<StatusType, React.ReactNode> = {
  success: (
    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

// Color schemes for each status type
const ColorSchemes: Record<StatusType, { bg: string; icon: string }> = {
  success: { bg: "bg-green-500/20", icon: "text-green-400" },
  error: { bg: "bg-red-500/20", icon: "text-red-400" },
  warning: { bg: "bg-yellow-500/20", icon: "text-yellow-400" },
  info: { bg: "bg-blue-500/20", icon: "text-blue-400" },
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function StatusPage({
  type,
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  showBackground = false,
  className = "",
}: StatusPageProps) {
  const colors = ColorSchemes[type];
  const defaultIcon = DefaultIcons[type];

  const Background = showBackground ? (
    <>
      <BackgroundGlow />
      <FloatingShapes />
    </>
  ) : null;

  const renderButton = (action: NonNullable<typeof primaryAction>, isPrimary: boolean) => {
    const baseClasses = "px-6 py-3 rounded-xl font-medium transition-all duration-200";
    const primaryClasses = `${baseClasses} bg-orange-500 hover:bg-orange-600 text-white`;
    const secondaryClasses = `${baseClasses} bg-gray-700 hover:bg-gray-600 text-white`;

    if (action.href) {
      return (
        <Link href={action.href} className={isPrimary ? primaryClasses : secondaryClasses}>
          {action.label}
        </Link>
      );
    }

    return (
      <button
        onClick={action.onClick}
        className={isPrimary ? primaryClasses : secondaryClasses}
      >
        {action.label}
      </button>
    );
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${className}`}>
      {Background}

      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl"
          variants={itemVariants}
        >
          {/* Icon */}
          <motion.div
            className={`w-24 h-24 mx-auto ${colors.bg} rounded-full flex items-center justify-center mb-6`}
            variants={itemVariants}
          >
            <div className={colors.icon}>
              {icon || defaultIcon}
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-3xl font-bold text-white text-center mb-4"
            variants={itemVariants}
          >
            {title}
          </motion.h1>

          {/* Description */}
          {description && (
            <motion.p
              className="text-gray-400 text-center mb-8"
              variants={itemVariants}
            >
              {description}
            </motion.p>
          )}

          {/* Actions */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            variants={itemVariants}
          >
            {primaryAction && renderButton(primaryAction, true)}
            {secondaryAction && renderButton(secondaryAction, false)}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
