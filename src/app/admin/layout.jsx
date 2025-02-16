"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }) {
  const router = useRouter();

  const handleLogout = () => {
    // Clear JWT from localStorage or cookies
    localStorage.removeItem("token");

    // Redirect to login page
    router.push("/admin/login");
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (
      !token &&
      router.pathname !== "/admin/signup" &&
      router.pathname !== "/admin/login"
    ) {
      router.push("/admin/login");
    } else if (token) {
      setIsAuthenticated(true);
    }
  }, [router]);

  // if (!isAuthenticated) return null;
  // else
  return (
    <div>
      {
      router.pathname !== "/admin/signup" &&
      router.pathname !== "/admin/login" ? (
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <div>
            <a href="/admin" className="text-2xl mb-5">
              Admin Panel
            </a>
          </div>
          <div>
            <a
              href="/admin/trending"
              className="mr-10 hover:text-blue-300 hover:underline transition-colors duration-500"
            >
              Trending
            </a>
            <a
              href="/admin/events"
              className="hover:text-blue-300 hover:underline transition-colors duration-500"
            >
              Events
            </a>
          </div>
          <button onClick={handleLogout} className="text-red-400">
            Logout
          </button>
        </nav>
      ) : null}
      <main className="p-6">{children}</main>
    </div>
  );
}
