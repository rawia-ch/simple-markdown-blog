"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    name: string | null;
    image: string | null;
  };
}

export default function CommentsList({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/posts/${postId}/comments`);
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  if (loading) return <p className="text-sm text-gray-500 font-sans">Loading comments...</p>;
  if (comments.length === 0) return <p className="text-sm text-gray-500 font-sans">No comments yet.</p>;

  return (
    <motion.div
      className="space-y-3 mt-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {comments.map((comment) => (
        <motion.div
          key={comment.id}
          className="flex items-start gap-3 bg-white/60 p-3 rounded-lg shadow-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={comment.author?.image ?? "/default-avatar.png"} />
            <AvatarFallback>{comment.author?.name?.[0] ?? "?"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{comment.author?.name ?? "Anonymous"}</p>
            <p className="text-xs text-gray-500 font-sans">
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
