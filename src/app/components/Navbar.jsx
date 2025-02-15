"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar({ isHome }) {
  const [isThoughtLeadershipOpen, setIsThoughtLeadershipOpen] = useState(false);
  const [isExpertiseOpen, setIsExpertiseOpen] = useState(false);
  const thoughtLeadership = [
    {
      title: "Thought Leadership",
      articles: [
        "Islamic Finance and AI",
        "How Blockchain is Shaping the Future",
      ],
    },
    {
      title: "Insights",
      articles: [
        "What is Istisna?",
        "Comparing Islamic Banking with Conventional Banking",
      ],
    },
    {
      title: "Case Study",
      articles: [
        "Insights into Ethical Finance",
        "Islamic Finance and the nature",
      ],
    },
    {
      title: "Podcast",
      articles: [
        "Islamic Finance and AI",
        "How Blockchain is Shaping the Future",
      ],
    },
    {
      title: "Research",
      articles: [
        "Islamic Finance and AI",
        "How Blockchain is Shaping the Future",
      ],
    },
  ];
  const expertise = [
    {
      title: "Shari’ah Advisory & Compliance",
      articles: [
        "Shari’ah-compliant business structuring Shari’ah board establishment & governance Islamic financial product development Shari’ah compliance audits & reviews",
      ],
    },
    {
      title: "Training & Capacity Building",
      articles: [
        "Islamic finance certification courses Executive training for financial institutions Workshops on Shari’ah compliance & governance",
      ],
    },
    {
      title: "Finance Consulting",
      articles: [
        "Islamic banking operations & framework design Risk management & regulatory compliance Non-interest financial services consulting Sukuk structuring & advisory",
      ],
    },
  ];

  const textColorClass = isHome
    ? "text-white hover:text-white"
    : "text-gray-700 hover:text-gray-900";

  return (
    <nav
      className={`w-full shadow-sm z-50 ${isHome ? "absolute" : "relative"}`}
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
                <div className="px-6 lg:px-12 py-10 absolute w-full bg-white shadow-[inset_0_8px_15px_rgba(0,0,0,0.2)] z-50 left-0 top-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                    {thoughtLeadership.map((th, index) => (
                      <div key={th.title} className="space-y-3">
                        {/* Title with "VIEW ALL" */}
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-semibold text-black">
                            {th.title}
                          </h3>
                          <a
                            href="#"
                            className="text-sm font-semibold text-yellow-700 hover:text-yellow-800"
                          >
                            VIEW ALL &rarr;
                          </a>
                        </div>

                        {/* Horizontal Line */}
                        <hr className="border-t border-gray-300" />

                        {/* Article List */}
                        <ul className="space-y-2 text-gray-800">
                          {th.articles.map((article, idx) => (
                            <li key={idx} className="text-sm">
                              {article}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link href="/news" className={textColorClass}>
              News
            </Link>
            <div className="">
              <button
                className={`${textColorClass} flex items-center gap-1`}
                onClick={() => setIsExpertiseOpen(!isExpertiseOpen)}
              >
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
              {isExpertiseOpen && (
                <div className="px-6 lg:px-12 py-10 absolute w-full bg-white shadow-[inset_0_8px_15px_rgba(0,0,0,0.2)] z-50 left-0 top-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                    {expertise.map((th, index) => (
                      <div key={th.title} className="space-y-3">
                        {/* Title with "VIEW ALL" */}
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-semibold text-black">
                            {th.title}
                          </h3>
                        </div>

                        {/* Horizontal Line */}
                        <hr className="border-t border-gray-300" />

                        {/* Article List */}
                        <ul className="space-y-2 text-gray-800">
                          {th.articles.map((article, idx) => (
                            <li key={idx} className="text-sm">
                              {article}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
