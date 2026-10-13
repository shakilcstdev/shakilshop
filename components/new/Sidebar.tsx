
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
import { motion } from "motion/react";
import Logo from "./Logo";
import Link from "next/link";
import { useOutsideClick } from "@/hooks";
import SocialMedia from "../common/SocialMedia";
import { categoriesData } from "@/constants";
import { ClerkLoaded, useAuth } from "@clerk/nextjs";
import useStore from "@/store";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  const { items, favoriteProduct } = useStore();
  const { isSignedIn } = useAuth();

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
      className={`fixed inset-y-0 left-0 z-50 h-screen w-full transform bg-primary/50 shadow-xl ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        ref={sidebarRef}
        className="min-w-72 max-w-96 bg-black z-50 h-screen text-primary-foreground p-6 border-r border-r-shop_dark_green flex flex-col gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-shop_dark_green scrollbar-track-transparent"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-shop_dark_green pb-4">
          <Logo className="text-white" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="hover:text-shop_light_green hoverEffect rounded-md p-2 hover:bg-shop_dark_green/30"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mobile Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-shop_light_green">
            Quick Access
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <Link
              onClick={onClose}
              href="/cart"
              className="relative flex flex-col items-center gap-2 rounded-lg bg-shop_dark_green/30 p-3 text-center transition-colors duration-200 hover:bg-shop_dark_green/50"
            >
              <ShoppingCart size={20} className="text-shop_light_green" />
              <span className="text-xs font-medium text-zinc-300">Cart</span>

              {items?.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-shop_btn_dark_green text-xs font-semibold text-white">
                  {items.length}
                </span>
              )}
            </Link>

            <Link
              onClick={onClose}
              href="/wishlist"
              className="relative flex flex-col items-center gap-2 rounded-lg bg-shop_dark_green/30 p-3 text-center transition-colors duration-200 hover:bg-shop_dark_green/50"
            >
              <Heart size={20} className="text-pink-400" />
              <span className="text-xs font-medium text-zinc-300">
                Wishlist
              </span>

              {favoriteProduct?.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-xs font-semibold text-white">
                  {favoriteProduct.length}
                </span>
              )}
            </Link>

            <ClerkLoaded>
              {isSignedIn && (
                <Link
                  onClick={onClose}
                  href="/user/orders"
                  className="flex flex-col items-center gap-2 rounded-lg bg-shop_dark_green/30 p-3 text-center transition-colors duration-200 hover:bg-shop_dark_green/50"
                >
                  <Logs size={20} className="text-blue-400" />
                  <span className="text-xs font-medium text-zinc-300">
                    Orders
                  </span>
                </Link>
              )}
            </ClerkLoaded>
          </div>
        </div>

        {/* User Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-shop_light_green">
            My Account
          </h3>

          <div className="flex flex-col gap-2">
            {userMenuItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  onClick={onClose}
                  key={item.title}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md p-2 text-sm font-medium tracking-wide transition-all duration-200 hover:bg-shop_dark_green/30 hover:text-shop_light_green ${
                    pathname === item.href
                      ? "bg-shop_dark_green/50 text-shop_light_green"
                      : "text-zinc-300"
                  }`}
                >
                  <Icon size={18} />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Navigation */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-shop_light_green">
            Navigation
          </h3>

          <div className="flex flex-col gap-2">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  onClick={onClose}
                  key={item.title}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md p-2 text-sm font-medium tracking-wide transition-all duration-200 hover:bg-shop_dark_green/30 hover:text-shop_light_green ${
                    pathname === item.href
                      ? "bg-shop_dark_green/50 text-shop_light_green"
                      : "text-zinc-300"
                  }`}
                >
                  <Icon size={18} />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-shop_light_green">
            Popular Categories
          </h3>

          <div className="flex flex-col gap-1">
            {categoriesData.slice(0, 6).map((item) => (
              <Link
                onClick={onClose}
                key={item.title}
                href={`/category/${item.href}`}
                className="rounded px-2 py-1.5 text-xs font-medium capitalize text-zinc-400 transition-colors duration-200 hover:bg-shop_dark_green/20 hover:text-shop_light_green"
              >
                {item.title}
              </Link>
            ))}

            <Link
              onClick={onClose}
              href="/category"
              className="mt-1 rounded px-2 py-1.5 text-xs font-semibold text-shop_orange transition-colors duration-200 hover:bg-shop_dark_green/20 hover:text-shop_light_orange"
            >
              View All Categories →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-shop_light_green">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <Link
              onClick={onClose}
              href="/deal"
              className="flex flex-col items-center gap-1 rounded-lg bg-shop_dark_green/30 p-3 text-center transition-colors duration-200 hover:bg-shop_dark_green/50"
            >
              <Flame size={20} className="text-shop_orange" />
              <span className="text-xs font-medium text-zinc-300">
                Hot Deals
              </span>
            </Link>

            <Link
              onClick={onClose}
              href="/wishlist"
              className="flex flex-col items-center gap-1 rounded-lg bg-shop_dark_green/30 p-3 text-center transition-colors duration-200 hover:bg-shop_dark_green/50"
            >
              <Heart size={20} className="text-shop_light_green" />
              <span className="text-xs font-medium text-zinc-300">
                Wishlist
              </span>
            </Link>
          </div>
        </div>

        {/* Support */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-shop_light_green">
            Support
          </h3>

          <div className="flex flex-col gap-2">
            {supportMenuItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  onClick={onClose}
                  key={item.title}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md p-2 text-sm font-medium tracking-wide transition-all duration-200 hover:bg-shop_dark_green/30 hover:text-shop_light_green ${
                    pathname === item.href
                      ? "bg-shop_dark_green/50 text-shop_light_green"
                      : "text-zinc-300"
                  }`}
                >
                  <Icon size={18} />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="my-2 border-t border-shop_dark_green" />

        {/* Promotional Banner */}
        <div className="rounded-lg bg-gradient-to-r from-shop_dark_green to-shop_btn_dark_green p-4 text-center">
          <h4 className="mb-1 text-sm font-bold text-shop_light_green">
            Special Offer!
          </h4>

          <p className="mb-2 text-xs text-zinc-300">
            Get 20% off on your first order
          </p>

          <Link
            onClick={onClose}
            href="/deal"
            className="inline-block rounded-full bg-shop_orange px-3 py-1 text-xs font-semibold text-white transition-colors duration-200 hover:bg-shop_light_orange"
          >
            Shop Now
          </Link>
        </div>

        {/* Social Media */}
        <div className="mt-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-shop_light_green">
            Follow Us
          </h3>
          <SocialMedia />
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
