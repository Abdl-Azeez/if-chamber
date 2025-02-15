import {
  FaFacebookF,
  FaFacebook,
  FaYoutube,
  FaLinkedinIn,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-[#84670A] text-white py-14">
      {/* Social Icons */}
      <div className="flex justify-center gap-6 space-x-6 mb-6 text-2xl">
        <a href="#" className="hover:text-gray-300 transition">
          {/* <FaLinkedinIn className="w-6 h-6" /> */}
          <FaLinkedin className="hover:text-[#0077B5] cursor-pointer transition-all" />
        </a>
        <a href="#" className="hover:text-gray-300 transition">
          {/* <FaXTwitter className="w-6 h-6" /> */}
          <FaXTwitter className="hover:text-black cursor-pointer transition-all" />
        </a>
        <a href="#" className="hover:text-gray-300 transition">
          {/* <FaFacebookF className="w-6 h-6" /> */}
          <FaFacebook className="hover:text-[#1877F2] cursor-pointer transition-all" />
        </a>
        <a href="#" className="hover:text-gray-300 transition">
          {/* <FaYoutube className="w-6 h-6" /> */}
          <FaYoutube className="hover:text-red-600 cursor-pointer transition-all" />
        </a>
      </div>

      {/* Divider Line */}
      <hr className="border-t border-white opacity-50 w-11/12 mx-auto mb-6" />

      {/* Footer Links */}
      <div className="flex justify-center space-x-4 text-sm mb-6">
        <a href="#" className="hover:underline hover:text-gray-300 transition">
          About
        </a>
        <a href="#" className="hover:underline hover:text-gray-300 transition">
          Contact
        </a>
        <a href="#" className="hover:underline hover:text-gray-300 transition">
          People
        </a>
        <a href="#" className="hover:underline hover:text-gray-300 transition">
          Privacy & Cookies Statement
        </a>
        <a href="#" className="hover:underline hover:text-gray-300 transition">
          FAQs
        </a>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm opacity-80 mt-6">
        313 Studio | © 2025 Ifchamber
      </div>
    </footer>
  );
}
