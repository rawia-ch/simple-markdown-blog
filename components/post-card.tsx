"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { Button } from "./ui/button";
import { Heart, MessageCircle, Pencil } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import MarkdownRenderer from "./markdown-renderer";
import DeleteButton from "./delete-button";
import { motion } from "framer-motion";

interface Post {
  imageUrl: string;
  id: string;
  title: string;
  content: string;
  slug: string;
  published: boolean;
  createdAt: string;
  expiresOn: Date | null;
  author: {
    name: string | null;
    image: string | null;
  };
  _count: {
    comments: number;
    likes: number;
  };
  tags?: string[];
}

export default function PostCard({
  post,
  showFullContent = false,
  onDelete,
}: {
  post: Post;
  showFullContent?: boolean;
  onDelete?: (id: string) => void;
}) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [likeLoading, setLikeLoading] = useState(true);

  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!session?.user?.id) {
        setLikeLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/posts/${post.id}/like-status`);
        if (response.ok) {
          const data = await response.json();
          setLiked(data.liked);
        }
      } catch (error) {
        console.error("Failed to fetch like status:", error);
      } finally {
        setLikeLoading(false);
      }
    };

    fetchLikeStatus();
  }, [post.id, session?.user?.id]);

  const handleLike = async () => {
    if (!session) return;

    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
      });
      const data = await response.json();
      setLiked(data.liked);
      setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const content = showFullContent
    ? post.content
    : post.content.slice(0, 100) + (post.content.length > 100 ? "..." : "");

  const renderTags = () => (
    <div className="flex flex-wrap gap-1 mt-3">
      {post.tags?.map((tag, i) => (
        <span
          key={i}
          className="inline-block bg-white text-orange-700 text-xs font-semibold px-2 py-0.5 rounded"
        >
          #{tag}
        </span>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full max-w-sm mx-auto"
    >
      <Card className="rounded-xl shadow-md bg-gradient-to-r from-amber-500 to-orange-200 text-gray-800 hover:shadow-lg transition-shadow flex flex-col h-full">
        <CardHeader className="p-4 pb-2">
          {post.imageUrl && (
            <div className="w-full h-40 overflow-hidden rounded-t-lg">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <CardTitle className="text-lg font-bold mt-3">
            {showFullContent ? (
              post.title
            ) : (
              <Link
                href={`/posts/${post.slug}`}
                className="hover:underline text-gray-900"
              >
                {post.title}
              </Link>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 pt-0 flex-grow">
          <MarkdownRenderer content={content} />

          {renderTags()}

          {post.expiresOn && (
            <div className="mt-4">
              <p
                className={`text-xs ${
                  new Date(post.expiresOn) < new Date()
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                Expires On: {new Date(post.expiresOn).toLocaleDateString()}
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-2 ">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center space-x-2">
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src={post.author?.image ?? "/default-avatar.png"}
                />
                <AvatarFallback>
                  {post.author?.name?.[0] ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-medium">
                  {post.author?.name ?? "Unknown"}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={!session}
                className="flex items-center space-x-1 text-gray-700 p-1 h-8"
              >
                <Heart
                  className={`h-3 w-3 ${
                    likeLoading
                      ? "animate-pulse"
                      : liked
                      ? "fill-red-500 text-red-500"
                      : ""
                  }`}
                />
                <span className="text-xs">{likeCount}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1 text-gray-700 p-1 h-8"
              >
                <MessageCircle className="h-3 w-3" />
                <span className="text-xs">{post._count.comments}</span>
              </Button>
            </div>
          </div>
        </CardFooter>

        {isAdmin && showFullContent && (
          <div className="flex justify-end gap-2 p-3 border-t border-orange-300">
            {onDelete && <DeleteButton postId={post.id} onDeleted={onDelete} />}
            <Button
              variant="outline"
              className="text-green-600 border-green-500 hover:bg-green-50 text-xs px-2 py-1"
              asChild
            >
              <Link
                href={`/posts/edit/${post.id}`}
                className="flex items-center space-x-1 font-sans"
              >
                <Pencil className="h-4 w-4 mr-2" />
                <span>Update</span>
              </Link>
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
