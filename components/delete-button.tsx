"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";

export default function DeleteButton({
  postId,
  onDeleted,
}: {
  postId: string;
  onDeleted?: (id: string) => void; // Rendu optionnel
}) {
  const { data: session } = useSession();
  const router = useRouter();

  // Si pas admin, on n'affiche pas le bouton
  if (session?.user?.role !== "ADMIN") return null;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      let data = null;
      try {
        data = await res.json();
      } catch (err) {
        console.warn("No JSON returned from DELETE");
      }

      if (!res.ok) {
        alert(data?.error || "Failed to delete post");
        return;
      }

      // Si onDeleted est passé, on l'appelle
      if (onDeleted) {
        onDeleted(postId);
      } else {
        router.refresh(); // Sinon on rafraîchit la page
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred while deleting the post.");
    }
  };

  return (
    <Button variant="destructive" className="font-sans" onClick={handleDelete}>
      <Trash2Icon className="h-4 w-4 mr-2" />
      Delete
    </Button>
  );
}
