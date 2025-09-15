"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import AuthButton from "@/components/auth-button";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";

const formSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email"),
    message: z.string().min(5, "Message too short"),
    deals: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactPage() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { data: session } = useSession();

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/blog", label: "Blog" },
        { href: "/contact", label: "Contact" },
    ];

    const isAdmin = session?.user?.role === "ADMIN";

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormData>({ resolver: zodResolver(formSchema) });

    const onSubmit = async (data: FormData) => {
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                toast.success("✅ Message sent successfully!");
                reset();
            } else {
                toast.error("❌ Failed to send message.");
            }
        } catch (err) {
            toast.error("⚠️ Server error.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <motion.header
                className={`fixed top-0 w-full z-50 transition-all ${scrolled ? "bg-black/40 backdrop-blur-md" : "bg-transparent"
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
                                className={`text-lg md:text-xl font-semibold ${pathname === href ? "text-orange-400" : "text-white"
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
                        className="absolute top-full left-0 w-full bg-orange-200 backdrop-blur-lg p-6 space-y-4"
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
            <section className="relative min-h-screen flex items-center justify-center bg.cover bg-[url('/bg-contact.svg')] px-4 py-24 sm:py-28 bg-center bg-cover font-sans ">
                <div className="absolute inset-0 bg-gradient-to-b from-orange-200 to-orange-100 backdrop-blur-sm" />
                <motion.div
                    className="relative z-10 w-full max-w-lg sm:max-w-2xl bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl"
                    initial={{ opacity: 0, y: 80 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                        Contact Us
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <input
                                    {...register("firstName")}
                                    type="text"
                                    placeholder="First Name"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 text-black text-sm sm:text-base"
                                />
                                {errors.firstName && (
                                    <p className="text-red-400 text-sm">{errors.firstName.message}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    {...register("lastName")}
                                    type="text"
                                    placeholder="Last Name"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 text-black text-sm sm:text-base"
                                />
                                {errors.lastName && (
                                    <p className="text-red-400 text-sm">{errors.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="Email"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 text-black text-sm sm:text-base"
                            />
                            {errors.email && (
                                <p className="text-red-400 text-sm">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <input
                                {...register("deals")}
                                type="text"
                                placeholder="Reserved Deals (optional)"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 text-black text-sm sm:text-base"
                            />
                        </div>

                        <div>
                            <textarea
                                {...register("message")}
                                rows={5}
                                placeholder="Message"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 text-black text-sm sm:text-base"
                            />
                            {errors.message && (
                                <p className="text-red-400 text-sm">{errors.message.message}</p>
                            )}
                        </div>

                        <div className="text-center">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 sm:px-8 py-3 bg-gradient-to-r from-orange-700 to-amber-600 text-white rounded-full hover:scale-105 transition text-sm sm:text-base"
                            >
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </section>
        </div>
    );
}
