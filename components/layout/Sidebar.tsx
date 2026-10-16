
"use client";

import {
  X,
  Home,
  ShoppingBag,
  BookOpen,
  Flame,
  ShoppingCart,
  Heart,
  Tag,
  Phone,
  HelpCircle,
  Info,
  Grid3X3,
  Logs,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import { categoriesData } from "@/constants";
import useStore from "@/store";

import Logo from "../common/Logo";
import SocialMedia from "../common/SocialMedia";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { items, favoriteProduct } = useStore();

  // Sidebar-এর বাইরে ক্লিক করলে বন্ধ হবে
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const mainMenuItems = [
    { title: "Home", href: "/", icon: Home },
    { title: "Shop", href: "/shop", icon: ShoppingBag },
    { title: "Categories", href: "/category", icon: Grid3X3 },
    { title: "Brands", href: "/brands", icon: Tag },
    { title: "Blog", href: "/blog", icon: BookOpen },
    { title: "Hot Deal", href: "/deal", icon: Flame },
  ];

  const supportMenuItems = [
    { title: "Help Center", href: "/help", icon: HelpCircle },
    { title: "Customer Service", href: "/support", icon: Phone },
    { title: "About Us", href: "/about", icon: Info },
  ];

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-[100] md:hidden ${
        isOpen ? "visible" : "invisible pointer-events-none"
      }`}
    >
      {/* Background overlay */}
      <button
        type="button"
        aria-label="Close menu"
        tabIndex={isOpen ? 0 : -1}
        onClick={onClose}
        className={`absolute inset-0 h-full w-full bg-black/60 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Sidebar panel */}
      <motion.div
        ref={sidebarRef}
        initial={false}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="absolute left-0 top-0 z-10 flex h-full w-[min(20rem,85vw)] flex-col overflow-y-auto bg-black p-5 text-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 pb-4">
          <Logo />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <X size={22} />
          </button>
        </div>

        {/* Quick Access */}
        <div className="mt-5">
          <h3 className="mb-3 text-sm font-semibold text-gray-400">
            Quick Access
          </h3>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <Link
              href="/cart"
              onClick={onClose}
              className="flex flex-col items-center gap-2 rounded-lg p-3 hover:bg-gray-800"
            >
              <ShoppingCart size={21} />
              <span>Cart ({items?.length ?? 0})</span>
            </Link>

            <Link
              href="/wishlist"
              onClick={onClose}
              className="flex flex-col items-center gap-2 rounded-lg p-3 hover:bg-gray-800"
            >
              <Heart size={21} />
              <span>
                Wishlist ({favoriteProduct?.length ?? 0})
              </span>
            </Link>

            <Link
              href="/orders"
              onClick={onClose}
              className="flex flex-col items-center gap-2 rounded-lg p-3 hover:bg-gray-800"
            >
              <Logs size={21} />
              <span>Orders</span>
            </Link>
          </div>
        </div>

        {/* Main Menu */}
        <nav className="mt-6 space-y-1">
          <h3 className="mb-3 text-sm font-semibold text-gray-400">
            Main Menu
          </h3>

          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-800 ${
                  isActive ? "bg-gray-800 text-green-400" : "text-white"
                }`}
              >
                <Icon size={19} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Categories */}
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-gray-400">
            Categories
          </h3>

          <div className="space-y-1">
            {categoriesData.slice(0, 5).map((item) => (
              <Link
                key={item.title}
                href={`/category/${item.href}`}
                onClick={onClose}
                className="block rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800 hover:text-green-400"
              >
                {item.title}
              </Link>
            ))}

            <Link
              href="/category"
              onClick={onClose}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-green-400 hover:bg-gray-800"
            >
              View All Categories →
            </Link>
          </div>
        </div>

        {/* Support */}
        <div className="mt-6 space-y-1">
          <h3 className="mb-3 text-sm font-semibold text-gray-400">
            Support
          </h3>

          {supportMenuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg p-3 text-sm text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
              >
                <Icon size={18} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>

        {/* Social Media */}
        <div className="mt-6 border-t border-gray-700 pt-5">
          <SocialMedia />
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;