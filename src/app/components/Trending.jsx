"use client";
import { useState, useEffect, useRef } from "react";

export default function TrendingContent({ initialTrending = [] }) {
  const [trendingContents, setTrendingContents] = useState(initialTrending);
  const [hoveredContent, setHoveredContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (initialTrending.length === 0 && !hasFetched.current) {
    fetchTrending();
    } else if (initialTrending.length > 0) {
      setTrendingContents(initialTrending.sort((a, b) => a.position - b.position));
    }
  }, [initialTrending]);

  const fetchTrending = async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    const res = await fetch("/api/trending");
    const data = await res.json();
    setTrendingContents(data.sort((a, b) => a.position - b.position));
  };

  return (
    <div
      className="min-h-auto md:min-h-screen mt-16 lg:mt-8 w-screen"
      style={{
        backgroundImage: hoveredContent
          ? `url(${hoveredContent.image})`
          : `url(${trendingContents.length > 0 ? trendingContents[0]?.image : "/assets/trending_bg.webp"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 0.5s ease-in-out",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-auto md:h-screen relative">
        {/* Low Opacity Black Overlay for Background */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

        {/* Static Title Section (First item from backend) */}
        {trendingContents.length > 0 && (
          <div className="flex items-end justify-center p-16 md:p-8 md:border-r-2 border-b-2 border-gray-300 relative z-10">
            <h1 className="text-4xl lg:text-6xl font-bold text-white rounded-lg">
              {trendingContents[0].title}
            </h1>
          </div>
        )}

        {/* Dynamic Content Section */}
        {trendingContents.slice(1).map((content, index) => (
          <div
            key={content._id}
            className={` relative p-16 md:p-8 flex items-end justify-end cursor-not-allowed md:cursor-pointer transition-all duration-300 ${
              index === 0
                ? "border-b-2 md:border-b-2 md:border-r-2 border-gray-300"
                : index === 1
                ? "border-b-2 md:border-r-2 border-gray-300"
                : ""
            } relative z-10`}
            onMouseEnter={() => setHoveredContent(content)}
            onMouseLeave={() => setHoveredContent(null)}
          >
            {/* Red Overlay on Hover */}
            {hoveredContent?._id === content._id && (
              <div className="absolute inset-0 bg-brandGold bg-opacity-50 transition-opacity duration-300"></div>
            )}

            {/* Content Title by default */}
            <div
              className={`text-center relative z-20 transition-opacity duration-300 ${
                hoveredContent?._id === content._id
                  ? "opacity-0"
                  : "opacity-100"
              }`}
            >
              <h2 className="text-center md:text-right text-xl md:text-2xl text-white rounded-lg transition-transform transform hover:scale-105">
                {content.title}
              </h2>
            </div>
            <a href={content?.link} target="_blank" rel="noopener noreferrer">
              {/* Content Details on hover */}
              <div
                className={`absolute inset-0 p-4 md:p-8 flex flex-col justify-center transition-opacity duration-300 ${
                  hoveredContent?._id === content._id
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              >
                <div className="text-3xl md:text-4xl text-white font-semibold">
                  {content.title}
                </div>
                <div className="text-white mt-4 hidden md:block">
                  {content.description}
                </div>
                <div className="mt-8 group cursor-pointer">
                  <span className="text-white underline transition-all duration-300 transform group-hover:scale-105">
                    {content.linkTitle}&nbsp;
                    <span className="inline-block group-hover:hidden">
                      &gt;
                    </span>
                    <span className="hidden group-hover:inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:rotate-0">
                      &rarr;
                    </span>
                  </span>
                </div>
                {/* <div
                  className="mt-8"
                  onMouseEnter={() => setHoveredContent(content)}
                  onMouseLeave={() => setHoveredContent(null)}
                >
                  <span className="text-white underline cursor-pointer transition-transform transform hover:scale-105 transition-all duration-300">
                    {content.linkTitle}&nbsp;
                    <span className="inline-block transition-transform duration-300">
                      {hoveredContent?._id === content._id ? "→" : "›"}
                    </span>
                  </span>
                </div> */}
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
