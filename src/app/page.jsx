"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import Navbar from "./components/Navbar";
import TrendingContent from "./components/Trending";
import Footer from "./components/Footer";
import Partners from "./components/Partners";
import { FaChevronLeft, FaChevronRight, FaArrowUp } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const [news, setNews] = useState([]);
  const [heroes, setHeroes] = useState([]);
  const [heroLoading, setHeroLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [heroColor, setHeroColor] = useState("white");
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
        if (data.heroes.length > 0) {
          setHeroColor(data.heroes[0].textColor || "white"); 
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
      setHeroColor(heroes[0].textColor || "white");
    }
  }, [heroes]);

  const handleHeroChange = (index) => {
    if (heroes[index]) {
      setHeroColor(heroes[index].textColor || "white");
    }
  };

  const NextArrow = ({ className, style, onClick }) => (
    <button
      className={className}
      style={{ 
        ...style, 
        display: "block", 
        right: "10px", 
        top: "57%",
        zIndex: 10,
        transform: "translateY(-50%)",
        background: "transparent",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        cursor: "pointer",
        transition: "all 0.3s ease",
        zIndex: 10,
      }}
      onClick={onClick}
    >
      <FaChevronRight 
        size={20} 
        color="#84670A" 
        className="md:w-5 md:h-5 w-4 h-4"
        style={{
          filter: "drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))"
        }}
      />
    </button>
  );

  const PrevArrow = ({ className, style, onClick }) => (
    <button
      className={className}
      style={{ 
        ...style, 
        display: "block", 
        left: "10px", 
        top: "57%",
        zIndex: 10,
        transform: "translateY(-50%)",
        background: "transparent",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        cursor: "pointer",
        transition: "all 0.3s ease",
        zIndex: 10,
      }}
      onClick={onClick}
    >
      <FaChevronLeft 
        size={20} 
        color="#84670A" 
        className="md:w-5 md:h-5 w-4 h-4"
        style={{
          filter: "drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))"
        }}
      />
    </button>
  );

  const sliderSettings = {
    dots: false,
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
            src="/assets/hero_bg.webp"
            alt="Hero Background"
            layout="fill"
            objectFit="cover"
            priority
            onLoad={() => setImageLoaded(true)}
          />
          <div className="pl-4 md:pl-12 max-w-6xl relative z-10 mb-20 -top-16">
         
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
                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-8 leading-tight md:leading-10 tracking-wide">
                  {hero.title.split(" ").map((word, index) => (
                    <>
                      {word} {(index + 1) % 3 === 0 && <br key={index} />}
                    </>
                  ))}
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl mt-2 md:mt-4 mb-6 md:mb-12 max-w-2xl line-clamp-3 md:line-clamp-5">
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
                        className="px-3 py-2 md:px-4 md:py-2 text-white transition-all duration-300 ease-in-out relative group w-full sm:max-w-[200px] md:w-full whitespace-nowrap truncate text-sm md:text-base"
                        style={{ backgroundColor: button.color }}
                      >
                        {button.label}
                        <hr className="border-t-2 md:border-t-4 mt-1 md:mt-2 mb-[-2px] md:mb-[-3px] rounded w-full group-hover:w-5 transition-all duration-300 ease-in-out" />
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
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-8 leading-tight md:leading-10 tracking-wide">
                {hero.title.split(" ").map((word, index) => (
                  <>
                    {word} {(index + 1) % 3 === 0 && <br key={index} />}
                  </>
                ))}
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl mt-2 md:mt-4 mb-6 md:mb-12 max-w-2xl">
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
                      className="px-3 py-2 md:px-4 md:py-2 text-white transition-all duration-300 ease-in-out relative group w-full sm:max-w-[200px] md:w-full text-sm md:text-base"
                      style={{ backgroundColor: button.color }}
                    >
                      {button.label}
                      <hr className="border-t-2 md:border-t-4 mt-1 md:mt-2 mb-[-2px] md:mb-[-3px] rounded w-full group-hover:w-5 transition-all duration-300 ease-in-out" />
                    </button>
                  </a>
                ))}
              </div>
            </div>
          </section>
        ))
      )}

      {/* Latest News Section */}
      <section className="pt-8 md:pt-16 pb-0 pl-0 md:pl-4 absolute top-[70dvh] md:top-[81dvh] lg:top-[78dvh] right-0 z-20 w-full">
        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="flex items-center space-x-4 min-w-[600px] md:min-w-full">
            <h2 className="hidden md:flex text-lg font-bold mb-0 flex-shrink-0 w-[30%] pl-4 h-96 items-center">
              LATEST NEWS
            </h2>
            <div className="flex space-x-2 md:space-x-4 h-80 md:h-96 w-full md:w-[70%]">
              {loading
                ? [0, 1, 2].map((article) => (
                    <div
                      className="news-card w-2/3 md:w-1/3 text-white py-4 md:py-6 px-4 md:px-6 flex-shrink-0 bg-brandGold rounded"
                      key={article}
                    >
                      <hr className="border-t-2 my-4 md:my-6 rounded" />
                      <span className="text-xs md:text-sm mb-2">News</span>
                      <h3 className="text-lg md:text-xl font-semibold mt-2 h-32 md:h-40 italic">
                        Loading Latest News...
                      </h3>
                      <em className="mt-2 md:mt-4 text-xs md:text-sm">Source: Loading___</em>
                    </div>
                  ))
                : news.map((article) => (
                    <div
                      className="news-card w-3/6 md:w-1/3 text-white py-4 md:py-6 px-4 md:px-6 flex-shrink-0 bg-brandGold rounded relative group transition-all duration-300 ease-in-out transform hover:scale-105"
                      key={article?.description}
                    >
                      <hr className="border-t-2 my-4 md:my-6 rounded w-full group-hover:w-0 transition-all duration-500 ease-in-out" />
                      <span className="text-xs md:text-sm mb-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                        News
                      </span>
                      <h3 className="text-sm md:text-lg font-semibold mt-2 line-clamp-3 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
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
                      <p className="absolute bottom-2 md:bottom-4 text-xs md:text-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                        Source: {article.source || "Unknown"}
                      </p>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-brandGold text-white rounded-full shadow-lg hover:bg-opacity-90 transition-all duration-300 z-50"
        >
          <FaArrowUp size={24} />
        </button>
      )}

      {/* Trending Content Section */}
      <TrendingContent />

      {/* Partners Section */}
      <Partners />

      {/* Footer Section */}
      <Footer />
    </main>
  );
}
