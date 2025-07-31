"use client";

import { useRouter, useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, ArrowLeft } from "lucide-react";
import MarkdownRenderer from "@/components/markdown-renderer";

export default function EditPostPage() {
  const router = useRouter();
  const { id: postId } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tags, setTags] = useState(""); // Nouvel état pour les tags

  const [expiresOn, setExpiresOn] = useState<string>("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${postId}`);
        if (!res.ok) throw new Error("Failed to fetch post");
        const data = await res.json();
        setTitle(data.title);
        setContent(data.content);
        setPublished(data.published);
        setImageUrl(data.imageUrl || "");
        setTags(data.tags?.join(",") || "");
        setExpiresOn(data.expiresOn ? new Date(data.expiresOn).toISOString().split("T")[0] : ""); // Charger la date d'expiration
      } catch (err) {
        setError("Error loading post");
      }
    };

    if (postId) fetchPost();
  }, [postId]);

  const handleImageUpload = async () => {
    if (!imageFile) return imageUrl; // garde l’ancienne si pas de nouvelle

    const formData = new FormData();
    formData.append("file", imageFile);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Image upload failed");

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const uploadedImageUrl = await handleImageUpload();

      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const res = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          published,
          imageUrl: uploadedImageUrl,
          tags: tagsArray,
          expiresOn, // Ajouter expiresOn à la requête
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update post.");
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Edit Post</h1>
            <Button variant="outline" onClick={() => setPreview(!preview)}>
              <Eye className="h-4 w-4 mr-2" />
              {preview ? "Edit" : "Preview"}
            </Button>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className={`grid grid-cols-1 ${preview && "lg:grid-cols-2 gap-8"}`}>
            <Card>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={20}
                      className="min-h-80"
                      required
                    />
                  </div>

                  {/* Ajout du champ pour les tags */}
                  <div className="space-y-2">
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
                      value={expiresOn ? new Date(expiresOn).toISOString().split("T")[0] : ""}
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

                  <div className="space-y-2">
                    <Label htmlFor="image">Upload Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setImageFile(file);
                      }}
                    />
                    {imageFile && (
                      <p className="text-sm text-gray-500">Selected: {imageFile.name}</p>
                    )}
                    {!imageFile && imageUrl && (
                      <img src={imageUrl} alt="Existing" className="w-full rounded" />
                    )}
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Updating..." : "Update Post"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {preview && (
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">{title || "Post Title"}</h2>
                    {imageFile ? (
                      <img
                        src={URL.createObjectURL(imageFile)}
                        alt="Image Preview"
                        className="max-w-full rounded"
                      />
                    ) : imageUrl ? (
                      <img src={imageUrl} alt="Preview" className="max-w-full rounded" />
                    ) : null}
                    {expiresOn && (
                      <p className="text-green-500">Expires On: {new Date(expiresOn).toLocaleDateString()}</p>
                    )}
                    <MarkdownRenderer content={content || "*No content yet.*"} />
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