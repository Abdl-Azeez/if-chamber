"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function Navbar(props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThoughtLeadershipOpen, setIsThoughtLeadershipOpen] = useState(false);
  const [isExpertiseOpen, setIsExpertiseOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const searchBoxRef = useRef(null);
  const thoughtLeadershipRef = useRef(null);
  const expertiseRef = useRef(null);
   const [logos, setLogos] = useState({
    dashboard: "/assets/logo_pattern.png",
    site: "/assets/logo.png",
  });

  useEffect(() => {
    const fetchLogos = async () => {
      const fetchedLogos = await getLogos();
      setLogos(fetchedLogos);
    };
    fetchLogos();
  }, []);
  

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
      title: "Shari'ah Advisory & Compliance",
      articles: [
        "Shari'ah-compliant business structuring Shari'ah board establishment & governance Islamic financial product development Shari'ah compliance audits & reviews",
      ],
    },
    {
      title: "Training & Capacity Building",
      articles: [
        "Islamic finance certification courses Executive training for financial institutions Workshops on Shari'ah compliance & governance",
      ],
    },
    {
      title: "Finance Consulting",
      articles: [
        "Islamic banking operations & framework design Risk management & regulatory compliance Non-interest financial services consulting Sukuk structuring & advisory",
      ],
    },
  ];

  const textColorClass =
    props.isHome && !isMobileMenuOpen
      ? "hover:text-brandGold transition-colors duration-300"
      : props.isHome && isMobileMenuOpen
        ? "text-black hover:text-brandGold transition-colors duration-300"
        : props.resources && !isMobileMenuOpen
      ? "text-white hover:text-[#E0D5C0] transition-colors duration-300"
      : "text-gray-700 hover:text-brandGold transition-colors duration-300";

  const activeColorClass = props.resources ? "text-[#E0D5C0]" : "text-brandGold"; // Active state color

