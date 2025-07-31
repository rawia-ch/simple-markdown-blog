import { notFound } from 'next/navigation';
import PostCard from '@/components/post-card';

async function getPost(slug: string) {
  const res = await fetch(`http://localhost:3000/api/posts-by-slug/${slug}`, {
    cache: 'no-store', // Désactive le cache pour les données dynamiques
  });
  if (!res.ok) throw new Error('Failed to fetch');
  const data = await res.json();
  return data;
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post || 'error' in post) notFound();

  return (
    <div className="container mx-auto p-4">
      <PostCard post={post} showFullContent={true} />
    </div>
  );
}

export async function generateStaticParams() {
  const res = await fetch('http://localhost:3000/api/posts', {
    cache: 'no-store',
  });
  const posts = await res.json();
  return posts.map((post: { slug: string }) => ({ slug: post.slug }));
}