import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/utils/auth";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    // Vérifie si le post est déjà liké par cet utilisateur
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: id,
          userId: user.id,
        },
      },
    });

    if (existingLike) {
      // Si déjà liké : on retire le like
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return NextResponse.json({ liked: false });
    } else {
      //Like
      await prisma.like.create({
        data: {
          postId: id,
          userId: user.id,
        },
      });
      return NextResponse.json({ liked: true });
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
