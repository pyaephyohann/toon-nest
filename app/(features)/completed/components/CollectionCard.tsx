"use client";

import Image from "next/image";

import { Collection } from "./types";

interface Props {
  collection: Collection;
}

export default function CollectionCard({ collection }: Props) {
  return (
    <button className="group flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-3 transition hover:border-completed hover:bg-secondary">
      <div className="relative h-16 w-16 overflow-hidden rounded-xl">
        <Image
          src={collection.image}
          alt={collection.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-110"
        />
      </div>

      <div className="text-left">
        <h4 className="font-semibold">{collection.title}</h4>

        <p className="text-sm text-muted-foreground">
          {collection.series} Series
        </p>
      </div>
    </button>
  );
}
