"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
        <header className="w-full border-b border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-center">
            <a href="/" aria-label="Back to homepage" className="inline-flex">
              <img src="/Final_2_Transparent_png_180x-_1_.png" alt="Optimal Sports" className="h-7" />
            </a>
          </div>
        </header>
        {children}
      </div>
    );
  }

  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  );
}


