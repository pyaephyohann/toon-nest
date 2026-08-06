/**
 * FormSuccess Component
 * Success message display with auto-dismiss
 */

import { useEffect, useState } from "react";

interface FormSuccessProps {
  message: string;
  autoDismiss?: boolean;
  dismissAfter?: number;
  onDismiss?: () => void;
  className?: string;
}

export function FormSuccess({
  message,
  autoDismiss = true,
  dismissAfter = 5000,
  onDismiss,
  className = "",
}: FormSuccessProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, dismissAfter);

      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissAfter, onDismiss]);

  if (!visible) return null;

  return (
    <div className={`p-4 rounded-xl bg-green-500/10 border border-green-500/50 ${className}`}>
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        
        <p className="text-sm text-green-400 flex-1">
          {message}
        </p>
        
        <button
          onClick={() => {
            setVisible(false);
            onDismiss?.();
          }}
          className="flex-shrink-0 text-green-400 hover:text-green-300 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
