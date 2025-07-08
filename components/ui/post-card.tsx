import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import { Button } from "./button";
import { Heart, MessageCircle } from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string | null;
    image: string | null;
  };
  _count: {
    comments: number;
    likes: number;
  };
}

export default function PostCard({ post }) {
  const likeLoading = false;
  const liked = true;
  return (
    <Card>
      <CardHeader>
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
        <CardTitle className="text-xl">
          <Link href={`/posts/${post.id}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{post.content}</p>
      </CardContent>
      <CardFooter className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-1"
        >
          <Heart
            className={`h-4 w-4 ${
              likeLoading
                ? "animate-pulse"
                : liked
                ? "fill-red-500 text-red-500"
                : ""
            }`}
          />
          <span>10</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-1"
        >
          <MessageCircle />
          <span>5</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
