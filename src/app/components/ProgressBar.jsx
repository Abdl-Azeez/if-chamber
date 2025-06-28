"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function ProgressBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Reset progress when pathname changes (page has loaded)
    setProgress(0);
    setIsLoading(false);
  }, [pathname]);

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
      setProgress(0);
    };

    const handleComplete = () => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    };

    // Listen for navigation events
    const handleRouteChangeStart = () => {
      handleStart();
    };

    const handleRouteChangeComplete = () => {
      handleComplete();
    };

    // Add event listeners for navigation
    window.addEventListener('beforeunload', handleStart);
    
    // For Next.js App Router, we can use a custom approach
    // Since router events aren't directly available, we'll use a combination
    // of pathname changes and click detection
    
    return () => {
      window.removeEventListener('beforeunload', handleStart);
    };
  }, []);

  useEffect(() => {
    // Simulate progress increment during loading
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10 + 5;
        });
      }, 150);
    } else {
      // Ensure progress is reset to 0 when not loading
      setProgress(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  // Detect navigation clicks
  useEffect(() => {
    const handleClick = (e) => {
      const link = e.target.closest('a');
      if (link && link.href && link.href.startsWith(window.location.origin) && !link.href.includes('#') && !link.target) {
        setIsLoading(true);
        setProgress(0);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Reset progress when page is fully loaded
  useEffect(() => {
    const handleLoad = () => {
      if (isLoading) {
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
        }, 200);
      }
    };

    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, [isLoading]);

  if (!isLoading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div 
        className="h-1 transition-all duration-200 ease-out rounded-full"
        style={{ 
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #B59418 0%, #84670A 50%, #6B5500 100%)'
        }}
      />
    </div>
  );
} 