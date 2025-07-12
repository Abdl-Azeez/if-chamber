"use client";
import Image from "next/image";
import { FaHome, FaWhatsapp } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getLogos } from "@/utils/getLogos";
import { useEffect, useState } from "react";

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function AboutPage() {
  const [siteLogo, setSiteLogo] = useState("/assets/logo.png");
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogo = async () => {
      const logos = await getLogos();
      setSiteLogo(logos.site);
    };
    fetchLogo();
    fetchAbout();
  }, []);

  async function fetchAbout() {
    setLoading(true);
    try {
      const res = await fetch("/api/about");
      const data = await res.json();
      setAbout(data);
    } catch {
      setAbout(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex flex-col">
        <Navbar isAbout={true} />
        {/* Hero skeleton with background and placeholder title/subtitle */}
        <div
          className="w-full flex flex-col items-center justify-center text-center py-20 md:py-28"
          style={{
            background: '#92751B',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg animate-pulse">IF-Chamber</h1>
          <div className="text-lg md:text-xl text-white opacity-90 animate-pulse">Empowering the Future of Islamic Finance</div>
        </div>
        {/* Mission & Vision skeletons */}
        <div className="bg-gray-50 py-12 px-4 md:px-16 lg:px-32 grid grid-cols-1 md:grid-cols-2 gap-10">
          {["Our Mission", "Our Vision"].map((title, idx) => (
            <div key={idx}>
              <h2 className="text-2xl font-bold mb-2 text-black">{title}</h2>
              <div className="h-5 w-3/4 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
        {/* Our Story skeleton */}
        <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-md mx-4 md:mx-16 lg:mx-32 my-12 p-6 gap-8">
          <div className="w-full md:w-80 h-48 bg-gray-200 rounded-lg mb-4 md:mb-0 animate-pulse" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2 text-black">Our Story</h2>
            <div className="h-5 w-3/4 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
        {/* Team section skeletons */}
        <div className="bg-gray-50 py-16 px-4 md:px-16 lg:px-32 flex flex-col items-center flex-1">
          <h2 className="text-3xl font-bold mb-10 text-center text-black">Meet Our Team</h2>
          <div className="flex flex-wrap justify-center gap-10">
            {[1,2,3,4].map((_, idx) => (
              <div key={idx} className="flex flex-col items-center w-40 animate-pulse">
                <div className="w-24 h-24 rounded-full bg-gray-300 mb-3" />
                <div className="h-5 w-20 bg-gray-300 rounded mb-1" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!about) {
    return (
      <main className="min-h-screen bg-white flex flex-col">
        <Navbar isAbout={true} />
        {/* Team section always visible, show error placeholder */}
        <div className="bg-gray-50 py-16 px-4 md:px-16 lg:px-32 flex flex-col items-center flex-1">
          <h2 className="text-3xl font-bold mb-10 text-center text-black">Meet Our Team</h2>
          <div className="flex flex-wrap justify-center gap-10">
            {[{name:'Aisha Khan',role:'CEO'},{name:'Omar Hassan',role:'CFO'},{name:'Fatima Ali',role:'Head of Operations'},{name:'Yusuf Rahman',role:'Head of Strategy'}].map((member, idx) => (
              <div key={idx} className="flex flex-col items-center w-40">
                <div className="w-24 h-24 rounded-full bg-brandGold flex items-center justify-center text-white text-3xl font-bold mb-3">
                  {getInitials(member.name)}
                </div>
                <div className="font-semibold text-lg text-center">{member.name}</div>
                <div className="text-sm text-gray-600 text-center">{member.role}</div>
              </div>
            ))}
          </div>
          <div className="text-red-500 mt-8">Unable to load team data. Showing default team.</div>
        </div>
        <Footer />
      </main>
    );
  }

  const { hero = {}, mission = "", vision = "", story = {}, team = [] } = about;

  return (
    <main className="min-h-screen bg-white">
      <Navbar isAbout={true} />

      {/* Hero Section */}
      <div
        className="w-full flex flex-col items-center justify-center text-center py-20 md:py-28"
        style={{
          background: hero.bgColor || "#92751B",
          backgroundImage: hero.bgImage ? `url(${hero.bgImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">{hero.title || "IF-Chamber"}</h1>
        <div className="text-lg md:text-xl text-white opacity-90">{hero.subtitle || "Empowering the Future of Islamic Finance"}</div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-gray-50 py-12 px-4 md:px-16 lg:px-32 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-black">Our Mission</h2>
          <p className="text-gray-700 text-base md:text-md leading-relaxed text-justify">{mission}</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2 text-black">Our Vision</h2>
          <p className="text-gray-700 text-base md:text-md leading-relaxed text-justify">{vision}</p>
        </div>
      </div>

      {/* Our Story */}
      <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-md mx-4 md:mx-16 lg:mx-32 my-12 p-6 gap-8">
        {story.image && (
          <img
            src={story.image}
            alt="Our Story"
            className="w-full md:w-80 h-48 object-cover rounded-lg mb-4 md:mb-0"
          />
        )}
        <div>
          <h2 className="text-2xl font-bold mb-2 text-black">Our Story</h2>
          <p className="text-gray-700 text-base md:text-md leading-relaxed text-justify">{story.text}</p>
        </div>
      </div>

      {/* Meet Our Team */}
      <div className="bg-gray-50 py-16 px-4 md:px-16 lg:px-32 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-10 text-center text-black">Meet Our Team</h2>
        <div className="flex flex-wrap justify-center gap-10">
          {team.map((member, idx) => (
            <div key={idx} className="flex flex-col items-center w-40">
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mb-3 border-4 border-brandGold"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-brandGold flex items-center justify-center text-white text-3xl font-bold mb-3">
                  {getInitials(member.name)}
                </div>
              )}
              <div className="font-semibold text-lg text-center text-black">{member.name}</div>
              <div className="text-sm text-brandGold text-center">{member.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Join Community Section */}
      <div className="text-center mt-8 md:mt-14 lg:mt-20 flex flex-col items-center px-4">
        <h2 className="text-xl md:text-2xl font-bold text-black mb-4 md:mb-6">
          Connect with IFChamber
        </h2>
        <a
          href="https://chat.whatsapp.com/FJKIyU87hgq9tC3ob3DB7D"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 md:mt-10 mb-2 bg-green-800 text-white px-4 md:px-6 py-2 md:py-3 rounded-md flex items-center justify-center gap-2 hover:bg-green-600 transition-all text-sm md:text-base"
        >
          <FaWhatsapp className="text-white text-lg md:text-xl" />
          <span>Join the IFChamber community</span>
        </a>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
