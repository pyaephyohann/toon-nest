import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  iconColor?: string;
  iconBgColor?: string;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
}: StatCardProps) {
  return (
    <div className="flex items-center gap-4">
      <div className={`rounded-xl ${iconBgColor} p-3`}>
        <Icon className={iconColor} />
      </div>

      <div>
        <p className="text-sm text-muted-foreground">{label}</p>

        <h4 className="text-xl font-bold">{value}</h4>
      </div>
    </div>
  );
}
