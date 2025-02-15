import {
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-[#84670A] text-white py-14">
      {/* Social Icons */}
      <div className="flex justify-center space-x-6 mb-6">
        <a href="#" className="hover:text-gray-300 transition">
          <FaLinkedinIn className="w-6 h-6" />
        </a>
        <a href="#" className="hover:text-gray-300 transition">
          <FaXTwitter className="w-6 h-6" />
        </a>
        <a href="#" className="hover:text-gray-300 transition">
          <FaFacebookF className="w-6 h-6" />
        </a>
        <a href="#" className="hover:text-gray-300 transition">
          <FaYoutube className="w-6 h-6" />
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
