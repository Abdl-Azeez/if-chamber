"use client";
import { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";

export default function AdminDashboard() {
  const [eventCount, setEventCount] = useState(0);
  const [trendingCount, setTrendingCount] = useState(0);

  useEffect(() => {
    fetch("/api/events/count")
      .then((res) => res.json())
      .then((data) => setEventCount(data.count));

    fetch("/api/trending/count")
      .then((res) => res.json())
      .then((data) => setTrendingCount(data.count));
  }, []);

  return (
    <div>
      <AdminNav />
      <main className="p-6">
        <h2 className="text-2xl font-bold my-6">Admin Dashboard</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Events Analytics Card */}
          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-lg font-semibold text-black">Total Events</h3>
            <p className="text-2xl font-bold text-teal-700">{eventCount}</p>
          </div>

          {/* Trending Content Analytics Card */}
          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-lg font-semibold text-black">
              Total Trending Content
            </h3>
            <p className="text-2xl font-bold text-teal-500">{trendingCount}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-6 flex gap-4">
          <a
            href="/admin/trending"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Manage Trending
          </a>
          <a
            href="/admin/events"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Manage Events
          </a>
        </div>
      </main>
    </div>
  );
}
