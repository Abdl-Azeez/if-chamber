"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }) {
  const router = useRouter();

  const handleLogout = () => {
    // Clear JWT from localStorage or cookies
    localStorage.removeItem("token"); // If using localStorage
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // If using cookies

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
      // router.push("/admin/login");
    } else if (token) {
      setIsAuthenticated(true);
    }
  }, [router]);

  // if (!isAuthenticated) return null;
  // else
  return (
    <div>
      {isAuthenticated &&
      router.pathname !== "/admin/signup" &&
      router.pathname !== "/admin/login" ? (
        <nav className="bg-gray-800 text-white p-4 flex justify-between">
          <div>
            <h2 className="text-xl">Admin Panel</h2>
            <a href="/dashboard/trending" className="mr-4">
              Trending
            </a>
            <a href="/dashboard/events">Events</a>
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
