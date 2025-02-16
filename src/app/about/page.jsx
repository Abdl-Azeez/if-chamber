"use client";
import Image from "next/image";
import { FaHome, FaWhatsapp } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Top Section with Home Icon */}
      <div className="px-14 relative lg:px-16 py-4 flex items-center bg-[#84670A] justify-start">
        <FaHome className="mr-5 text-xl text-white cursor-pointer hover:opacity-70" />
        <span className="text-white text-sm font-medium">About Us</span>
      </div>

      {/* Logo Section */}
      <div className="flex justify-center py-12">
        <div className="relative w-72 h-72 md:w-72 md:h-72 rounded-full border-[40px] border-[#84670A] flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="IFChamber Logo"
            width={200}
            height={200}
            className=" p-8"
          />
        </div>
      </div>

      {/* Description */}
      <div className="my-4 px-6 lg:px-12 text-justify w-full text-gray-700 leading-relaxed text-xl font-medium">
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
      <div className="text-center mt-56 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-black">
          Connect with IFChamber
        </h2>
        <a
          href="https://chat.whatsapp.com/FJKIyU87hgq9tC3ob3DB7D"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 mb-2 bg-green-800 text-white px-6 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-green-600 transition-all"
        >
          <FaWhatsapp className="text-white text-xl" />
          <span>Join the IFChamber community</span>
        </a>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
