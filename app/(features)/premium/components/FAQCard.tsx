"use client";

import { ChevronDown, ArrowRight } from "lucide-react";

const faqs = [
  "How does billing work?",
  "Can I cancel anytime?",
  "What payment methods do you accept?",
  "Is my data secure?",
];

export default function FAQCard() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <h3 className="mb-6 text-xl font-bold">Frequently Asked Questions</h3>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <button
            key={faq}
            className="flex w-full items-center justify-between rounded-xl border border-transparent py-2 text-left transition hover:border-primary/30 hover:text-primary"
          >
            <span>{faq}</span>

            <ChevronDown size={18} />
          </button>
        ))}
      </div>

      <button className="mt-6 flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all">
        View More FAQs
        <ArrowRight size={16} />
      </button>
    </section>
  );
}
