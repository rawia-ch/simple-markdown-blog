import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAdmin } from "@/lib/utils/auth";


export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: { select: { name: true, image: true } },
        _count: { select: { comments: true, likes: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await requireAdmin();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

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

  const { title, content, tags, imageUrl, published, expiresOn } = body;

  if (!title || !content || !imageUrl) {
    console.log("Missing required fields:", { title, content, imageUrl }); 
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        tags,
        published: published || false,
        authorId: user.id,
        imageUrl,
        slug,
        expiresOn: expiresOn && !isNaN(Date.parse(expiresOn)) ? new Date(expiresOn) : null,
      },
      include: {
        author: { select: { name: true, image: true } },
        _count: { select: { comments: true, likes: true } },
      },
    });

    return NextResponse.json(post);
  } catch (err) {
    console.error("Post creation failed:", err); 
    return NextResponse.json({ error: "Post creation failed", details: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}