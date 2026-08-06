"use client";

import { useModerateCommentMutation } from "@/store/api/moderationApi";
import { useState } from "react";
import { Search, CheckCircle, Trash2, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CommentModeration() {
  const [searchQuery, setSearchQuery] = useState("");
  const [moderateComment] = useModerateCommentMutation();

  const handleModerate = async (commentId: string, action: "APPROVE" | "DELETE" | "HIDE", reason?: string) => {
    try {
      await moderateComment({ id: commentId, action, reason }).unwrap();
    } catch (error) {
      console.error("Failed to moderate comment:", error);
    }
  };

  // Placeholder data - in production, this would come from a moderation-specific API
  const comments: any[] = [];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Comment Moderation</h3>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search comments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Comment List */}
      {comments.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">No comments to moderate</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment: any) => (
            <div key={comment.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start gap-3 mb-2">
                {comment.user.avatar ? (
                  <img
                    src={comment.user.avatar}
                    alt={comment.user.username}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-xs font-medium">
                      {comment.user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-sm">{comment.user.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-sm mb-3">{comment.content}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleModerate(comment.id, "APPROVE")}
                  className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 text-sm font-medium hover:bg-green-200 transition flex items-center gap-1"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleModerate(comment.id, "HIDE")}
                  className="px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200 text-sm font-medium hover:bg-yellow-200 transition flex items-center gap-1"
                >
                  <EyeOff className="h-4 w-4" />
                  Hide
                </button>
                <button
                  onClick={() => handleModerate(comment.id, "DELETE")}
                  className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 text-sm font-medium hover:bg-red-200 transition flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
