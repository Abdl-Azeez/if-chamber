"use client";

import Head from "next/head";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function UnderConstruction() {
  const pathname = usePathname(); 
  const pageName = pathname.split("/").pop() || "home";
  const formattedPageName =
    pageName.charAt(0).toUpperCase() + pageName.slice(1);

  // Define props based on the pathname
  const isOpportunities = pathname === "/opportunities";
  const isExpertCommunity = pathname === "/expert-community";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Head>
        <title>Under Construction | {formattedPageName}</title>
        <meta name="description" content="This page is currently under construction" />
      </Head>

      <Navbar isOpportunities={isOpportunities} isExpertCommunity={isExpertCommunity} />

      {/* Main Content */}
      <main className="flex-grow bg-gradient-to-br from-gray-50 to-gray-100 py-8 md:py-12">
        <div className="container mx-auto px-4 flex flex-col items-center">
          {/* Blueprint Card */}
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-md mb-8 md:mb-12 relative overflow-hidden">
            <div className="h-2 bg-[#84670A] w-full"></div>
            <div className="h-60 md:h-80 p-4 md:p-6 relative">
              {/* Grid Lines - Horizontal */}
              <div className="absolute inset-0 flex flex-col justify-between px-4 md:px-6 pointer-events-none">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={`h-line-${i}`} className="w-full h-px bg-blue-100"></div>
                ))}
              </div>
              {/* Grid Lines - Vertical */}
              <div className="absolute inset-0 flex flex-row justify-between py-4 md:py-6 pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={`v-line-${i}`} className="h-full w-px bg-blue-100"></div>
                ))}
              </div>
              {/* Construction Elements */}
              <div className="relative h-full w-full">
                <div className="absolute top-1/4 left-1/4 h-12 w-12 md:h-16 md:w-16 rounded-full bg-amber-100 border-2 border-[#84670A]"></div>
                <div className="absolute bottom-1/4 right-1/4 h-16 w-16 md:h-20 md:w-20 rounded-full bg-amber-100 border-2 border-[#84670A]"></div>
                <div className="absolute top-1/3 right-1/4 h-3 w-24 md:h-4 md:w-32 bg-[#84670A] transform rotate-30 origin-right"></div>
                <div className="absolute bottom-1/3 left-1/4 h-2 w-20 md:h-2 md:w-24 bg-[#84670A] transform -rotate-15"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-24 w-24 md:h-32 md:w-32 rounded-full border-2 border-dashed border-[#84670A]"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 h-24 md:h-32 w-px bg-[#84670A]"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 h-px w-24 md:w-32 bg-[#84670A]"></div>
                <div className="absolute top-3/4 left-1/4 h-px w-12 md:w-16 bg-[#84670A] transform -rotate-12"></div>
                <div className="absolute top-1/4 right-1/4 h-px w-12 md:w-16 bg-[#84670A] transform rotate-12"></div>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4 text-center">
            Under Construction
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-2 text-center">
            We're architecting something amazing for you.
          </p>
          <p className="text-base md:text-lg text-gray-600 mb-8 text-center">
            The{" "}
            <span className="font-semibold text-[#84670A]">{formattedPageName}</span> section
            of our site is currently being crafted with care.
          </p>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}