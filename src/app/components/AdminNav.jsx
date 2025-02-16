"use client";
import { useRouter } from "next/navigation";

export default function AdminNav({}) {
  const router = useRouter();

  const handleLogout = () => {
    // Clear JWT from localStorage or cookies
    localStorage.removeItem("token"); // If using localStorage
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // If using cookies

    // Redirect to login page
    router.push("/admin/login");
  };

  return (
    <div>
      <nav className="bg-gray-800 text-white p-4 flex justify-between">
        <div>
          <h2 className="text-xl">Admin Panel</h2>
          <a href="/trending" className="mr-4">
            Trending
          </a>
          <a href="/events">Events</a>
        </div>
        <button onClick={handleLogout} className="text-red-400">
          Logout
        </button>
      </nav>
    </div>
  );
}
