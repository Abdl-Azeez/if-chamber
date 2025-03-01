"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import UnderConstruction from "./components/UnderConstruction";

export default function Custom404() {
  const pathname = usePathname(); // Get current path

  const comingSoonPages = [
    "/opportunities",
    "/expert-community",
    "/community",
    "/resources",
  ];

  const isComingSoon = comingSoonPages.includes(pathname);

  useEffect(() => {
    if (!isComingSoon) {
      window.location.href = "/"; // Redirect using window.location
    }
  }, [isComingSoon]);

  if (isComingSoon) {
    return <UnderConstruction />;
  }

  return <div>Redirecting...</div>;
}
