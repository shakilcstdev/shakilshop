
"use client";

import { SignIn } from "@clerk/nextjs";
import { motion } from "motion/react";
import Link from "next/link";
import Logo from "@/components/common/Logo";
import { ArrowLeft, Shield, Users, Star } from "lucide-react";
import { contactConfig } from "@/config/contact";
import { useSearchParams } from "next/navigation";

const SignInPage = () => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const safeRedirectTo =
    redirectTo?.startsWith("/") && !redirectTo.startsWith("//")
      ? redirectTo
      : "/user/dashboard";

  const features = [
    {
      icon: Shield,
      title: "Secure Authentication",
      description: "Your data is protected with enterprise-grade security",
    },
    {
      icon: Users,
      title: "Trusted by Thousands",
      description: "Join our community of satisfied customers",
    },
    {
      icon: Star,
      title: "Premium Experience",
      description: "Access exclusive deals and personalized recommendations",
    },
  ];

  return (
    <main className="relative min-h-screen w-full min-w-0 overflow-x-clip bg-gradient-to-br from-shop_light_green/5 via-shop_light_bg to-shop_light_pink/50">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-[10%] top-10 h-64 w-64 rounded-full bg-shop_light_green/10 blur-3xl" />
        <div className="absolute bottom-10 right-[5%] h-64 w-64 rounded-full bg-orange-200/20 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto flex w-full min-w-0 max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 text-sm font-medium text-shop_dark_green transition-colors hover:text-shop_light_green sm:text-base"
        >
          <ArrowLeft className="h-5 w-5 shrink-0" />
          <span>Back to Home</span>
        </Link>

        <div className="shrink-0">
          <Logo />
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 mx-auto grid w-full min-w-0 max-w-7xl grid-cols-1 items-center gap-6 px-4 pb-8 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:pb-12">
        {/* Welcome section: desktop only */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden min-w-0 lg:block"
        >
          <div className="mx-auto max-w-lg">
            <h1 className="mb-4 text-4xl font-bold leading-tight text-shop_dark_green xl:text-5xl">
              Welcome Back!
            </h1>

            <p className="mb-8 text-lg leading-relaxed text-dark-text">
              Sign in to access your account, track orders, and enjoy
              personalized shopping experiences at {contactConfig.company.name}.
            </p>

            <div className="space-y-6">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="flex min-w-0 items-start gap-4"
                  >
                    <div className="shrink-0 rounded-lg bg-shop_light_green/10 p-3">
                      <Icon className="h-5 w-5 text-shop_light_green" />
                    </div>

                    <div className="min-w-0">
                      <h2 className="mb-1 font-semibold text-shop_dark_green">
                        {feature.title}
                      </h2>
                      <p className="text-sm leading-relaxed text-dark-text">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 rounded-xl border border-shop_light_green/20 bg-white/80 p-5 shadow-sm">
              <p className="break-words text-sm text-dark-text">
                Need help? Contact our support team at{" "}
                <a
                  href={`mailto:${contactConfig.emails.support}`}
                  className="font-medium text-shop_light_green hover:underline"
                >
                  {contactConfig.emails.support}
                </a>
              </p>
            </div>
          </div>
        </motion.section>

        {/* Sign-in form */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto flex w-full min-w-0 max-w-md items-center justify-center lg:max-w-none"
        >
          <div className="w-full min-w-0 max-w-md rounded-2xl border border-gray-100 bg-white/95 p-3 shadow-xl sm:p-6 md:p-8">
            <div className="mb-5 text-center lg:hidden">
              <h1 className="text-2xl font-bold text-shop_dark_green sm:text-3xl">
                Welcome Back!
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Sign in to your account to track orders and shop your favorites.
              </p>
            </div>

            <div className="mx-auto w-full min-w-0 max-w-full overflow-x-clip">
              <SignIn
                signUpUrl={`/sign-up?redirectTo=${encodeURIComponent(safeRedirectTo)}`}
                forceRedirectUrl={safeRedirectTo}
                fallbackRedirectUrl="/user/dashboard"
                appearance={{
                  elements: {
                    rootBox: {
                      width: "100%",
                      maxWidth: "100%",
                      minWidth: "0",
                      margin: "0 auto",
                    },
                    cardBox: {
                      width: "100%",
                      maxWidth: "100%",
                      minWidth: "0",
                    },
                    card: {
                      width: "100%",
                      maxWidth: "100%",
                      minWidth: "0",
                      boxShadow: "none",
                      border: "none",
                      margin: "0 auto",
                    },
                    main: {
                      width: "100%",
                      maxWidth: "100%",
                    },
                    footer: {
                      width: "100%",
                      maxWidth: "100%",
                    },
                  },
                }}
              />
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
};

export default SignInPage;