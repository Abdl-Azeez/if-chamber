"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "./components/Navbar";
import Link from "next/link";

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/rss")
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
        setLoading(false); // Set loading to false when data is fetched
      });
  }, []);

  return (
    <main className="min-h-full">
      <Navbar isHome={true} />

      {/* Hero Section */}
      <section
        className={`relative flex items-center text-white py-20 px-4 bg-cover bg-center bg-no-repeat transition-all duration-500 ${
          imageLoaded ? "bg-transparent" : "bg-blue-500"
        } h-[120vh] w-full`} // Apply height to the section
      >
        {/* Background Image */}
        <Image
          src="/hero_bg.jpeg"
          alt="Hero Background"
          layout="fill"
          objectFit="cover"
          className="z-[-1]"
          priority
          onLoad={() => setImageLoaded(true)}
        />
        <div className="pl-12 max-w-6xl relative z-10">
          <h1 className="text-5xl font-bold mb-4">
            Empowering Ethical Finance
            <br />
            and Islamic Growth
          </h1>
          <p className="text-xl mb-8 max-w-2xl">
            Dedicated to promoting the principles of Islamic finance, ethical
            banking, and economic sustainability.
          </p>
          <div className="space-x-4">
            <button className="bg-[#84670A] text-white px-2 py-2">
              Request Invitation
              <hr className="border-t-4 mt-2 mb-[-3px] rounded" />
            </button>
            <button className="bg-[#025F1CCC] hover:bg-[#025F1E] text-white px-2 py-2 ml-6">
              View Charter
              <hr className="border-t-4 mt-2 mb-[-3px] rounded" />
            </button>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 pl-4 absolute top-[85dvh] right-0">
        <div className="flex items-center w-screen overflow-hidden">
          <h2 className="text-lg font-bold mb-8 w-1/4 pl-16 h-96 flex items-center">
            LATEST NEWS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded bg-[#84670A] max-h-96 w-3/4">
            {loading
              ? [0, 1, 2].map((article) => (
                  <div className="news-card text-white py-6 px-6" key={article}>
                    <hr className="border-t-2 my-6 rounded" />
                    <span className="text-sm mb-2">News</span>
                    <h3 className="text-xl font-semibold mt-2 h-40 italic w-1/3">
                      Loading Latest News...
                    </h3>
                    <em className="mt-4 text-sm">Source: Loading___</em>
                  </div>
                ))
              : news
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 3)
                  .map((article) => (
                    <div
                      className="news-card text-white py-6 px-6"
                      key={article?.description}
                    >
                      <hr className="border-t-2 my-6 rounded" />
                      <span className="text-sm mb-2">News</span>
                      <h3 className="text-xl font-semibold mt-2 line-clamp-6">
                        <a
                          href={article?.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {article?.title}
                        </a>
                      </h3>
                      <p className="mt-4 text-sm">Source: {article?.source}</p>
                    </div>
                  ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 px-4 bg-gray-50">
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
      </section>

      {/* Trending Content Section */}
      {/* <section className="py-16 px-4 bg-black text-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8">Trending Content</h2>
          <div className="trending-content-grid">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="trending-card">
                <Image
                  src={`/trending-${item}.jpg`}
                  alt={`Trending content ${item}`}
                  width={600}
                  height={600}
                  className="w-full h-full"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80">
                  <h3 className="text-xl font-semibold">Trending Content</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Research Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold mb-6">Research and Reviews</h2>
          <p className="text-gray-600 mb-4">
            Check out latest research in field of Islamic finance and recent
            reviews on IF books
          </p>
          <Link href="/research" className="text-[#84670A] font-semibold">
            Check out recent research →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#84670A] text-white py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex justify-center space-x-6 mb-8">
            <Link href="#" className="hover:opacity-80">
              LinkedIn
            </Link>
            <Link href="#" className="hover:opacity-80">
              Twitter
            </Link>
            <Link href="#" className="hover:opacity-80">
              Facebook
            </Link>
            <Link href="#" className="hover:opacity-80">
              YouTube
            </Link>
          </div>
          <div className="flex justify-center space-x-8 text-sm">
            <Link href="#" className="hover:opacity-80">
              About
            </Link>
            <Link href="#" className="hover:opacity-80">
              Contact
            </Link>
            <Link href="#" className="hover:opacity-80">
              People
            </Link>
            <Link href="#" className="hover:opacity-80">
              Privacy & Cookie Statement
            </Link>
            <Link href="#" className="hover:opacity-80">
              FAQs
            </Link>
            <Link href="#" className="hover:opacity-80">
              Blogs
            </Link>
          </div>
          <div className="text-center mt-8 text-sm opacity-80">
            © 2025 IF Chamber
          </div>
        </div>
      </footer>
    </main>
  );
}
