"use client";

import CommentSection from "@/components/comment-section";
import DeleteButton from "@/components/delete-button";
import PostCard from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  imageUrl?: string;
  author: {
    name: string | null;
    image: string | null;
  };
  _count: {
    comments: number;
    likes: number;
  };
}

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    if (params.id) {
      fetchPost(params.id as string);
    }
  }, [params.id]);

  const fetchPost = async (id: string) => {
    try {
      const response = await fetch(`/api/posts/${id}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleted = () => {
    router.push("/"); 
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 text-center">
          Loading post...
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Button asChild>
            <a href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <a href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </a>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <PostCard post={post} showFullContent />
          <CommentSection postId={post.id} />
          {session?.user?.role === "ADMIN" && (
            <div className="flex justify-end">
              <DeleteButton postId={post.id} onDeleted={handleDeleted} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
