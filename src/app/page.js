"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch("/api/rss")
      .then((res) => res.json())
      .then((data) => setNews(data));
  }, []);

  return (
    <div>
      <h2>Latest Islamic Finance News</h2>
      <ul>
        {news.map((article, index) => (
          <li key={index}>
            <a href={article.link} target="_blank" rel="noopener noreferrer">
              {article.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
