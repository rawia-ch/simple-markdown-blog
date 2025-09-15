"use client";

import MarkdownRenderer from "@/components/markdown-renderer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

function UploadImage({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);

    if (res.ok) {
      onUpload(data.secure_url);
    } else {
      alert("Image upload failed");
      console.error(data.error);
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="image" className="font-sans text-sm sm:text-base">
        Upload Image
      </Label>
      <Input type="file" accept="image/*" onChange={handleImageUpload} />
      {uploading && <p className="text-xs sm:text-sm">Uploading...</p>}
    </div>
  );
}

export default function CreatePostPage() {
  const router = useRouter();
  const [preview, setPreview] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [expiresOn, setExpiresOn] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }
    if (!imageUrl) {
      setError("Please upload an image first");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          imageUrl,
          published,
          tags: tagsArray,
          expiresOn,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.details || result.error || "Post creation failed");
      }

      router.push("/");
    } catch (error) {
      console.error("Post creation failed", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderTags = () =>
    tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((tag, i) => (
        <span
          key={i}
          className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
        >
          #{tag}
        </span>
      ));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <a href="/" className="flex items-center gap-2 text-sm sm:text-base font-sans">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl lg:max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center sm:text-left">
              Create New Post
            </h1>
            <Button
              variant="outline"
              onClick={() => setPreview(!preview)}
              className="w-full sm:w-auto"
            >
              <Eye className="h-4 w-4 mr-2" />
              {preview ? "Edit" : "Preview"}
            </Button>
          </div>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div
            className={`grid grid-cols-1 ${preview ? "lg:grid-cols-2 gap-8" : ""}`}
          >
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-bold">
                  Promotion Form
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter title..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your post..."
                      rows={12}
                      required
                      className="min-h-40 sm:min-h-60"
                    />
                  </div>

                  <UploadImage onUpload={(url) => setImageUrl(url)} />
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full max-w-xs rounded object-cover"
                    />
                  )}

                  <div className="space-y-2 pb-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="e.g. brentwood,halalfood,longisland"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiresOn">Expiration Date</Label>
                    <Input
                      id="expiresOn"
                      type="date"
                      value={expiresOn || ""}
                      onChange={(e) => setExpiresOn(e.target.value)}
                      placeholder="Select expiration date..."
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={published}
                      onCheckedChange={setPublished}
                    />
                    <Label htmlFor="published">Publish immediately</Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full font-sans"
                  >
                    {loading ? "Creating..." : "Publish Post"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* === Preview === */}
            {preview && (
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl font-bold">
                    Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h2 className="text-xl sm:text-2xl font-bold">
                      {title || "Post Title"}
                    </h2>
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="rounded max-w-full h-auto"
                      />
                    )}
                    <MarkdownRenderer content={content || "Post content..."} />
                    <div className="mt-4 flex flex-wrap gap-2">{renderTags()}</div>
                    {expiresOn && (
                      <p className="text-green-500 text-sm sm:text-base">
                        Expires On:{" "}
                        {new Date(expiresOn).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
