"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "./components/Navbar";
import TrendingContent from "./components/Trending";
import Footer from "./components/Footer";
import Partners from "./components/Partners";

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setLoading(true); // Set loading to true before fetching

    fetch("/api/rss?limit=3") // Add limit=3 to restrict results
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
        setLoading(false); // Ensure loading is disabled on error
      });
  }, []);

  return (
    <main className="min-h-full bg-white">
      <Navbar isHome={true} />

      {/* Hero Section */}
      <section
        className={`relative flex items-center text-white py-20 px-4 bg-cover bg-center bg-no-repeat transition-all duration-500 ${
          imageLoaded ? "bg-transparent" : "bg-blue-500"
        } h-[120vh] w-full`}
      >
        {/* Background Image */}
        <Image
          src="/hero_bg.webp"
          alt="Hero Background"
          layout="fill"
          objectFit="cover"
          priority
          onLoad={() => setImageLoaded(true)}
        />
        <div className="pl-4 md:pl-12 max-w-6xl relative z-10 mb-20 -top-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Empowering Ethical Finance
            <br />
            and Islamic Growth
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl">
            Dedicated to promoting the principles of Islamic finance, ethical
            banking, and economic sustainability.
          </p>
          <div className="space-x-2 md:space-x-4">
            <button className="bg-brandGold text-white px-2 py-2 relative group">
              Request Invitation
              <hr className="border-t-4 mt-2 mb-[-3px] rounded w-full group-hover:w-5 transition-all duration-300 ease-in-out" />
            </button>
            <button className="bg-[#025F1CCC] hover:bg-[#025F1E] text-white px-2 py-2 relative group">
              View Charter
              <hr className="border-t-4 mt-2 mb-[-3px] rounded w-full group-hover:w-5 transition-all duration-300 ease-in-out" />
            </button>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="pt-16 pb-0 pl-0 md:pl-4 absolute top-[81dvh] lg:top-[78dvh] right-0 z-20 w-full">
        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="flex items-center space-x-4 min-w-[600px]">
            <h2 className="hidden md:flex text-lg font-bold mb-0 flex-shrink-0 w-[30%] pl-4 h-96 items-center">
              LATEST NEWS
            </h2>
            <div className="flex space-x-4 h-96 w-full md:w-[70%]">
              {loading
                ? [0, 1, 2].map((article) => (
                    <div
                      className="news-card w-2/3 md:w-1/3 text-white py-6 px-6 flex-shrink-0 bg-brandGold rounded"
                      key={article}
                    >
                      <hr className="border-t-2 my-6 rounded" />
                      <span className="text-sm mb-2">News</span>
                      <h3 className="text-xl font-semibold mt-2 h-40 italic">
                        Loading Latest News...
                      </h3>
                      <em className="mt-4 text-sm">Source: Loading___</em>
                    </div>
                  ))
                : news.map((article) => (
                    <div
                      className="news-card w-3/6 md:w-1/3 text-white py-6 px-6 flex-shrink-0 bg-brandGold rounded relative group transition-all duration-300 ease-in-out transform hover:scale-105"
                      key={article?.description}
                    >
                      <hr className="border-t-2 my-6 rounded w-full group-hover:w-0 transition-all duration-500 ease-in-out" />
                      <span className="text-sm mb-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                        News
                      </span>
                      <h3 className="text-lg font-semibold mt-2 line-clamp-3 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                        <a
                          href={article?.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {article?.title}
                        </a>
                      </h3>
                      <p className="absolute bottom-4 text-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                        Source: {article?.source}
                      </p>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      {/* <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Past Event</h3>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <h4 className="font-semibold mb-2">
                    Reflection with IF leaders
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Daily Program during Ramadan that invites Islamic finance
                    scholars to speak on most crucial points of Islamic Finance
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Upcoming Event</h3>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <h4 className="font-semibold mb-2">
                    Reflection with IF leaders
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Daily Program during Ramadan that invites Islamic finance
                    scholars to speak on most crucial points of Islamic Finance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Trending Content Section */}
      <TrendingContent />

      {/* Research Section */}
      {/* <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold mb-6">Research and Reviews</h2>
          <p className="text-gray-600 mb-4">
            Check out latest research in field of Islamic finance and recent
            reviews on IF books
          </p>
          <Link href="/research" className="text-brandGold font-semibold">
            Check out recent research →
          </Link>
        </div>
      </section> */}

      <Partners />

      {/* Footer */}
      <Footer />
    </main>
  );
}
