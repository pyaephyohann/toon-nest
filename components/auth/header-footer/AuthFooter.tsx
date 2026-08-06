/**
 * AuthFooter Component
 * Page footer with links and copyright
 */

import Link from "next/link";

interface AuthFooterProps {
  showTerms?: boolean;
  showPrivacy?: boolean;
  showHelp?: boolean;
  customLinks?: Array<{ label: string; href: string }>;
  copyright?: string;
}

export function AuthFooter({
  showTerms = true,
  showPrivacy = true,
  showHelp = true,
  customLinks,
  copyright = `© ${new Date().getFullYear()} Toon Nest. All rights reserved.`
}: AuthFooterProps) {
  return (
    <div className="mt-8 text-center text-sm text-gray-500">
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        {showTerms && (
          <Link 
            href="/terms" 
            className="hover:text-orange-400 transition-colors"
          >
            Terms of Service
          </Link>
        )}
        {showPrivacy && (
          <Link 
            href="/privacy" 
            className="hover:text-orange-400 transition-colors"
          >
            Privacy Policy
          </Link>
        )}
        {showHelp && (
          <Link 
            href="/help" 
            className="hover:text-orange-400 transition-colors"
          >
            Help
          </Link>
        )}
        {customLinks?.map((link, index) => (
          <Link 
            key={index}
            href={link.href} 
            className="hover:text-orange-400 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
      
      <p className="text-gray-600">
        {copyright}
      </p>
    </div>
  );
}
