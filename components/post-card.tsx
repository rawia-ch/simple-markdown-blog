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
  tags?: string[]; // Ajout de la propriété tags comme tableau optionnel
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
    : post.content.slice(0, 200) + (post.content.length > 200 ? "..." : "");

  // Rendu des tags
  const renderTags = () =>
    post.tags?.length
      ? post.tags.map((tag, i) => (
        <span
          key={i}
          className="inline-block bg-white text-orange-700 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
        >
          #{tag}
        </span>
      ))
      : null;

  return (
    <Card className="rounded-xl shadow-lg bg-gradient-to-r from-amber-600 to-orange-300 text-white">
      <CardHeader>
        {post.imageUrl && (
          <div className="pt-4">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg sm:h-72 md:h-80 lg:h-96"
            />
          </div>
        )}

        <CardTitle className="text-xl mt-4">
          {showFullContent ? (
            post.title
          ) : (
            <Link href={`/posts/${post.id}`} className="hover:underline">
              {post.title}
            </Link>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <MarkdownRenderer content={content} />
        {renderTags()} {/* Affichage des tags sous le contenu */}
        {post.expiresOn && (
          <p className={`text-sm mt-2 ${new Date(post.expiresOn) < new Date() ? "text-red-500" : "text-green-500"}`}>
            Expires On: {new Date(post.expiresOn).toLocaleDateString()}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={post.author.image || ""} />
              <AvatarFallback>{post.author.name?.[0] || "A"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={!session}
            className="flex items-center space-x-1"
          >
            <Heart
              className={`h-4 w-4 ${likeLoading
                  ? "animate-pulse"
                  : liked
                    ? "fill-red-500 text-red-500"
                    : ""
                }`}
            />
            <span>{likeCount}</span>
          </Button>

          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4" />
            <span>{post._count.comments}</span>
          </Button>
        </div>

        {isAdmin && (
          <div className="flex gap-2">
            {onDelete && <DeleteButton postId={post.id} onDeleted={onDelete} />}
            <Button
              variant="outline"
              className="text-green-600 border-green-500 hover:bg-green-50"
              asChild
            >
              <Link href={`/posts/${post.id}/edit`} className="flex items-center space-x-1 font-sans">
                <Pencil className="h-4 w-4" />
                <span>Update</span>
              </Link>
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}