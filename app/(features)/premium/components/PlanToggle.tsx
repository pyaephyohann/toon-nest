"use client";

import { useState } from "react";

export default function PlanToggle() {
  const [active, setActive] = useState("Yearly");

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>

        <p className="mt-2 text-muted-foreground">
          Pick the plan that fits your reading style.
        </p>
      </div>

      <div className="flex rounded-2xl border border-border bg-card p-1">
        {["Monthly", "Yearly"].map((item) => (
          <button
            key={item}
            onClick={() => setActive(item)}
            className={`rounded-xl px-6 py-2 text-sm font-medium transition ${
              active === item
                ? "bg-primary text-white shadow-lg shadow-primary/30"
                : "hover:text-primary"
            }`}
          >
            {item}

            {item === "Yearly" && (
              <span className="ml-2 rounded-full bg-pink-500 px-2 py-0.5 text-[10px] text-white">
                -20%
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
