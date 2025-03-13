"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminNav({ active }) {
  const router = useRouter();

  const handleLogout = () => {
    // Clear JWT from localStorage or cookies
    localStorage.removeItem("token");

    // Redirect to login page
    router.push("/admin/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (
      !token &&
      router.pathname !== "/admin/signup" &&
      router.pathname !== "/admin/login"
    ) {
      router.push("/admin/login");
    }
  }, [router]);

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center md:w-full w-screen">
      <div>
        <a href="/admin" className="text-2xl mb-5">
          Admin Panel
        </a>
      </div>
      <div>
        <a
          href="/admin/hero"
          className={`mr-10 hover:text-blue-300 hover:underline transition-colors duration-500 ${
            active === "hero" ? "underline text-blue-400 font-bold" : ""
          }`}
        >
          Hero
        </a>
        <a
          href="/admin/logo"
          className={`mr-10 hover:text-blue-300 hover:underline transition-colors duration-500 ${
            active === "logo" ? "underline text-blue-400 font-bold" : ""
          }`}
        >
          Logo
        </a>
        <a
          href="/admin/trending"
          className={`mr-10 hover:text-blue-300 hover:underline transition-colors duration-500 ${
            active === "trending" ? "underline text-blue-400 font-bold" : ""
          }`}
        >
          Trending
        </a>
        <a
          href="/admin/events"
          className={`mr-10 hover:text-blue-300 hover:underline transition-colors duration-500 ${
            active === "events" ? "underline text-blue-400 font-bold" : ""
          }`}
        >
          Events
        </a>
        <a
          href="/admin/news"
          className={`mr-10 hover:text-blue-300 hover:underline transition-colors duration-500 ${
            active === "news" ? "underline text-blue-400 font-bold" : ""
          }`}
        >
          News
        </a>
        <a
          href="/admin/resources"
          className={`hover:text-blue-300 hover:underline transition-colors duration-500 ${
            active === "resource" ? "underline text-blue-400 font-bold" : ""
          }`}
        >
          Resources
        </a>
      </div>
      <button onClick={handleLogout} className="text-red-400">
        Logout
      </button>
    </nav>
  );
}
