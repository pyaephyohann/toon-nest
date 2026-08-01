"use client";

type TimePeriod = "daily" | "weekly" | "monthly" | "all";

const tabs = [
  { label: "Today", value: "daily" as TimePeriod },
  { label: "This Week", value: "weekly" as TimePeriod },
  { label: "This Month", value: "monthly" as TimePeriod },
  { label: "All Time", value: "all" as TimePeriod },
];

interface Props {
  timePeriod: TimePeriod;
  onTimePeriodChange: (period: TimePeriod) => void;
}

export default function RankingTabs({ timePeriod, onTimePeriodChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTimePeriodChange(tab.value)}
          className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
            timePeriod === tab.value
              ? "bg-primary text-white shadow-lg shadow-primary/30"
              : "bg-secondary hover:bg-secondary/80"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
