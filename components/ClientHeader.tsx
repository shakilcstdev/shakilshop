"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

import Container from "./Container";
import HeaderMenu from "./layout/HeaderMenu";
import Logo from "./common/Logo";
import CartIcon from "./cart/CartIcon";
import MobileMenu from "./layout/MobileMenu";
import SearchBar from "./common/SearchBar";
import FavoriteButton from "./FavoriteButton";
import NotificationBell from "./NotificationBell";
import UserDropdown from "./UserDropdown";
import { useRouter, useSearchParams } from "next/navigation";

const ClientHeader = () => {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isSignedIn && user && isMounted && typeof window !== "undefined") {
      const redirectTo = searchParams.get("redirectTo");

      if (redirectTo) {
        const cleanUrl = decodeURIComponent(redirectTo);
        router.push(cleanUrl);

        const currentPath = window.location.pathname;
        router.replace(currentPath);
      }
    }
  }, [isSignedIn, user, searchParams, router, isMounted]);

  const getSignInUrl = () => {
    if (!isMounted || typeof window === "undefined") return "/sign-in";
    const currentPath = window.location.pathname + window.location.search;
    return `/sign-in?redirectTo=${encodeURIComponent(currentPath)}`;
  };

  const getSignUpUrl = () => {
    if (!isMounted || typeof window === "undefined") return "/sign-up";
    const currentPath = window.location.pathname + window.location.search;
    return `/sign-up?redirectTo=${encodeURIComponent(currentPath)}`;
  };

  return (
    <header className="sticky top-0 z-40 py-2 sm:py-3 lg:py-4 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <Container className="h-full">
        <div className="flex items-center h-full min-h-[3rem] sm:min-h-[3.5rem] lg:min-h-[4rem]">
          
          {/* Left */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <MobileMenu />
            <Logo />
          </div>

          {/* Center */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
            <HeaderMenu />
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 ml-auto">

            <SearchBar />

            <div className="hidden lg:flex items-center gap-4">
              <CartIcon />
              <FavoriteButton />
              <NotificationBell />

              {isSignedIn ? (
                <UserDropdown />
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href={getSignInUrl()}
                    className="border border-black px-2 py-1.5 rounded text-xs font-semibold"
                  >
                    Sign In
                  </Link>

                  <Link
                    href={getSignUpUrl()}
                    className="bg-black text-white px-2 py-1.5 rounded text-xs font-semibold"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </Container>
    </header>
  );
};

export default ClientHeader;