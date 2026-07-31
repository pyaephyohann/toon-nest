import { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  icon: LucideIcon;
  title: string;
  value: string;
  iconColor?: string;
  bgColor?: string;
}

export default function SidebarItem({
  icon: Icon,
  title,
  value,
  iconColor = "text-primary",
  bgColor = "bg-background",
}: SidebarItemProps) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-secondary/40 p-3">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bgColor} ${iconColor}`}>
          <Icon size={18} />
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{title}</p>

          <p className="font-medium">{value}</p>
        </div>
      </div>
    </div>
  );
}
