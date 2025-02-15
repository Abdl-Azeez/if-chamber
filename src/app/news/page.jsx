"use client";
import { useState, useEffect } from "react";
import { FaHome } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchNews(3, 1); // Fetch initial 3 news items on first load
  }, []);

  const fetchNews = async (limit, pageNumber) => {
    try {
      const res = await fetch(`/api/rss?limit=${limit}&page=${pageNumber}`);
      const data = await res.json();
      setNews((prev) => [...prev, ...data]);
    } catch (error) {
      console.error("Failed to fetch news", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleShowMore = () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(3, nextPage);
  };

  return (
    <div className="min-h-full flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow pb-8 min-h-[140vh]">
        {/* Top Section with Home Icon */}
        <div className="lg:h-80 relative flex justify-center flex-col bg-[#84670A] text-white px-16 pb-16 pt-4 text-center">
          <FaHome className="absolute top-10 left-14 text-xl text-white cursor-pointer hover:opacity-70" />

          <h1 className="text-5xl font-bold">Islamic Finance News</h1>
        </div>

        {/* News Section */}
        <div className="px-6 lg:px-12 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? Array(3)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className=" bg-white pb-12 rounded-lg shadow-lg relative overflow-hidden hover:shadow-2xl transition-shadow duration-300 border-t-2 border-[#84670A]"
                  >
                    <div className=" p-6">
                      <p className="text-sm text-gray-500">News</p>
                      <h2 className="font-semibold text-lg my-8 line-clamp-3 text-gray-500">
                        Fetching News...
                      </h2>
                      <p className="text-gray-600 line-clamp-3">
                        Please wait a moment while we fetch the latest news.
                      </p>
                    </div>
                  </div>
                ))
            : news.map((item, index) => (
                <div
                  key={item.link}
                  role="button"
                  tabIndex={0}
                  className="cursor-pointer bg-white pb-12 rounded-lg shadow-lg relative overflow-hidden hover:shadow-2xl transition-shadow duration-300 border-t-2 border-[#84670A]"
                  onClick={() => window.open(item.link, "_blank")}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      window.open(item.link, "_blank");
                    }
                  }}
                >
                  <div className=" p-6">
                    <p className="text-sm text-gray-500">News</p>
                    <h2 className="font-semibold text-lg my-8 line-clamp-3 text-gray-500">
                      {item.title}
                    </h2>
                    <p className="text-gray-600 line-clamp-3">
                      {item.description}
                    </p>
                    <p className=" text-sm text-gray-500 absolute bottom-4">
                      Source: {item.source}
                    </p>
                  </div>
                </div>
              ))}
        </div>

        {/* Show More Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleShowMore}
            disabled={loadingMore}
            className="bg-[#84670A] text-white py-6 px-8 hover:bg-[#84670CCC] transition-colors duration-300"
          >
            {loadingMore ? (
              <span className="animate-spin border-2 border-white border-t-transparent w-5 h-5 rounded-full block"></span>
            ) : (
              <span className="text-xl">SEE MORE NEWS &gt;</span>
            )}
          </button>
        </div>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}
