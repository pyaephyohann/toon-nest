"use client";

import { useState } from "react";
import { useMeQuery } from "@/store/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Manga } from "@/store/api";
import AdminSidebar from "../components/AdminSidebar";
import MangaList from "./components/MangaList";
import MangaForm from "./components/MangaForm";
import { Plus } from "lucide-react";

export default function AdminManga() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useMeQuery();
  const [selectedManga, setSelectedManga] = useState<Manga | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (!userLoading && user && user.role !== "ADMIN") {
      router.push("/");
    }
  }, [user, userLoading, router]);

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  const handleEdit = (manga: Manga) => {
    setSelectedManga(manga);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedManga(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedManga(null);
  };

  const handleFormSuccess = () => {
    // The RTK Query cache will be invalidated automatically
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar username={user.username} avatar={user.avatar} />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Manga</h1>
              <p className="text-muted-foreground">
                Manage manga series in your library
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition"
            >
              <Plus className="h-5 w-5" />
              Create Manga
            </button>
          </div>

          {/* Manga List */}
          <MangaList onEdit={handleEdit} />

          {/* Form Modal */}
          {isFormOpen && (
            <MangaForm
              manga={selectedManga || undefined}
              onClose={handleFormClose}
              onSuccess={handleFormSuccess}
            />
          )}
        </div>
      </main>
    </div>
  );
}
