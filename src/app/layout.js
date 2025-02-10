"use client";
import { usePathname } from "next/navigation";
import "./globals.css";
import Navbar from "./components/Navbar";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/dashboard");

  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        {isAdminRoute ? (
          <>{children} </>
        ) : (
          <>
            <Navbar />
            <main className="pt-16">{children}</main>
          </>
        )}
      </body>
    </html>
  );
}
