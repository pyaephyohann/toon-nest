import PageHeader from "@/components/ui/PageHeader";
import { Bookmark } from "lucide-react";

export default function BookmarkHeader() {
  return (
    <PageHeader
      title="Bookmarks"
      description="Your saved series to read later."
      icon={Bookmark}
      iconColor="text-primary"
      iconBgColor="bg-primary/15"
    />
  );
}
