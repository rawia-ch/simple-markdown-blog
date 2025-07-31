"use client";

import AuthButton from "@/components/auth-button";
import { Button } from "@/components/ui/button";
import PostCard from "@/components/post-card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { IoMdSearch } from "react-icons/io";
import { usePathname } from "next/navigation";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';

interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  imageUrl: string;
  expiresOn: Date | null;
  author: {
    name: string | null;
    image: string | null;
  };
  _count: {
    comments: number;
    likes: number;
  };
}

export default function Home() {
  const pathname = usePathname();
  // ... au début du composant
  const [menuOpen, setMenuOpen] = useState(false);


  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 2;

  const filteredPosts = posts.filter((post) =>
    post.tags.some((tag) =>
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );


  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    fetchPosts();
  }, [session]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (!response.ok) throw new Error("Failed to load posts");
      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error("API returned invalid data:", data);
        setPosts([]);
        return;
      }
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };


  return (
    <div className="min-h-screen bg-background">
      <header className="relative h-screen bg-[url('/bg1.png')] bg-cover bg-center bg-no-repeat">
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-6 space-y-6 md:space-y-0 md:space-x-10">
          {/* Logo + Add Post */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/" className="flex items-center">
              <Image
                src="/xpres-removebg-preview 1.png"
                alt="XpresDeals Logo"
                width={200}
                height={60}
                priority
                className="rounded-full"
              />
            </Link>
            {isAdmin && (
              <Button
                asChild
                className="whitespace-nowrap px-3 py-2 text-sm sm:text-base bg-gradient-to-r from-orange-800 to-amber-600 text-white hover:brightness-110 transition duration-300 font-sans"
              >
                <Link href="/admin/create" className="flex items-center">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New post
                </Link>
              </Button>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-wrap justify-center gap-x-4 gap-y-3 md:justify-end items-center text-sm sm:text-base">
            {navLinks.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className={`text-lg md:text-xl font-semibold ${pathname === href ? "text-orange-400" : "text-white"
                  } hover:text-orange-300 transition duration-200`}
              >
                {label}
              </Link>
            ))}
            <AuthButton />
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <AuthButton />
            <button
              className="text-white text-3xl focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
              <div className="md:hidden absolute top-30 right-10 bg-black/80 p-4 rounded-lg shadow-lg z-50 space-y-3">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`block text-white text-lg font-semibold ${pathname === href ? "text-orange-400" : ""
                      } hover:text-orange-300 transition`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hero Text & Search */}
        <div className="max-w-2xl mx-auto px-4 text-center py-12 md:py-24">

          <div className=" space-y-4">
            <h1 className="text-5xl sm:text-3xl md:text-5xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-orange-800 to-amber-600 font-sansita">
              Welcome to XpresDeals
            </h1>
            <div className="w-24 h-1 bg-amber-500 mx-auto mb-4 "></div>
            <p className="text-xl text-amber-100 italic">
              Legacy in the Malking
            </p>
            <p className="text-sm sm:text-base md:text-lg text-amber-50 tracking-wide pt-4 ">
              Blog promotions for your halal businesses
            </p>
          </div>
          <div className="flex justify-center pt-10">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
              <input
                type="text"
                placeholder="Search for a restaurant or area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-5 pr-12 py-3 rounded-full bg-white/20 text-white placeholder-white/70 border border-white focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-md"
              />
              <button
                type="button"
                className="absolute inset-y-1 right-1 flex items-center justify-center w-10 h-10 rounded-full bg-orange-700 hover:bg-orange-800"
              >
                <IoMdSearch className="text-white text-xl" />
              </button>
            </div>
          </div>
        </div>
      </header>


      {/* MAIN */}
      <main className="w-full px-4 py-8 space-y-8 bg-orange-100">
        {loading ? (
          <div className="text-center font-sans text-gray-500">Loading delicious deals...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center text-muted-foreground font-sans">
            No deals found. {isAdmin && "Create your first post !"}
          </div>
        ) : (
          <section>
            <div className="text-center pb-10">
              <p className="text-xl sm:text-2xl text-orange-700 pb-2">News</p>
              <h1 className="text-3xl sm:text-5xl font-bold pb-6">Latest Halal Deals</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-items-center pb-4">
              {paginatedPosts.map((post) => (
                <PostCard key={post.id} post={post} onDelete={handleDelete} />
              ))}
            </div>

            {/* Pagination SHADCN */}
            <Pagination className="mt-12 font-sans pb-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((p) => Math.max(p - 1, 1))
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={currentPage === index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      href="#"
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-amber-900 text-amber-100 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Image
                src="/xpres-removebg-preview 1.png"
                alt="XpresDeals Logo"
                width={160}
                height={50}
                className="mb-4"
              />
              <p className="text-amber-200 italic">
                Legacy in the Malking
              </p>
            </div>

            {navLinks.map((section) => (
              <div key={section.label}>
                <h3 className="font-bold text-lg text-white mb-4">
                  {section.label}
                </h3>
                <Link
                  href={section.href}
                  className="block text-amber-200 hover:text-white mb-2"
                >
                  {section.label}
                </Link>
              </div>
            ))}

            <div>
              <h3 className="font-bold text-lg text-white mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="bg-orange-800 hover:bg-amber-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                  <FaFacebookF />
                </a>
                <a href="#" className="bg-orange-800 hover:bg-amber-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                  <FaInstagram />
                </a>
                <a href="#" className="bg-orange-800 hover:bg-amber-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                  <FaWhatsapp />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-orange-800 mt-10 pt-6 text-center text-amber-400">
            <p>© {new Date().getFullYear()} XpresDeals. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
