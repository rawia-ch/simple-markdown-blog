import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAdmin } from "@/lib/utils/auth";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const { id } = params;

    const post = await prisma.post.findFirst({
      where: {
        id,
        published: true,
      },
      include: {
        author: { select: { name: true, image: true } },
        _count: { select: { comments: true, likes: true } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (err) {
    console.error("Failed to fetch post:", err);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  await requireAdmin();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
    console.log("Request body:", body); 
  } catch (error) {
    console.error("Invalid request body:", error);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { title, content, published, imageUrl, tags, expiresOn } = body;

  if (!title || !content || !imageUrl) {
    console.log("Missing required fields:", { title, content, imageUrl }); 
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const updatedPost = await prisma.post.update({
      where: { id: (await context.params).id },
      data: {
        title,
        content,
        published,
        imageUrl,
        tags,
        expiresOn: expiresOn && !isNaN(Date.parse(expiresOn)) ? new Date(expiresOn) : null,
      },
      include: {
        author: { select: { name: true, image: true } },
        _count: { select: { comments: true, likes: true } },
      },
    });

    return NextResponse.json(updatedPost);
  } catch (err) {
    console.error("Post update failed:", err); 
    return NextResponse.json({ error: "Post update failed", details: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}

export function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  await requireAdmin();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { id } = await context.params;

  try {
    const existingPost = await prisma.post.findUnique({ where: { id } });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Failed to delete post:", err);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
