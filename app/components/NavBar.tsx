"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell, Crown, Search } from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "Genres", href: "/genres" },
  { label: "Rankings", href: "/rankings" },
  { label: "Browse", href: "/browse" },
  { label: "Community", href: "/community" },
];

export default function Navbar() {
  const pathname = usePathname();
  const activeIndex = links.findIndex((link) => link.href === pathname);
  const resolvedIndex = activeIndex === -1 ? 0 : activeIndex;

  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const activeEl = linkRefs.current[resolvedIndex];
    if (activeEl) {
      setSliderStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
      });
    }
  }, [resolvedIndex]);

  const inputRef = useRef<HTMLInputElement>(null);

  const isMac = navigator.platform.toUpperCase().includes("MAC");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (isMac && e.metaKey && e.key.toLowerCase() === "k") ||
        (!isMac && e.ctrlKey && e.key.toLowerCase() === "k")
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-card/95 backdrop-blur">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left */}
        <div className="flex items-center gap-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex h-16 items-center gap-2 border-b border-border"
          >
            <Image
              alt="ToonVerse"
              width={200}
              height={200}
              src="/website-logo.png"
            />
          </Link>

          {/* Nav Links */}
          <nav>
            <ul className="relative flex items-center gap-8">
              {/* Sliding underline */}
              <span
                className="absolute -bottom-1.5 h-0.5 bg-primary rounded-full transition-all duration-300 ease-in-out"
                style={{ left: sliderStyle.left, width: sliderStyle.width }}
              />

              {links.map((link, index) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    ref={(el) => {
                      linkRefs.current[index] = el;
                    }}
                    className={`relative pb-1 font-bold transition-colors duration-200 ${
                      resolvedIndex === index
                        ? "text-white"
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for series..."
              className="h-11 w-80 rounded-xl border border-border bg-background pl-10 pr-16 outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-xs text-muted-foreground">
              {isMac ? (
                <>
                  <span>⌘</span>
                  <span>K</span>
                </>
              ) : (
                <>
                  <span>Ctrl</span>
                  <span>K</span>
                </>
              )}
            </div>
          </div>

          <Link href="/premium">
            <button className="cursor-pointer rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white flex justify-between items-center gap-2">
              <Crown color="#FFDF00" absoluteStrokeWidth />
              Get Premium
            </button>
          </Link>

          <button className="cursor-pointer rounded-xl border border-border p-2">
            <Bell className="size-5" />
          </button>

          <Image
            src="/favicon.png"
            alt="avatar"
            width={40}
            height={40}
            className="rounded-full border border-border"
          />
        </div>
      </div>
    </header>
  );
}
