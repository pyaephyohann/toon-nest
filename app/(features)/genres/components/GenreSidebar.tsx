"use client";

import {
  Flame,
  Sparkles,
  Heart,
  Ghost,
  Laugh,
  Sword,
  School,
} from "lucide-react";

import SidebarItem from "@/components/ui/SidebarItem";

const items = [
  {
    icon: Flame,
    title: "Trending",
    value: "Action",
    iconColor: "text-red-400",
  },
  {
    icon: Sparkles,
    title: "Most Growing",
    value: "Fantasy",
    iconColor: "text-violet-400",
  },
  {
    icon: Heart,
    title: "Most Loved",
    value: "Romance",
    iconColor: "text-pink-400",
  },
  {
    icon: Sword,
    title: "Best Adventure",
    value: "Adventure",
    iconColor: "text-emerald-400",
  },
  {
    icon: Laugh,
    title: "Funny",
    value: "Comedy",
    iconColor: "text-yellow-400",
  },
  {
    icon: Ghost,
    title: "Scariest",
    value: "Horror",
    iconColor: "text-red-600",
  },
  {
    icon: School,
    title: "Student Life",
    value: "School",
    iconColor: "text-cyan-400",
  },
];

export default function GenreSidebar() {
  return (
    <aside className="rounded-3xl border border-border bg-card p-6">
      <h2 className="text-xl font-bold">Genre Highlights</h2>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <SidebarItem
            key={item.title}
            icon={item.icon}
            title={item.title}
            value={item.value}
            iconColor={item.iconColor}
          />
        ))}
      </div>
    </aside>
  );
}
