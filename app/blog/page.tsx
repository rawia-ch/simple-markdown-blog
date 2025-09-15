"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PostCard from "@/components/post-card";
import { ArrowLeft } from "lucide-react";

interface Post {
    id: string;
    title: string;
    content: string;
    slug: string;
    tags: string[];
    published: boolean;
    createdAt: string;
    imageUrl: string;
    expiresOn: Date | null;
    author: {
        name: string | null;
        image: string | null;
    };
    _count: {
        comments: number;
        likes: number;
    };
}

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    author: {
        name: string | null;
        image: string | null;
    };
    post: {
        title: string;
        slug: string;
    };
}

export default function BlogPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/posts");
            if (!res.ok) throw new Error("Failed to fetch posts");
            const data = await res.json();
            setPosts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-orange-100 px-6 sm:px-12 py-12">
            <header className="border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <a href="/" className="flex items-center gap-2 text-sm sm:text-base font-sans">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
                    </a>
                </div>
            </header>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                All Blog Promotions
            </h2>
            {loading ? (
                <p className="text-center font-sans">Loading posts...</p>
            ) : posts.length === 0 ? (
                <p className="text-center font-sans">No posts available.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}
