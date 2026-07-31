import PageHeader from "@/components/ui/PageHeader";
import { BookOpen } from "lucide-react";

export default function GenresHeader() {
  return (
    <PageHeader
      title="Genres"
      description="Find your next favorite series from our collection of 30+ genres."
      icon={BookOpen}
      iconColor="text-primary"
      iconBgColor="bg-primary/15"
    />
  );
}
