"use client";

import { useState } from "react";
import { useGetUserByIdQuery, useUpdateUserMutation, useUploadAvatarMutation } from "@/store/api";
import { useSession } from "next-auth/react";
import { Camera, Edit2, Check, X } from "lucide-react";

interface Props {
  userId: string;
}

export default function ProfileHeader({ userId }: Props) {
  const { data: user, isLoading } = useGetUserByIdQuery(userId);
  const [updateUser] = useUpdateUserMutation();
  const [uploadAvatar] = useUploadAvatarMutation();
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ displayName: "", bio: "" });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 animate-pulse rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = session?.user?.id === userId;

  const handleEdit = () => {
    setEditData({
      displayName: user?.displayName || "",
      bio: user?.bio || "",
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateUser({ id: userId, data: editData }).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ displayName: "", bio: "" });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <div className="relative group">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-primary">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </span>
            )}
          </div>
          {isOwnProfile && (
            <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition">
              <Camera className="h-6 w-6 text-white" />
            </button>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1">
          {isEditing && isOwnProfile ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editData.displayName}
                onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
                placeholder="Display name"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                maxLength={50}
              />
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                placeholder="Bio"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none min-h-[80px] resize-none"
                maxLength={500}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <Check className="h-4 w-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">
                  {user?.displayName || user?.username}
                </h2>
                {isOwnProfile && (
                  <button
                    onClick={handleEdit}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="text-muted-foreground">@{user?.username}</p>
              {user?.bio && (
                <p className="mt-2 text-sm">{user.bio}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
