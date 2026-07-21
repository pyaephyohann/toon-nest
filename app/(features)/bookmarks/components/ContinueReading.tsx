"use client";

import Image from "next/image";

const continueReading = [
  {
    title: "Solo Necromancer",
    image: "/bookmarks/solo-necromancer.jpg",
    progress: 85,
  },
  {
    title: "TBATE",
    image: "/bookmarks/tbate.jpg",
    progress: 71,
  },
  {
    title: "ORV",
    image: "/bookmarks/orv.jpg",
    progress: 60,
  },
];

export default function ContinueReading() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <h3 className="mb-5 text-xl font-bold">Continue Reading</h3>

      <div className="space-y-4">
        {continueReading.map((item) => (
          <div key={item.title} className="group flex gap-4">
            <div className="relative h-16 w-12 overflow-hidden rounded-lg">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition group-hover:scale-105"
              />
            </div>

            <div className="flex-1">
              <h4 className="truncate font-semibold">{item.title}</h4>

              <div className="mt-3 h-2 rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${item.progress}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                {item.progress}% Complete
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
