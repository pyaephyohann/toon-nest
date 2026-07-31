"use client";

import HallOfFameCard from "./HallOfFameCard";
import { hallOfFameData } from "./data";

export default function HallOfFame() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">🏆 Hall of Fame</h2>

        <p className="mt-2 text-muted-foreground">
          Timeless masterpieces loved by readers around the world.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {hallOfFameData.map((item) => (
          <HallOfFameCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
