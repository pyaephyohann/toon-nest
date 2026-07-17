"use client";

import CollectionCard from "./CollectionCard";

import { Collection } from "./types";

interface Props {
  items: Collection[];
}

export default function CollectionsSection({ items }: Props) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <h3 className="mb-5 text-xl font-bold">Finished Collections</h3>

      <div className="space-y-4">
        {items.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </section>
  );
}
