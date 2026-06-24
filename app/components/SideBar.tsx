// components/layout/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Flame,
  Clock3,
  Bookmark,
  Trophy,
  CheckCheck,
} from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: House },
  { label: "Updates", href: "/updates", icon: Clock3 },
  { label: "Popular", href: "/popular", icon: Flame },
  { label: "Trending", href: "/trending", icon: Trophy },
  { label: "Completed", href: "/completed", icon: CheckCheck },
];

const libraryItems = [
  { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { label: "History", href: "/history", icon: Clock3 },
];

function NavLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-md font-bold transition-colors duration-150 ${
        isActive
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      <Icon className={`size-5 ${isActive ? "text-primary" : ""}`} />
      {label}
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="flex w-64 flex-col border-r border-border bg-card">
      {/* Nav */}
      <nav className="flex-1 px-4 py-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink {...item} />
            </li>
          ))}
        </ul>

        <div className="my-3 border-t border-border" />

        <ul>
          {libraryItems.map((item) => (
            <li key={item.label}>
              <NavLink {...item} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Ads Card */}
      <div className="p-4">
        <div className="rounded-2xl bg-secondary p-4">
          <h3 className="font-semibold">
            Watch Ads
            <br />
            Unlock Chapters
          </h3>
          <p className="mt-2 text-xs text-muted-foreground">
            Watch a short ad to unlock premium chapters.
          </p>
          <button className="mt-4 w-full rounded-xl bg-primary py-2 text-white">
            Watch Ad
          </button>
        </div>
      </div>

      {/* Premium Card */}
      <div className="p-4 pt-0">
        <div className="rounded-2xl bg-primary/30 p-4">
          <h3 className="font-semibold">Go Premium</h3>
          <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
            <li>✓ No ads</li>
            <li>✓ Early access</li>
            <li>✓ High quality</li>
          </ul>
          <button className="mt-4 w-full rounded-xl bg-primary py-2 text-white">
            View Plans
          </button>
        </div>
      </div>
    </aside>
  );
}
