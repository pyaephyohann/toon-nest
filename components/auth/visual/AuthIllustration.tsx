/**
 * AuthIllustration Component
 * Decorative illustration for authentication pages
 */

interface AuthIllustrationProps {
  variant?: "login" | "register" | "forgot-password";
  className?: string;
}

export function AuthIllustration({ variant = "login", className = "" }: AuthIllustrationProps) {
  const illustrations = {
    login: (
      <div className="relative">
        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/30 animate-pulse">
          <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Toon Nest</h3>
        <p className="text-gray-400">Your favorite manga, all in one place</p>
      </div>
    ),
    register: (
      <div className="relative">
        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/30 animate-pulse">
          <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Join Toon Nest</h3>
        <p className="text-gray-400">Create your account and start reading</p>
      </div>
    ),
    "forgot-password": (
      <div className="relative">
        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/30 animate-pulse">
          <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Reset Password</h3>
        <p className="text-gray-400">We'll send you a reset link</p>
      </div>
    ),
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full animate-pulse" />
      <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
        {illustrations[variant]}
      </div>
    </div>
  );
}
