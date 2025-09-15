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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { motion, AnimatePresence } from "framer-motion";
import CommentsList from "@/components/comments-list";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
  const [locationFilter, setLocationFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 2;
  const locations = ["Holbrook", "Queens", "Brentwood"];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.tags.some((tag) =>
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesLocation =
      locationFilter === "" || post.tags.includes(locationFilter);
    return matchesSearch && matchesLocation;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    fetchPosts();
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      <motion.header
        className={`fixed top-0 w-full z-50 transition-all ${
          scrolled ? "bg-black/40 backdrop-blur-md" : "bg-transparent"
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/xpres-removebg-preview 1.png"
              alt="XpresDeals Logo"
              width={180}
              height={50}
              priority
              className="rounded-full"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-10 text-sm sm:text-base">
            {navLinks.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className={`text-lg md:text-xl font-semibold ${
                  pathname === href ? "text-orange-400" : "text-white"
                } hover:text-orange-300 transition duration-200`}
              >
                {label}
              </Link>
            ))}
            <AuthButton />
            {isAdmin && (
              <Button
                asChild
                className="px-4 py-2 bg-gradient-to-r from-orange-800 to-amber-600 text-white"
              >
                <Link
                  href="/admin/create"
                  className="flex items-center font-sans"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Promotion
                </Link>
              </Button>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <AuthButton />
            <button
              className="text-white text-3xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ duration: 0.4 }}
              className="absolute top-full left-0 w-full bg-black/80 backdrop-blur-lg p-6 space-y-4"
            >
              {navLinks.map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`block text-white text-lg font-semibold ${
                    pathname === href ? "text-orange-400" : ""
                  } hover:text-orange-300`}
                >
                  {label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <section className="h-screen flex flex-col items-center justify-center bg-[url('/bg1.png')] bg-cover bg-center text-center text-white px-4">
        <motion.h1
          className="text-5xl sm:text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-800 to-amber-600"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Welcome to XpresDeals
        </motion.h1>
        <motion.p
          className="text-xl italic text-amber-200"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Halal Legacy in the Making
        </motion.p>
        <motion.div
          className="mt-8 max-w-md w-full"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.9 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a restaurant or area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-5 pr-12 py-3 rounded-full bg-white/20 text-white placeholder-white/70 border border-white focus:ring-2 focus:ring-orange-500 backdrop-blur-md font-sans"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-orange-700 hover:bg-orange-800 rounded-full flex items-center justify-center">
              <IoMdSearch className="text-white text-xl" />
            </button>
          </div>
        </motion.div>
      </section>
      <main className="w-full px-4 py-16 space-y-8 bg-orange-100">
        <motion.section
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl sm:text-5xl font-bold text-orange-900 mb-8">
            Latest Halal Deals
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
            <input
              type="text"
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 font-sans"
            />

            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 font-sans"
            >
              <option value="" className="font-sans">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl">
            {loading ? (
              <p className="font-sans">Loading...</p>
            ) : filteredPosts.length === 0 ? (
              <p className="font-sans">No deals found.</p>
            ) : (
              paginatedPosts.map((post) => (
                <div key={post.id} className="space-y-4">
                  <PostCard post={post} onDelete={handleDelete} />
                  <CommentsList postId={post.id} />
                </div>
              ))
            )}
          </div>
          <Pagination className="mt-12">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
        </motion.section>
      </main>
      <motion.footer
        className="bg-amber-900 text-amber-100 py-12 mt-12"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Image
              src="/xpres-removebg-preview 1.png"
              alt="XpresDeals Logo"
              width={150}
              height={45}
              className="mb-4"
            />
            <p className="italic text-amber-200"> Halal Legacy in the Making</p>
          </div>
          {navLinks.map((section) => (
            <div key={section.label}>
              <h3 className="font-bold mb-4">{section.label}</h3>
              <Link
                href={section.href}
                className="block text-amber-200 hover:text-white"
              >
                {section.label}
              </Link>
            </div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="font-bold mb-4">Subscribe to our Newsletter</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const email = (
                  e.currentTarget.elements.namedItem("email") as HTMLInputElement
                ).value;

                const res = await fetch("/api/newsletter", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                });

                if (res.ok) {
                  alert("🎉 Thank you for subscribing!");
                  (
                    e.currentTarget.elements.namedItem("email") as HTMLInputElement
                  ).value = "";
                } else {
                  alert("⚠️ Something went wrong. Please try again.");
                }
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Button
                type="submit"
                className="px-6 py-3 rounded-lg font-medium bg-orange-700 hover:bg-orange-800 transition font-sans"
              >
                Subscribe
              </Button>
            </form>
          </motion.div>
        </div>

        <div className="text-center text-amber-400 mt-10 font-sans">
          © {new Date().getFullYear()} XpresDeals. All rights reserved.
        </div>
      </motion.footer>
    </div>
  );
}
