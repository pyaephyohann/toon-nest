"use client";

import { useState } from "react";
import { useGetCommentsByChapterIdQuery, useAddCommentMutation, useUpdateCommentMutation, useDeleteCommentMutation, Comment } from "@/store/api";
import { useSession } from "next-auth/react";
import { MessageSquare, Send, Edit2, Trash2, ThumbsUp, Reply } from "lucide-react";

interface Props {
  chapterId: string;
}

export default function CommentsSection({ chapterId }: Props) {
  const { data, isLoading, error, refetch } = useGetCommentsByChapterIdQuery({
    chapterId,
    page: 1,
    limit: 20,
  });
  const [addComment] = useAddCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const { data: session } = useSession();
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment({ chapterId, content: newComment.trim() }).unwrap();
      setNewComment("");
      refetch();
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editContent.trim()) return;

    try {
      await updateComment({ id, content: editContent.trim() }).unwrap();
      setEditingId(null);
      setEditContent("");
      refetch();
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await deleteComment(id).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Comments</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Comments</h2>
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-border bg-card p-8">
          <p className="text-muted-foreground">
            Failed to load comments. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  const comments = data?.items || [];

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <MessageSquare className="h-6 w-6" />
        Comments ({data?.total || 0})
      </h2>

      {/* Comment Form */}
      {session ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full rounded-xl border border-border bg-background p-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px] resize-none"
            maxLength={1000}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {newComment.length}/1000
            </span>
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50 hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
              Post Comment
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-muted-foreground">
            Please <span className="text-primary font-medium">sign in</span> to leave a comment.
          </p>
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-border bg-card p-8">
          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment: Comment) => (
            <div
              key={comment.id}
              className="rounded-xl border border-border bg-card p-4 space-y-3"
            >
              {/* Comment Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {comment.user?.name?.[0] || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{comment.user?.name || "Anonymous"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {session?.user?.id === comment.userId && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(comment)}
                      className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Comment Content */}
              {editingId === comment.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px] resize-none"
                    maxLength={1000}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(comment.id)}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditContent("");
                      }}
                      className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-relaxed">{comment.content}</p>
              )}

              {/* Comment Actions */}
              <div className="flex items-center gap-4 pt-2 border-t border-border">
                <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                  <ThumbsUp className="h-4 w-4" />
                  Like
                </button>
                <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                  <Reply className="h-4 w-4" />
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
