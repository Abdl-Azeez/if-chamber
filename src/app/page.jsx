"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import Navbar from "./components/Navbar";
import TrendingContent from "./components/Trending";
import Footer from "./components/Footer";
import Partners from "./components/Partners";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const [news, setNews] = useState([]);
  const [heroes, setHeroes] = useState([]);
  const [heroLoading, setHeroLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [heroColor, setHeroColor] = useState("white");

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const adminRes = await fetch("/api/news");
        const adminData = await adminRes.json();
        const adminNews = adminData.news
          .filter((news) => news.showInHero && news.visible)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (adminNews.length < 3) {
          const rssRes = await fetch(`/api/rss?limit=${3 - adminNews.length}`);
          const rssData = await rssRes.json();
          setNews([...adminNews, ...rssData]);
        } else {
          setNews(adminNews.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    setHeroLoading(true);
    fetch("/api/hero")
      .then((res) => res.json())
      .then((data) => {
        setHeroes(data.heroes.filter((hero) => hero.visible !== false));
        if (visibleHeroes.length > 0) {
          setHeroColor(visibleHeroes[0].textColor || "white"); 
        }
        setHeroLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching heroes:", error);
        setHeroLoading(false);
      });
  }, []);

  useEffect(() => {
    if (heroes.length > 0) {
      setHeroColor(heroes[0].textColor)
    }
  },[heroes])

  const handleHeroChange = (index) => {
    if (heroes[index]) {
      setHeroColor(heroes[index].textColor || "white");
    }
  };

  const NextArrow = ({ className, style, onClick }) => (
    <button
      className={className}
      style={{ ...style, display: "block", right: "40px", zIndex: 10 }}
      onClick={onClick}
    >
      <FaChevronRight size={40} color="#84670A" />
    </button>
  );

  const PrevArrow = ({ className, style, onClick }) => (
    <button
      className={className}
      style={{ ...style, display: "block", left: "10px", zIndex: 10 }}
      onClick={onClick}
    >
      <FaChevronLeft size={40} color="#84670A" />
    </button>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (oldIndex, newIndex) => handleHeroChange(newIndex),
  };

  return (
    <main className="min-h-full bg-white">
      <Navbar isHome={true} heroColor={heroColor} />

      {/* Hero Section */}
      {heroLoading && (
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
            {/* <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
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
            </div> */}
          </div>
        </section>
      )}
      {heroes.length > 1 ? (
        <Slider {...sliderSettings}>
          {heroes.map((hero) => (
            <section
              key={hero._id}
              className={`relative flex items-center py-20 px-4 bg-cover bg-center bg-no-repeat transition-all duration-500 ${
                !heroLoading ? "bg-transparent" : "bg-blue-500"
                } h-[120vh] w-full`}
             style={{ color: hero.textColor || "white" }}
            >
              <Image
                src={hero.image}
                alt={hero.title}
                layout="fill"
                objectFit="cover"
                priority
                onLoad={() => setImageLoaded(true)}
              />
              <div className="pl-4 md:pl-12 max-w-6xl relative z-10 mb-20 top-32 md:top-48" style={{ color: hero.textColor || "white" }}>
                <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-10 tracking-wide">
                  {hero.title.split(" ").map((word, index) => (
                    <>
                      {word} {(index + 1) % 3 === 0 && <br key={index} />}
                    </>
                  ))}
                </h1>
                <p className="text-lg md:text-xl mt-4 mb-12 max-w-2xl line-clamp-3 md:line-clamp-5 ">
                  {hero.description}
                </p>
                <div className="flex flex-wrap gap-2 md:gap-6">
                  {hero.buttons?.map((button, index) => (
                    <a
                      key={index}
                      href={button.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button
                        className="px-4 py-2 text-white transition-all duration-300 ease-in-out relative group max-w-[200px] md:w-full whitespace-nowrap truncate"
                        style={{ backgroundColor: button.color }}
                      >
                        {button.label}
                        <hr className="border-t-4 mt-2 mb-[-3px] rounded w-full group-hover:w-5 transition-all duration-300 ease-in-out" />
                      </button>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </Slider>
      ) : (
        heroes.map((hero) => (
          <section
            key={hero._id}
            className={`relative flex items-center py-20 px-4 bg-cover bg-center bg-no-repeat transition-all duration-500 ${
              imageLoaded && !heroLoading ? "bg-transparent" : "bg-blue-500"
              } h-[120vh] w-full`}
            style={{ color: hero.textColor || "white" }}
          >
            <Image
              src={hero.image}
              alt={hero.title}
              layout="fill"
              objectFit="cover"
              priority
              onLoad={() => setImageLoaded(true)}
            />
            <div className="pl-4 md:pl-12 max-w-6xl relative z-10 mb-20 -top-20" style={{ color: hero.textColor || "white" }}>
              <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-10 tracking-wide">
                {hero.title.split(" ").map((word, index) => (
                  <>
                    {word} {(index + 1) % 3 === 0 && <br key={index} />}
                  </>
                ))}
              </h1>
              <p className="text-lg md:text-xl mt-4 mb-12 max-w-2xl">
                {hero.description}
              </p>
              <div className="flex flex-wrap gap-2 md:gap-6">
                {hero.buttons?.map((button, index) => (
                  <a
                    key={index}
                    href={button.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button
                      className="px-4 py-2 text-white transition-all duration-300 ease-in-out relative group w-full"
                      style={{ backgroundColor: button.color }}
                    >
                      {button.label}
                      <hr className="border-t-4 mt-2 mb-[-3px] rounded w-full group-hover:w-5 transition-all duration-300 ease-in-out" />
                    </button>
                  </a>
                ))}
              </div>
            </div>
          </section>
        ))
      )}

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
                          href={
                            article.source === "IFChamber"
                              ? `/news/${article._id}`
                              : article.link
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {article?.title}
                        </a>
                      </h3>
                      <p className="absolute bottom-4 text-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                        Source: {article.source || "Unknown"}
                      </p>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Content Section */}
      <TrendingContent />

      {/* Partners Section */}
      <Partners />

      {/* Footer Section */}
      <Footer />
    </main>
  );
}
