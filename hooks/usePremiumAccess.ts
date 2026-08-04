/**
 * Premium Access Hooks
 * React hooks for checking premium access status
 */

import { useSession } from "next-auth/react";
import { useGetSubscriptionsQuery } from "@/store/api";
import { useState, useEffect } from "react";

export type AccessStatus = "FREE" | "LOCKED" | "UNLOCKED";

/**
 * Check if current user has premium access
 */
export function usePremiumAccess() {
  const { data: session, status } = useSession();
  const { data: subscriptions, isLoading } = useGetSubscriptionsQuery();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (subscriptions && subscriptions.length > 0) {
      const activeSubscription = subscriptions.find((sub) => {
        const expiresAt = new Date(sub.expiresAt);
        return expiresAt > new Date();
      });
      setIsPremium(!!activeSubscription);
    } else {
      setIsPremium(false);
    }
  }, [subscriptions]);

  return {
    isPremium,
    isLoading: status === "loading" || isLoading,
    isAuthenticated: !!session?.user,
    userId: session?.user?.id || null,
  };
}

/**
 * Check if user can access a specific chapter
 */
export function useChapterAccess(chapter: any) {
  const { isPremium, isAuthenticated, isLoading } = usePremiumAccess();
  const [accessStatus, setAccessStatus] = useState<AccessStatus>("FREE");
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    if (!chapter) {
      setAccessStatus("FREE");
      setCanAccess(true);
      return;
    }

    // Free chapters are accessible to all
    if (chapter.unlockType === "FREE") {
      setAccessStatus("FREE");
      setCanAccess(true);
      return;
    }

    // AD chapters are accessible to all
    if (chapter.unlockType === "AD") {
      setAccessStatus("FREE");
      setCanAccess(true);
      return;
    }

    // PREMIUM chapters require premium
    if (chapter.unlockType === "PREMIUM") {
      if (!isAuthenticated) {
        setAccessStatus("LOCKED");
        setCanAccess(false);
        return;
      }

      if (isPremium) {
        setAccessStatus("UNLOCKED");
        setCanAccess(true);
        return;
      }

      // Check for individual chapter unlock
      if (chapter.accessStatus === "UNLOCKED") {
        setAccessStatus("UNLOCKED");
        setCanAccess(true);
        return;
      }

      setAccessStatus("LOCKED");
      setCanAccess(false);
      return;
    }

    setAccessStatus("FREE");
    setCanAccess(true);
  }, [chapter, isPremium, isAuthenticated, chapter?.accessStatus]);

  return {
    canAccess,
    accessStatus,
    isLoading,
    isPremium,
    isAuthenticated,
  };
}

/**
 * Check if user can access content based on chapter's access info
 */
export function useCanAccessChapter(chapter: any) {
  const { canAccess, accessStatus, isLoading } = useChapterAccess(chapter);

  return {
    canAccess,
    accessStatus,
    isLoading,
    isLocked: accessStatus === "LOCKED",
    isFree: accessStatus === "FREE",
    isUnlocked: accessStatus === "UNLOCKED",
  };
}
