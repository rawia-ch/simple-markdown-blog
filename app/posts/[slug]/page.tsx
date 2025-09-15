"use client";

import PostCard from "@/components/post-card";
import CommentSection from "@/components/comment-section";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function PostPage() {
  const params = useParams();
  const slug = params.slug;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/posts-by-slug/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.expiresOn) {
            data.expiresOn = new Date(data.expiresOn);
          }
          setPost(data);
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleDelete = (deletedPostId: string) => {
    if (post?.id === deletedPostId) {
      setPost(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-orange-100">
        <p className="text-gray-800 text-lg font-medium font-sans animate-pulse">
          Loading promotion...
        </p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-orange-100 px-4">
        <h1 className="text-2xl font-bold mb-4 font-sans text-gray-900">
          Promotion not found
        </h1>
        <Button asChild variant="outline">
          <Link href="/" className="flex items-center font-sans">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center font-sans">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-base sm:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-800 to-amber-600">
            Deal Details
          </h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex flex-col items-center gap-8">
        <div className="w-full max-w-3xl">
          <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8">
            <PostCard post={post} showFullContent onDelete={handleDelete} />
          </div>
        </div>
        <div className="w-full max-w-3xl">
          <div className="bg-white shadow-md rounded-2xl p-6">
            <CommentSection postId={post.id} />
          </div>
        </div>
      </main>
    </div>
  );
}


