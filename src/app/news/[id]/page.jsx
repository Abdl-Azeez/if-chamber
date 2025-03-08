"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks"; 
import remarkGfm from "remark-gfm"; 
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function IFChamberNewsDetails() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

    
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`/api/news?id=${id}`);
        const data = await res.json();
        setNews(data.news);
      } catch (error) {
        console.error("Failed to fetch news", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchNews();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar isNews={true} />
        <main className="flex-grow flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brandGold mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading news...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar isNews={true} />
        <main className="flex-grow flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-600 text-lg">News not found.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar isNews={true} />
      <main className="flex-grow px-3 md:px-12 md:pt-12 pb-12 md:pb-24">
        {/* Hero Section */}
        <div
          className={`relative w-full h-64 md:h-[50dvh] flex items-end justify-left text-white text-left px-6 lg:px-16 bg-brandGold`}
          style={
            news.image
              ? {
                  backgroundImage: `url(${news.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {}
          }
        >
                  {news.image && <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                  }<h1 className="mb-24 relative text-2xl md:text-4xl font-bold !leading-relaxed max-w-3/4 mt-10">{news.title}</h1>
        </div>

        {/* Content Section */}
        <div className="react-markdown w-full text-justify mb-24 md:mb-96 py-10 text-gray-800 leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]} >{news.description}</ReactMarkdown>
        </div>

     
      </main>
      <Footer />
    </div>
  );
}