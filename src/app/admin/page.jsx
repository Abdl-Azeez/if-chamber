"use client";
import { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";
import { FaCalendarAlt, FaFire, FaNewspaper, FaBook, FaUserShield, FaImage, FaCrown } from "react-icons/fa";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    events: 0,
    trending: 0,
    news: 0,
    resources: 0,
    admins: 0,
    hero: 0,
    logos: 0,
  });
  const [recent, setRecent] = useState({ events: [], news: [], resources: [] });

  useEffect(() => {
    Promise.all([
      fetch("/api/events/count").then(res => res.json()),
      fetch("/api/trending/count").then(res => res.json()),
      fetch("/api/news/count").then(res => res.json()),
      fetch("/api/resources/count").then(res => res.json()),
      fetch("/api/admin/count").then(res => res.json()),
      fetch("/api/hero/count").then(res => res.json()),
      fetch("/api/logo/count").then(res => res.json()),
    ]).then(([events, trending, news, resources, admins, hero, logos]) => {
      setCounts({
        events: events.count,
        trending: trending.count,
        news: news.count,
        resources: resources.count,
        admins: admins.count,
        hero: hero.count,
        logos: logos.count,
      });
    });
    // Fetch recent activity
    Promise.all([
      fetch("/api/events").then(res => res.json()),
      fetch("/api/news").then(res => res.json()),
      fetch("/api/resources").then(res => res.json()),
    ]).then(([events, news, resources]) => {
      setRecent({
        events: (events.events || []).slice(0, 5),
        news: (news.news || []).slice(0, 5),
        resources: (resources.resources || []).slice(0, 5),
      });
    });
  }, []);

  const cards = [
    { label: "Total Events", value: counts.events, icon: <FaCalendarAlt className="text-3xl text-blue-500" />, color: "bg-blue-50" },
    { label: "Trending Content", value: counts.trending, icon: <FaFire className="text-3xl text-orange-500" />, color: "bg-orange-50" },
    { label: "News Articles", value: counts.news, icon: <FaNewspaper className="text-3xl text-green-600" />, color: "bg-green-50" },
    { label: "Resources", value: counts.resources, icon: <FaBook className="text-3xl text-purple-600" />, color: "bg-purple-50" },
    { label: "Admins", value: counts.admins, icon: <FaUserShield className="text-3xl text-gray-700" />, color: "bg-gray-100" },
    { label: "Hero Sections", value: counts.hero, icon: <FaCrown className="text-3xl text-yellow-500" />, color: "bg-yellow-50" },
    { label: "Logos", value: counts.logos, icon: <FaImage className="text-3xl text-pink-500" />, color: "bg-pink-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <main className="p-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold my-6 text-gray-900">Admin Analytics Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
          {cards.map((card, idx) => (
            <div key={idx} className={`rounded-xl shadow-md p-6 flex flex-col items-center ${card.color}`}>
              {card.icon}
              <div className="text-lg font-semibold mt-2 text-gray-800">{card.label}</div>
              <div className="text-3xl font-bold mt-1 text-gray-900">{card.value}</div>
            </div>
          ))}
        </div>
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Recent Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-blue-700">Recent Events</h4>
              <ul className="space-y-2">
                {recent.events.map(ev => (
                  <li key={ev._id} className="text-gray-700 text-sm border-b pb-1">{ev.title} <span className="text-xs text-gray-400">{ev.date ? new Date(ev.date).toLocaleDateString() : ''}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-green-700">Recent News</h4>
              <ul className="space-y-2">
                {recent.news.map(nw => (
                  <li key={nw._id} className="text-gray-700 text-sm border-b pb-1">{nw.title} <span className="text-xs text-gray-400">{nw.date ? new Date(nw.date).toLocaleDateString() : ''}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-purple-700">Recent Resources</h4>
              <ul className="space-y-2">
                {recent.resources.map(rs => (
                  <li key={rs._id} className="text-gray-700 text-sm border-b pb-1">{rs.title} <span className="text-xs text-gray-400">{rs.createdAt ? new Date(rs.createdAt).toLocaleDateString() : ''}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
