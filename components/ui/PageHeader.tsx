import { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  valueColor?: string;
}

interface PageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  stats?: StatItem[];
}

export default function PageHeader({
  title,
  description,
  icon: Icon,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/15",
  stats,
}: PageHeaderProps) {
  return (
    <header className="space-y-8">
      {/* Title Section */}
      <div className="flex items-center gap-5">
        <div className={`flex size-16 items-center justify-center rounded-2xl ${iconBgColor}`}>
          <Icon className={`size-8 ${iconColor}`} />
        </div>

        <div>
          <h1 className="text-5xl font-bold tracking-tight">{title}</h1>

          <p className="mt-2 text-muted-foreground">{description}</p>
        </div>
      </div>

      {/* Stats Section */}
      {stats && stats.length > 0 && (
        <div className="flex flex-wrap items-center gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-card px-5 py-3"
            >
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </p>

              <h3
                className={`mt-1 text-2xl font-bold ${
                  stat.valueColor || "text-foreground"
                }`}
              >
                {stat.value}
              </h3>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
