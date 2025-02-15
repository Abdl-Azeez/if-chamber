"use client";
import Image from "next/image";
import { FaLinkedin, FaXTwitter, FaFacebook, FaYoutube } from "react-icons/fa6";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Top Section with Home Icon */}
      <div className="px-6 lg:px-12 py-4 flex items-center bg-[#8B6F20]">
        <span className="text-white text-sm font-medium">About Us</span>
      </div>

      {/* Logo Section */}
      <div className="flex justify-center py-10">
        <div className="relative w-52 h-52 md:w-64 md:h-64 rounded-full border-[10px] border-[#8B6F20] flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="IFChamber Logo"
            width={200}
            height={200}
          />
        </div>
      </div>

      {/* Description */}
      <div className="px-6 lg:px-12 text-center max-w-4xl mx-auto text-gray-700 leading-relaxed">
        <p>
          At the Islamic Finance Chamber (IFChamber), we are committed to
          fostering the growth and excellence of Islamic finance through
          innovative solutions, expert advisory services, and impactful
          capacity-building programs.
        </p>
        <p className="mt-4">
          Founded on the principles of Shari’ah compliance, we specialize in
          offering comprehensive services across various sectors of Islamic
          finance, including banking, Takaful (Islamic insurance), asset
          management, and investment advisory. Our mission is to empower
          organizations and individuals by providing them with the tools,
          insights, and frameworks needed to succeed in the dynamic world of
          Islamic finance.
        </p>
      </div>

      {/* Join Community Section */}
      <div className="text-center my-10 flex flex-col items-center">
        <h2 className="text-lg font-bold">Connect with IFChamber</h2>
        <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-green-700 transition-all">
          <span>Join the IFChamber community</span>
        </button>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