const textStyle = props.isHome && !isMobileMenuOpen ? { color: props.heroColor } : {};
  
  // Close submenus on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        thoughtLeadershipRef.current &&
        !thoughtLeadershipRef.current.contains(event.target)
      ) {
        setIsThoughtLeadershipOpen(false);
      }
      if (
        expertiseRef.current &&
        !expertiseRef.current.contains(event.target)
      ) {
        setIsExpertiseOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close one submenu when the other is opened
  useEffect(() => {
    if (isThoughtLeadershipOpen) {
      setIsExpertiseOpen(false);
    }
    if (isExpertiseOpen) {
      setIsThoughtLeadershipOpen(false);
    }
  }, [isThoughtLeadershipOpen, isExpertiseOpen]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    function handleClickOutside(e) {
      if (
        isSearchOpen &&
        searchBoxRef.current &&
        !searchBoxRef.current.contains(e.target)
      ) {
        setIsSearchOpen(false);
      }
    }
    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);


  return (
    <nav
      className={`md:w-full w-screen shadow-sm z-50 ${
        props.isHome ? "absolute" : "relative"
        } ${isMobileMenuOpen ? "bg-white" : props.resources && !isMobileMenuOpen ? "bg-brandGold" : "bg-transparent"}`}
      style={textStyle}
    >
      {/* Top Row */}
      <div className="whitespace-nowrap w-full pl-4 md:pl-16 pr-4 mx-auto py-4 flex md:justify-between items-center">
        {/* Hamburger Menu */}
        <button
          className={`block md:hidden w-1/12 ${
            isMobileMenuOpen && props.isHome
              ? "text-brandGold"
                ? isMobileMenuOpen && !props.isHome && !props.resources
                : "text-black"
              : "text-gray-800"
          } transition-colors duration-300`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <Link
          href="/"
          className="flex items-center md:w-1/2 w-11/12 justify-center md:justify-start mr-12 md:mr-0"
        >
          <div className="w-40">
            <Image
              src={props.isHome || props.resources ? logos.dashboard : logos.site}
              alt="Islamic Finance Logo"
              width={87}
              height={60}
              className="w-16 h-16 md:min-w-[87px] md:min-h-[65px] lg:min-w-[90px] lg:min-h-[80px] mx-auto my-0 md:mx-0"
              priority
            />
          </div>
        </Link>
        <div className="w-1/2 gap-4 md:flex flex-col hidden">
          <div className="hidden md:flex items-center gap-8 text-base justify-end">
            <Link
              href="/about"
              className={props.isAbout ? activeColorClass : textColorClass}
            style={textStyle}
            >
              About
            </Link>
            <Link
              href="/events"
              className={props.isEvent ? activeColorClass : textColorClass}
            style={textStyle}
            >
              Events
            </Link>
            <Link
              href="/opportunities"
              className={
                props.isOpportunities ? activeColorClass : textColorClass
              }
              style={textStyle}
            >
              Opportunities
            </Link>
            <Link
              href="/resources"
              className={
                props.resources ? activeColorClass : textColorClass
              }
              style={textStyle}
            >
              Resources
            </Link>
            {/* <div className="relative group">
              <button
                className={`${
                  props.isResources ? activeColorClass : textColorClass
                  } flex items-center gap-1`}
                style={textStyle}
              >
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
            </div> */}
            <Link
              href="/contact"
              className={props.isContact ? activeColorClass : textColorClass}
           style={textStyle}
            >
              Contact Us
            </Link>
          </div>
          {/* Bottom Row */}
          <div className="container mx-auto px-4 flex justify-end items-center gap-8 text-lg">
            <div className="" ref={thoughtLeadershipRef}>
              <button
                className={`${
                  isThoughtLeadershipOpen ? "text-brandGold" : textColorClass
                } 
      flex items-center gap-1 transition-colors duration-300`}
                onClick={() =>
                  setIsThoughtLeadershipOpen(!isThoughtLeadershipOpen)
                }
                style={textStyle}
              >
                Thought Leadership
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isThoughtLeadershipOpen ? "rotate-180" : ""
                  }`}
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
            <Link
              href="/news"
              className={props.isNews ? activeColorClass : textColorClass}
            style={textStyle}
            >
              News
            </Link>
            <div className="" ref={expertiseRef}>
              <button
                className={`${
                  isExpertiseOpen ? "text-brandGold" : textColorClass
                }  flex items-center gap-1`}
                onClick={() => setIsExpertiseOpen(!isExpertiseOpen)}
                style={textStyle}
              >
                Expertise
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isExpertiseOpen ? "rotate-180" : ""
                  }`}
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
                <div className="whitespace-normal px-6 lg:px-12 py-10 absolute w-full bg-white shadow-[inset_0_8px_15px_rgba(0,0,0,0.2)] z-50 left-0 top-full">
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
            <Link
              href="/expert-community"
              className={
                props.isExpertCommunity ? activeColorClass : textColorClass
              }
              style={textStyle}
            >
              Expert Community
            </Link>
            <button className="p-2" onClick={() => setIsSearchOpen((v) => !v)} aria-label="Open search">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke={props.isHome ? props.heroColor : "black"}
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

      {/* Desktop Search Input (slide down) */}
      <div
        ref={searchBoxRef}
        className={`fixed left-0 top-0 w-full z-50 transition-all duration-300 ease-in-out ${isSearchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} flex justify-center`}
        style={{
          transform: isSearchOpen ? 'translateY(0)' : 'translateY(-40px)',
        }}
      >
        <div className="w-full md:w-1/2 bg-white shadow-2xl rounded-b-xl px-6 py-4 flex items-center gap-3 mt-16">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent outline-none text-lg text-gray-700"
            onKeyDown={e => {
              if (e.key === 'Escape' || e.key === 'Enter') setIsSearchOpen(false);
            }}
          />
          <button onClick={() => setIsSearchOpen(false)} className="ml-2 text-gray-400 hover:text-gray-700" aria-label="Close search">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="block md:hidden bg-white shadow-lg text-black max-w-screen-sm">
          <div className="flex items-center bg-gray-200 px-4 py-2">
            <input
              type="text"
              placeholder="How Can we Help?"
              className="bg-gray-200 text-gray-600 w-full border-none focus:outline-none"
            />
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
            </svg>
          </div>

          <ul className="space-y-0 border-t">
            <li className="border-b">
  
  <div
    className={`w-full text-left flex justify-between items-center px-4 py-3 cursor-pointer ${
      isThoughtLeadershipOpen ? "text-brandGold" : textColorClass
    }`}
    onClick={() => setIsThoughtLeadershipOpen(!isThoughtLeadershipOpen)}
  >
    Thought Leadership
    <svg
      className={`w-4 h-4 transition-transform ${
        isThoughtLeadershipOpen ? "rotate-180" : ""
      }`}
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
  </div>

  {/* Dropdown content */}
  {isThoughtLeadershipOpen && (
    <ul className="pl-8 space-y-2 text-brandGold">
      <li>
        <Link
          href="/islamic-finance-ai"
          className="block hover:underline"
          onClick={() => setIsMobileMenuOpen(false)} 
        >
          Islamic Finance and AI
        </Link>
      </li>
      <li>
        <Link
          href="/blockchain-future"
          className="block hover:underline"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Blockchain's Future
        </Link>
      </li>
      <li>
        <Link
          href="/case-study"
          className="block hover:underline"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Case Study
        </Link>
      </li>
      <li>
        <Link
          href="/podcast"
          className="block hover:underline"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Podcast
        </Link>
      </li>
      <li>
        <Link
          href="/research"
          className="block hover:underline"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Research
        </Link>
      </li>
    </ul>
  )}
</li>
            <li className="border-b">
              <Link
                href="/news"
                className={`block px-4 py-3 text-left ${
                  props.isNews ? activeColorClass : textColorClass
                }`}
              >
                News
              </Link>
            </li>
            <li className="border-b">
              <Link
                href="/resources"
                className={`block px-4 py-3 text-left ${
                  props.resources ? activeColorClass : textColorClass
                }`}
              >
                Resources
              </Link>
            </li>
            <li className="border-b">
              <button
                className={`w-full text-left flex justify-between items-center px-4 py-3 ${
                  isExpertiseOpen ? "text-brandGold" : textColorClass
                }`}
                onClick={() => setIsExpertiseOpen(!isExpertiseOpen)}
              >
                Expertise
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isExpertiseOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  onClick={() => setIsExpertiseOpen(!isExpertiseOpen)}
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
                <ul className="pl-8 space-y-2 text-brandGold">
  <li>
    <Link href="/shariah-advisory-compliance" className="hover:underline">
      Shari'ah Advisory & Compliance
    </Link>
  </li>
  <li>
    <Link href="/training-capacity-building" className="hover:underline">
      Training & Capacity Building
    </Link>
  </li>
  <li>
    <Link href="/finance-consulting" className="hover:underline">
      Finance Consulting
    </Link>
  </li>
</ul>
              )}
            </li>
            <li className="border-b">
              <Link
                href="/expert-community"
                className={`block px-4 py-3 text-left ${
                  props.isExpertCommunity ? activeColorClass : textColorClass
                }`}
              >
                Expert Community
              </Link>
            </li>
            <li className="border-b">
              <Link
                href="/about"
                className={`block px-4 py-3 text-left ${
                  props.isAbout ? activeColorClass : textColorClass
                }`}
              >
                About
              </Link>
            </li>
            <li className="border-b">
              <Link
                href="/events"
                className={`block px-4 py-3 text-left ${
                  props.isEvent ? activeColorClass : textColorClass
                }`}
              >
                Events
              </Link>
            </li>
            <li className="border-b">
              <Link
                href="/contact"
                className={`block px-4 py-3 text-left ${
                  props.isContact ? activeColorClass : textColorClass
                }`}
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
