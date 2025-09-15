"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Trash2Icon } from "lucide-react";
import toast from "react-hot-toast";
import * as React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function DeleteButton({
  postId,
  onDeleted,
}: {
  postId: string;
  onDeleted?: (id: string) => void;
}) {
  const { data: session } = useSession();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  if (session?.user?.role !== "ADMIN") return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error || "Failed to delete post");
        setLoading(false);
        return;
      }

      toast.success(data?.message || "Post deleted successfully!");
      setOpen(false);
      if (onDeleted) {
        onDeleted(postId);
      }

    } catch (err) {
      console.error(err);
      toast.error("An error occurred while deleting the post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="font-sans">
          <Trash2Icon className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="font-sans">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the post from the server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Yes, delete it"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
