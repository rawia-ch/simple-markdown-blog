"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AuthButton from "@/components/auth-button";
import { PlusCircle } from "lucide-react";

export default function AboutPage() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const isAdmin = session?.user?.role === "ADMIN";

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/blog", label: "Blog" },
        { href: "/contact", label: "Contact" },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <motion.header
                className={`fixed top-0 w-full z-50 transition-all ${scrolled ? "bg-black/80 backdrop-blur-md" : "bg-black/40"
                    }`}
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
            >
                <div className="w-full max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/xpres-removebg-preview 1.png"
                            alt="XpresDeals Logo"
                            width={120}
                            height={40}
                            className="rounded-full sm:w-[160px]"
                            priority
                        />
                    </Link>
                    <div className="hidden md:flex items-center space-x-8 text-sm sm:text-base">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={label}
                                href={href}
                                className={`text-lg font-semibold ${pathname === href ? "text-orange-400" : "text-white"
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
                                <Link href="/admin/create" className="flex items-center font-sans">
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
                                className={`block text-white text-lg font-semibold ${pathname === href ? "text-orange-400" : ""
                                    } hover:text-orange-300`}
                            >
                                {label}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </motion.header>
            <section
                className="relative min-h-[90vh] flex items-center justify-center bg-cover bg-center text-white px-6 pt-24 sm:pt-32"
                style={{ backgroundImage: "url('/bg 2.svg')" }}
            >
                <div className="absolute inset-0 bg-black/50"></div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-6xl items-center text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <h1 className="text-4xl sm:text-5xl font-bold mb-6">About Us</h1>
                        <p className="text-base sm:text-lg text-gray-200 mb-8">
                            XpresDeals is a platform designed to connect the community
                            with Long Island's halal businesses. Restaurants, butcher shops,
                            grocery stores—we highlight their offers so everyone
                            can benefit.
                        </p>
                        <h1 className="pb-8 font-bold text-amber-200 "> XpresDelas - Halal Legacy in the Making</h1>

                        <motion.div
                            className="inline-block px-6 py-4 bg-amber-900 rounded-xl font-bold text-base sm:text-lg shadow-lg"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            8+ Years Experience ⭐⭐⭐
                        </motion.div>
                    </motion.div>
                    <div className="relative w-full flex flex-col items-center justify-center">
                        <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 mb-8 sm:mb-12 items-center">
                            <motion.div
                                className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-amber-400 shadow-lg"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                            >
                                <Image
                                    src="/img1.svg"
                                    alt="Coffee"
                                    width={300}
                                    height={300}
                                    className="object-cover w-full h-full"
                                />
                            </motion.div>

                            <motion.div
                                className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-amber-400 shadow-lg"
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                            >
                                <Image
                                    src="/img2.svg"
                                    alt="Food"
                                    width={300}
                                    height={300}
                                    className="object-cover w-full h-full"
                                />
                            </motion.div>
                        </div>

                        <div className="relative flex flex-col items-center">
                            <motion.div
                                className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-amber-400 shadow-lg"
                                animate={{ y: [0, -15, 0] }}
                                transition={{ repeat: Infinity, duration: 4, delay: 2 }}
                            >
                                <Image
                                    src="/img3.svg"
                                    alt="Restaurant"
                                    width={300}
                                    height={300}
                                    className="object-cover w-full h-full"
                                />
                            </motion.div>
                            <motion.div
                                className="flex flex-col items-center mt-4 sm:mt-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 1 }}
                            >
                                <motion.svg
                                    className="w-7 h-7 sm:w-9 sm:h-9 text-yellow-400 mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 60 80"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                >
                                    <motion.path
                                        d="M5,5 C15,20 25,40 25,70"
                                        strokeDasharray="4,4"
                                        strokeLinecap="round"
                                    />
                                    <motion.path
                                        d="M25 70 L20 65 M25 70 L30 65"
                                        strokeWidth={2}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1 }}
                                    />
                                </motion.svg>
                                <motion.span
                                    className="text-xs sm:text-sm md:text-base text-white font-bold text-center"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 2 }}
                                >
                                    Great Entertainment
                                </motion.span>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
            <motion.section
                className="py-20 bg-orange-100 text-gray-800"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
                    <p className="text-lg leading-relaxed">
                        XpresDeals aims to connect the Long Island community with halal businesses
                        (restaurants, butcher shops, grocery stores). We give visibility to
                        local entrepreneurs and offer residents quick and easy access
                        to the best deals.
                    </p>
                </div>
            </motion.section>

            <motion.section
                className="py-20 bg-orange-100"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                        <h3 className="text-2xl font-semibold mb-4">1. Publish</h3>
                        <p>Businesses share their offers via the Visioad team.</p>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                        <h3 className="text-2xl font-semibold mb-4">2. Explore</h3>
                        <p>The community consults the promotions on the platform.</p>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                        <h3 className="text-2xl font-semibold mb-4">3. Enjoy</h3>
                        <p>Users find the best deals by area.</p>
                    </motion.div>
                </div>
            </motion.section>

            <motion.section
                className="py-20 bg-orange-200 text-white text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <h2 className="text-3xl font-bold mb-6">Join the XpresDeals Community</h2>
                <Link href="/blog">
                    <Button className="px-8 py-4 text-lg font-semibold bg-white text-orange-600 hover:bg-gray-100 transition font-sans">
                        Discover Promotions
                    </Button>
                </Link>
            </motion.section>

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
                        <p className="italic text-amber-200">Legacy in the Making</p>
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
                                const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;

                                const res = await fetch("/api/newsletter", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ email }),
                                });

                                if (res.ok) {
                                    alert("🎉 Thank you for subscribing!");
                                    (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value = "";
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
                                className="px-6 py-3 rounded-lg font-medium bg-orange-700 hover:bg-orange-800 transition"
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
