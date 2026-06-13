"use client";

import {
  X,
  Home,
  ShoppingBag,
  BookOpen,
  Flame,
  User,
  ShoppingCart,
  Heart,
  Package,
  Tag,
  Phone,
  HelpCircle,
  Info,
  Grid3X3,
  Logs,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { FC } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import { useOutsideClick } from "@/hooks";
import { categoriesData } from "@/constants";
import useStore from "@/store";

import Logo from "../common/Logo";
import SocialMedia from "../common/SocialMedia";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  const { items, favoriteProduct } = useStore();

  const userMenuItems = [
    { title: "My Account", href: "/account", icon: User },
    { title: "My Orders", href: "/orders", icon: Package },
    { title: "Wishlist", href: "/wishlist", icon: Heart },
    { title: "Shopping Cart", href: "/cart", icon: ShoppingCart },
  ];

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
      className={`fixed inset-y-0 left-0 z-50 w-full bg-black/60 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        ref={sidebarRef}
        className="w-80 h-full bg-black text-white p-6 overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-700">
          <Logo />
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Quick Access */}
        <div className="mt-4">
          <h3 className="text-sm text-gray-400 mb-2">Quick Access</h3>

          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <Link href="/cart" onClick={onClose}>
              <ShoppingCart />
              Cart ({items?.length || 0})
            </Link>

            <Link href="/wishlist" onClick={onClose}>
              <Heart />
              Wishlist ({favoriteProduct?.length || 0})
            </Link>

            <Link href="/orders" onClick={onClose}>
              <Logs />
              Orders
            </Link>
          </div>
        </div>

        {/* Menu */}
        <div className="mt-6 space-y-2">
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 p-2 rounded hover:bg-gray-800 ${
                  pathname === item.href ? "text-green-400" : ""
                }`}
              >
                <Icon size={18} />
                {item.title}
              </Link>
            );
          })}
        </div>

        {/* Categories */}
        <div className="mt-6">
          <h3 className="text-sm text-gray-400 mb-2">Categories</h3>
          {categoriesData.slice(0, 5).map((item) => (
            <Link
              key={item.title}
              href={`/category/${item.href}`}
              onClick={onClose}
              className="block text-sm text-gray-300 hover:text-green-400"
            >
              {item.title}
            </Link>
          ))}
        </div>

        {/* Support */}
        <div className="mt-6">
          <h3 className="text-sm text-gray-400 mb-2">Support</h3>
          {supportMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-green-400"
              >
                <Icon size={16} />
                {item.title}
              </Link>
            );
          })}
        </div>

        {/* Social */}
        <div className="mt-6">
          <SocialMedia />
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;