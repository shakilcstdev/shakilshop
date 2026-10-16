
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";

import Container from "./Container";
import HeaderMenu from "./layout/HeaderMenu";
import Logo from "./common/Logo";
import CartIcon from "./cart/CartIcon";
import MobileMenu from "./layout/MobileMenu";
import SearchBar from "./common/SearchBar";
import FavoriteButton from "./FavoriteButton";
import NotificationBell from "./NotificationBell";
import UserDropdown from "./UserDropdown";

const ClientHeader = () => {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !isSignedIn || !user) return;

    const redirectTo = searchParams.get("redirectTo");

    if (!redirectTo) return;

    try {
      const cleanUrl = decodeURIComponent(redirectTo);

      // Only allow internal application paths.
      if (cleanUrl.startsWith("/") && !cleanUrl.startsWith("//")) {
        router.replace(cleanUrl);
      }
    } catch {
      // Ignore an invalid redirect URL.
    }
  }, [isMounted, isSignedIn, user, searchParams, router]);

  const getSignInUrl = () => {
    if (!isMounted || typeof window === "undefined") {
      return "/sign-in";
    }

    const currentPath =
      window.location.pathname + window.location.search;

    return `/sign-in?redirectTo=${encodeURIComponent(currentPath)}`;
  };

  const getSignUpUrl = () => {
    if (!isMounted || typeof window === "undefined") {
      return "/sign-up";
    }

    const currentPath =
      window.location.pathname + window.location.search;

    return `/sign-up?redirectTo=${encodeURIComponent(currentPath)}`;
  };

  return (
    <header className="sticky top-0 z-40 isolate border-b border-gray-100 bg-white/95 py-2 shadow-sm backdrop-blur-md sm:py-3 lg:py-4">
      <Container className="h-full">
        <div className="flex min-h-[3rem] h-full items-center sm:min-h-[3.5rem] lg:min-h-[4rem]">
          {/* Left: Mobile menu and logo */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <MobileMenu />
            <Logo />
          </div>

          {/* Center: Desktop navigation */}
          <div className="mx-8 hidden flex-1 items-center justify-center lg:flex">
            <HeaderMenu />
          </div>

          {/* Right: Search and account actions */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3 lg:gap-4">
            <SearchBar />

            <div className="hidden items-center gap-4 lg:flex">
              <CartIcon />
              <FavoriteButton />
              <NotificationBell />

              {isSignedIn ? (
                <UserDropdown />
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href={getSignInUrl()}
                    className="rounded border border-black px-2 py-1.5 text-xs font-semibold"
                  >
                    Sign In
                  </Link>

                  <Link
                    href={getSignUpUrl()}
                    className="rounded bg-black px-2 py-1.5 text-xs font-semibold text-white"
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
