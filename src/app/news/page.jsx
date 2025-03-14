"use client";
import { useState, useEffect, useRef } from "react";
import { FaHome } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";

export default function NewsPage() {
  const [ifChamberNews, setIfChamberNews] = useState([]);
  const [rssNews, setRssNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMoreIfChamber, setLoadingMoreIfChamber] = useState(false);
  const [loadingMoreRss, setLoadingMoreRss] = useState(false);
  const [ifChamberPage, setIfChamberPage] = useState(1);
  const [rssPage, setRssPage] = useState(1);
  const [ifChamberTotal, setIfChamberTotal] = useState(null);

  const isFetched = useRef(false);

  useEffect(() => {
    if (isFetched.current) return; 
    isFetched.current = true;

    fetchIfChamberNews(1);
    fetchRssNews(3, 1);
  }, []);

  const fetchIfChamberNews = async (pageNumber) => {
    try {
      setLoadingMoreIfChamber(true);
      const res = await fetch(`/api/news?page=${pageNumber}&limit=3`);
      const data = await res.json();
const visibleNews = data.news.filter((news) => news.visible);
      setIfChamberNews((prev) => [...prev, ...visibleNews]);
      if (pageNumber === 1) {
      const totalVisible = data.total - data.news.filter((news) => !news.visible).length;
      setIfChamberTotal(totalVisible);
    }
    } catch (error) {
      console.error("Failed to fetch IFChamber news", error);
    } finally {
      setLoadingMoreIfChamber(false);
      setLoading(false);
    }
  };

  const fetchRssNews = async (limit, pageNumber) => {
    try {
      setLoadingMoreRss(true);
      const res = await fetch(`/api/rss?limit=${limit}&page=${pageNumber}`);
      const data = await res.json();

      setRssNews((prev) => [...prev, ...data]);
    } catch (error) {
      console.error("Failed to fetch RSS news", error);
    } finally {
      setLoadingMoreRss(false);
      setLoading(false);
    }
  };

  const handleShowMoreIfChamber = () => {
    const nextPage = ifChamberPage + 1;
    setIfChamberPage(nextPage);
    fetchIfChamberNews(nextPage);
  };

  const handleShowMoreRss = () => {
    const nextPage = rssPage + 1;
    setRssPage(nextPage);
    fetchRssNews(3, nextPage);
  };

  return (
    <div className="min-h-full flex flex-col bg-white">
      <Navbar isNews={true} />
      <main className="flex-grow pb-8 min-h-[140vh]">
        {/* Top Section with Home Icon */}
        <div className="lg:h-80 relative flex justify-center flex-col bg-brandGold text-white px-16 pb-16 pt-4 text-center">
          <FaHome className="absolute top-10 left-14 text-xl text-white cursor-pointer hover:opacity-70" />

          <h1 className="text-5xl font-bold">Islamic Finance News</h1>
        </div>

        {/* IFChamber News Section */}
        {ifChamberNews.length > 0 && (
          <div className="px-6 lg:px-12 py-10 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-6 text-brandGold self-start pl-24">IFChamber News</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-10/12">
              {loading
                ? Array(3).fill(0).map((_, index) => (
                  <div key={index} className="bg-white pb-12 shadow border-t-2 border-brandGold p-6 relative">
                    <p className="text-sm text-gray-500">News</p>
                    <h2 className="font-semibold text-lg my-8 line-clamp-3 text-gray-500">Fetching News...</h2>
                    <p className="text-gray-600 line-clamp-3">Please wait a moment while we fetch the latest news.</p>
                  </div>
                ))
                : ifChamberNews.map((item) => (
                  <Link key={item._id} href={`/news/${item._id}`} passHref>
                  <div
  className="cursor-pointer bg-white pb-12  shadow border-t-2 border-brandGold p-6 relative h-full sm:h-72 md:h-80 lg:h-96"
>
                    <p className="text-sm text-gray-500">IFChamber News</p>
                    <h2 className="font-semibold text-lg my-8 line-clamp-3 text-gray-500">{item.title}</h2>
                    <div className="text-gray-600 line-clamp-3">
                      <ReactMarkdown>{item.description}</ReactMarkdown></div>
                    <p className="text-sm text-gray-500 absolute bottom-4 line-clamp-1">Source: IFChamber</p>
                    </div>
                    </Link>
                ))}
            </div>

            {/* Show More Button for IFChamber News (Disabled if all news are loaded) */}
            {ifChamberTotal === null || ifChamberNews.length < ifChamberTotal ? (
              <div className="mt-8 text-center">
                <button
                  onClick={handleShowMoreIfChamber}
                  disabled={loadingMoreIfChamber}
                  className="bg-brandGold text-white p-3 md:p-5 hover:bg-[#84670CCC] transition-colors duration-300"
                >
                  {loadingMoreIfChamber ? (
                    <span className="animate-spin border-2 border-white border-t-transparent w-5 h-5 rounded-full block"></span>
                  ) : (
                    <span className="text-md">SEE MORE IFCHAMBER NEWS &gt;</span>
                  )}
                </button>
              </div>
            ) : null}
          </div>
        )}
        {/* Islamic Finance News Section (RSS) */}
        <div className="px-6 lg:px-12 py-10 flex flex-col items-center">
          {ifChamberTotal !== null && <h2 className="text-xl font-bold mb-6 text-brandGold self-start pl-24">Others</h2>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-10/12">
            {loading
              ? Array(3).fill(0).map((_, index) => (
                  <div key={index} className="bg-white pb-12 shadow border-t-2 border-brandGold p-6 relative">
                    <p className="text-sm text-gray-500">News</p>
                    <h2 className="font-semibold text-lg my-8 line-clamp-3 text-gray-500">Fetching News...</h2>
                    <p className="text-gray-600 line-clamp-3">Please wait a moment while we fetch the latest news.</p>
                  </div>
                ))
              : rssNews.map((item) => (
                
                  <div
                    key={item.link}
                    className="cursor-pointer bg-white pb-12 shadow border-t-2 border-brandGold p-6 relative" 
                    onClick={() => window.open(item.link, "_blank")}
                  >
                    <p className="text-sm text-gray-500">News</p>
                    <h2 className="font-semibold text-lg my-8 line-clamp-3 text-gray-500">{item.title}</h2>
                    <p className="text-gray-600 line-clamp-3">{item.description}</p>
                    <p className="text-sm text-gray-500 absolute bottom-4 line-clamp-1">Source: {item.source}</p>
                  </div>
                ))}
          </div>

          {/* Show More Button for Islamic Finance News */}
          <div className="mt-8 text-center">
            <button
              onClick={handleShowMoreRss}
              disabled={loadingMoreRss}
              className="bg-brandGold text-white p-3 md:p-5 hover:bg-[#84670CCC] transition-colors duration-300"
            >
              {loadingMoreRss ? (
                <span className="animate-spin border-2 border-white border-t-transparent w-5 h-5 rounded-full block"></span>
              ) : (
                <span className="text-md">SEE MORE ISLAMIC FINANCE NEWS &gt;</span>
              )}
            </button>
          </div>
        </div>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}
