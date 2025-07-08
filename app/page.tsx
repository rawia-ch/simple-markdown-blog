import AuthButton from "@/components/auth-button";
import { Button } from "@/components/ui/button";
import PostCard from "@/components/ui/post-card";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { dummyPosts } from "./dummy-post";

export default function Home() {
  type post = {
  id: string;
  title: string;
  description: string;
  action: string;
  content: string;
  footer: string;
};
  const isAdmin = true;
  const posts = dummyPosts;
  const loading = true;
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-amber-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Simple Blog
          </Link>
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <Button asChild>
                <Link href="/admin/create">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Post
                </Link>
              </Button>
            )}
            <AuthButton />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to simple Blog</h1>
            <p className="text-muted-foregrownd">
              A clean, functional blog focused on great content
            </p>
          </div>
          <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post}  />         
              ))}
            </div>
        </div>
      </main>
    </div>
  );
}
