"use client";

import { useState, useEffect } from "react";
import { User } from "@/store/api/userApi";
import { useUpdateUserAdminMutation, useChangeUserRoleMutation } from "@/store/api/userApi";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  user?: User;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UserForm({ user, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    displayName: user?.displayName || "",
    bio: user?.bio || "",
    role: user?.role || "USER",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [updateUserAdmin, { isLoading: isUpdating }] = useUpdateUserAdminMutation();
  const [changeUserRole, { isLoading: isChangingRole }] = useChangeUserRoleMutation();

  const isLoading = isUpdating || isChangingRole;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      if (user) {
        // Update user profile
        await updateUserAdmin({
          id: user.id,
          data: {
            username: formData.username,
            displayName: formData.displayName,
            bio: formData.bio,
            role: formData.role,
            suspendedAt: user.suspendedAt,
          },
        }).unwrap();

        // Change role if different
        if (formData.role !== user.role) {
          await changeUserRole({
            id: user.id,
            role: formData.role,
          }).unwrap();
        }

        onSuccess();
        onClose();
      }
    } catch (error: any) {
      if (error.data?.message) {
        setErrors({ form: error.data.message });
      } else {
        setErrors({ form: "Failed to update user. Please try again." });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card rounded-2xl border border-border w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">{user ? "Edit User" : "User Details"}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent transition"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.form && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {errors.form}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="username"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Display Name</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="Display Name"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="User bio..."
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
              {user?.role === "ADMIN" && formData.role !== "ADMIN" && (
                <p className="mt-1 text-xs text-destructive">
                  Warning: You are changing an admin to user role
                </p>
              )}
            </div>

            {user?.suspendedAt && (
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-sm">
                <strong>Suspended:</strong> This user was suspended on {new Date(user.suspendedAt).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-accent transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !user}
              className={cn(
                "flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium transition",
                (isLoading || !user) && "opacity-50 cursor-not-allowed"
              )}
            >
              {isLoading ? "Saving..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
