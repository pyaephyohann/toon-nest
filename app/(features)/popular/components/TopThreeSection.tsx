"use client";

import { PopularManga } from "./types";
import TopCard from "./TopCard";

interface Props {
  items: PopularManga[];
}

export default function TopThreeSection({ items }: Props) {
  const first = items.find((manga) => manga.rank === 1);
  const second = items.find((manga) => manga.rank === 2);
  const third = items.find((manga) => manga.rank === 3);

  return (
    <section>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* #2 */}
        {second && (
          <div className="lg:mt-8">
            <TopCard manga={second} />
          </div>
        )}

        {/* #1 */}
        {first && (
          <div className="scale-105">
            <TopCard manga={first} />
          </div>
        )}

        {/* #3 */}
        {third && (
          <div className="lg:mt-5">
            <TopCard manga={third} />
          </div>
        )}
      </div>
    </section>
  );
}
