"use client";
import Image from "next/image";
import { FaHome, FaWhatsapp } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getLogos } from "@/utils/getLogos";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

export default function AboutPage() {
  const [siteLogo, setSiteLogo] = useState("/assets/logo.png"); // Default fallback
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogo = async () => {
      const logos = await getLogos();
      setSiteLogo(logos.site);
    };
    fetchLogo();
    fetchDescription();
  }, []);

  async function fetchDescription() {
    setLoading(true);
    try {
      const res = await fetch("/api/about");
      const data = await res.json();
      setDescription(data.description || "");
    } catch {
      setDescription("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar isAbout={true} />

      {/* Top Section with Home Icon */}
      <div className="px-4 sm:px-8 md:px-14 lg:px-16 py-3 md:py-4 flex items-center bg-brandGold justify-start">
        <FaHome className="mr-3 md:mr-5 text-lg md:text-xl text-white cursor-pointer hover:opacity-70" />
        <span className="text-white text-xs md:text-sm font-medium">About Us</span>
      </div>

      {/* Logo Section */}
      <div className="flex justify-center py-8 md:py-12">
        <div className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 rounded-full border-[20px] sm:border-[30px] md:border-[40px] border-brandGold flex items-center justify-center">
          <Image
            src={siteLogo}
            alt="IFChamber Logo"
            width={200}
            height={200}
            className="p-4 sm:p-6 md:p-8"
          />
        </div>
      </div>

      {/* Description */}
      <div className="my-4 px-4 sm:px-6 md:px-8 lg:px-12 text-justify w-full text-gray-700 leading-relaxed text-base sm:text-lg md:text-xl font-medium">
        {loading ? (
          <div className="flex justify-center items-center py-8 md:py-12">
            <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-brandGold"></div>
          </div>
        ) : (
          <div className="react-markdown text-justify text-gray-800">
            <ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]}>
                {description}
            </ReactMarkdown>
        </div>
          )}
      </div>

      {/* Join Community Section */}
      <div className="text-center mt-20 md:mt-32 lg:mt-56 flex flex-col items-center px-4">
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
