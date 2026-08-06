"use client";

import { useState } from "react";
import { useChangePasswordMutation, useDeleteUserMutation } from "@/store/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Settings, Key, Trash2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface Props {
  userId: string;
}

export default function AccountSettings({ userId }: Props) {
  const [changePassword] = useChangePasswordMutation();
  const [deleteUser] = useDeleteUserMutation();
  const { data: session } = useSession();
  const router = useRouter();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const isOwnProfile = session?.user?.id === userId;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await changePassword({
        id: userId,
        data: {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
      }).unwrap();
      alert("Password changed successfully");
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Failed to change password:", error);
      alert("Failed to change password. Please check your current password.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteUser({ id: userId }).unwrap();
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("Failed to delete account. Please try again.");
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (!isOwnProfile) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Settings className="h-5 w-5" />
        Account Settings
      </h3>

      <div className="space-y-4">
        {/* Change Password */}
        <div className="border-b border-border pb-4">
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="flex items-center gap-2 text-sm font-medium hover:text-primary"
          >
            <Key className="h-4 w-4" />
            Change Password
          </button>

          {showPasswordForm && (
            <form onSubmit={handlePasswordChange} className="mt-4 space-y-3">
              <input
                type="password"
                placeholder="Current password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                required
              />
              <input
                type="password"
                placeholder="New password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                required
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Logout */}
        <div className="border-b border-border pb-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium hover:text-primary"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        {/* Delete Account */}
        <div>
          <button
            onClick={handleDeleteAccount}
            className="flex items-center gap-2 text-sm font-medium text-destructive hover:text-destructive/80"
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </button>
          <p className="mt-2 text-xs text-muted-foreground">
            This action cannot be undone. All your data will be permanently deleted.
          </p>
        </div>
      </div>
    </div>
  );
}
