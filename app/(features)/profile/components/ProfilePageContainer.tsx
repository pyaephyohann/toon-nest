"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import ReadingStatistics from "./ReadingStatistics";
import FavoriteGenres from "./FavoriteGenres";
import RecentlyRead from "./RecentlyRead";
import FavoriteManga from "./FavoriteManga";
import AccountSettings from "./AccountSettings";

export default function ProfilePageContainer() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;

  return (
    <div className="space-y-6">
      <ProfileHeader userId={userId} />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <ReadingStatistics userId={userId} />
        <FavoriteGenres userId={userId} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentlyRead userId={userId} />
        <FavoriteManga userId={userId} />
      </div>

      <AccountSettings userId={userId} />
    </div>
  );
}
