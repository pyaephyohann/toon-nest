"use client";

import { useState } from "react";
import { useMeQuery } from "@/store/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User } from "@/store/api/userApi";
import AdminSidebar from "../components/AdminSidebar";
import UserList from "./components/UserList";
import UserForm from "./components/UserForm";
import UserDetail from "./components/UserDetail";

export default function AdminUsers() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useMeQuery();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [detailUserId, setDetailUserId] = useState<string | null>(null);

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

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleViewDetails = (user: User) => {
    setDetailUserId(user.id);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  const handleFormSuccess = () => {
    // The RTK Query cache will be invalidated automatically
  };

  const handleDetailClose = () => {
    setDetailUserId(null);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar username={user.username} avatar={user.avatar} />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Users</h1>
            <p className="text-muted-foreground">
              Manage user accounts, roles, and access
            </p>
          </div>

          {/* User List */}
          <UserList onEdit={handleEdit} onViewDetails={handleViewDetails} />

          {/* Form Modal */}
          {isFormOpen && (
            <UserForm
              user={selectedUser || undefined}
              onClose={handleFormClose}
              onSuccess={handleFormSuccess}
            />
          )}

          {/* Detail Modal */}
          {detailUserId && selectedUser && (
            <UserDetail
              user={selectedUser}
              onClose={handleDetailClose}
            />
          )}
        </div>
      </main>
    </div>
  );
}
