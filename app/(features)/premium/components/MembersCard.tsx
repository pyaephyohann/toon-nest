"use client";

import Image from "next/image";

const avatars = [
  "/avatars/1.jpg",
  "/avatars/2.jpg",
  "/avatars/3.jpg",
  "/avatars/4.jpg",
  "/avatars/5.jpg",
  "/avatars/6.jpg",
];

export default function MembersCard() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <h3 className="text-xl font-bold">Premium Members</h3>

      <h1 className="mt-5 text-5xl font-extrabold text-primary">245K+</h1>

      <p className="mt-2 text-sm text-muted-foreground">
        Happy Premium members and growing!
      </p>

      <div className="mt-6 flex">
        {avatars.map((avatar, index) => (
          <div
            key={avatar}
            className="-ml-2 first:ml-0"
            style={{ zIndex: avatars.length - index }}
          >
            <Image
              src={avatar}
              alt=""
              width={42}
              height={42}
              className="rounded-full border-2 border-card object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
