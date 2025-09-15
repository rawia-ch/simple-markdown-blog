import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

type Context = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  req: NextRequest,
  context: Context
) {
  const { slug } = await context.params;

  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const postSerialized = {
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      expiresOn: post.expiresOn ? post.expiresOn.toISOString() : null,
    };

    return NextResponse.json(postSerialized);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
