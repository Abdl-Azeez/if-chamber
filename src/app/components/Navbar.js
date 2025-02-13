"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar({ isHome }) {
  const [isThoughtLeadershipOpen, setIsThoughtLeadershipOpen] = useState(false);

  // Define the text color classes based on `isHome`
  const textColorClass = isHome
    ? "text-white hover:text-white"
    : "text-gray-700 hover:text-gray-900";

  return (
    <nav
      className={`w-full border-b shadow-sm z-50 ${
        isHome ? "absolute" : "relative"
      }`}
    >
      {/* Top Row */}
      <div className="w-full pl-16 pr-4 mx-auto py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center w-1/2">
          <div className="w-40">
            <Image
              src={isHome ? "/logo_pattern.png" : "/logo.png"}
              alt="Islamic Finance Logo"
              width={87}
              height={60}
              priority
            />
          </div>
        </Link>
        <div className="w-1/2 gap-4 flex flex-col">
          <div className="flex items-center gap-8 text-base justify-end">
            <Link href="/about" className={textColorClass}>
              About
            </Link>
            <Link href="/events" className={textColorClass}>
              Events
            </Link>
            <Link href="/opportunities" className={textColorClass}>
              Opportunities
            </Link>
            <div className="relative group">
              <button className={`${textColorClass} flex items-center gap-1`}>
                Resources
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
            <Link href="/contact-us" className={textColorClass}>
              Contact Us
            </Link>
          </div>
          {/* Bottom Row */}
          <div className="container mx-auto px-4 flex justify-end items-center gap-8 text-lg">
            <div className="">
              <button
                className={`${textColorClass} flex items-center gap-1`}
                onClick={() =>
                  setIsThoughtLeadershipOpen(!isThoughtLeadershipOpen)
                }
              >
                Thought Leadership
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isThoughtLeadershipOpen && (
                <div className="mt-6 absolute top-full left-0 w-full bg-white shadow-lg py-8 z-50">
                  <div className="container mx-auto px-4 grid grid-cols-4 gap-8">
                    <div>
                      <h3 className="font-semibold text-lg mb-4">
                        Thought Leadership
                      </h3>
                      <div className="space-y-2">
                        <p>Islamic Finance and AI</p>
                        <p>How Blockchain is Shaping the Future</p>
                      </div>
                      <Link
                        href="/thought-leadership"
                        className="text-[#B58B00] mt-4 inline-block"
                      >
                        VIEW ALL
                      </Link>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Insights</h3>
                      <div className="space-y-2">
                        <p>What is Istisna?</p>
                        <p>
                          Comparing Islamic Banking with Conventional Banking
                        </p>
                      </div>
                      <Link
                        href="/insights"
                        className="text-[#B58B00] mt-4 inline-block"
                      >
                        VIEW ALL
                      </Link>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Case Study</h3>
                      <div className="space-y-2">
                        <p>Insights into Ethical Finance</p>
                        <p>Islamic Finance and the nature</p>
                      </div>
                      <Link
                        href="/case-study"
                        className="text-[#B58B00] mt-4 inline-block"
                      >
                        VIEW ALL
                      </Link>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Research</h3>
                      <div className="space-y-2">
                        <p>Islamic Finance and AI</p>
                        <p>How Blockchain is Shaping the Future</p>
                      </div>
                      <Link
                        href="/research"
                        className="text-[#B58B00] mt-4 inline-block"
                      >
                        VIEW ALL
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Link href="/news" className={textColorClass}>
              News
            </Link>
            <div className="relative group">
              <button className={`${textColorClass} flex items-center gap-1`}>
                Expertise
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
            <Link href="/expert-community" className={textColorClass}>
              Expert Community
            </Link>
            <button className="p-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
