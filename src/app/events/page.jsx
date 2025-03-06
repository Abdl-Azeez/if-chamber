"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// TODO:
// 1. Show Message if no events
export default function EventsPage() {
  const [events, setEvents] = useState({ past: [], upcoming: [] });
  const [activeTab, setActiveTab] = useState("upcoming");
  const [bannerEvent, setBannerEvent] = useState(null);
  const [pastPage, setPastPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [hasMorePast, setHasMorePast] = useState(true);
  const [hasMoreUpcoming, setHasMoreUpcoming] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events?page=1&limit=10");
        const data = await response.json();

        const now = new Date();
        const past = [];
        const upcoming = [];

        data.events
          .filter((event) => event.visible)
          .forEach((event) => {
            const eventDate = new Date(event.date);
            if (eventDate >= now) {
              upcoming.push(event);
            } else {
              past.push(event);
            }
          });

        upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
        past.sort((a, b) => new Date(b.date) - new Date(a.date));

        setBannerEvent(upcoming.length ? upcoming[0] : past[0] || null);
        setEvents({ past, upcoming });
        setHasMorePast(data.total > 10);
        setHasMoreUpcoming(data.total > 10);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);
  const loadMoreEvents = async (type) => {
    try {
      const page = type === "past" ? pastPage + 1 : upcomingPage + 1;
      const response = await fetch(`/api/events?page=${page}&limit=10`);
      const data = await response.json();
      const filteredEvents = data.events.filter((event) => event.visible);

      if (filteredEvents.length > 0) {
        setEvents((prev) => ({
          ...prev,
          [type]: [...prev[type], ...filteredEvents],
        }));
        if (type === "past") setPastPage(page);
        else setUpcomingPage(page);
      } else {
        if (type === "past") setHasMorePast(false);
        else setHasMoreUpcoming(false);
      }
    } catch (error) {
      console.error(`Error fetching more ${type} events:`, error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar isEvent={true} />
      <div className="bg-gray-100 min-h-screen pb-28">
        {bannerEvent && (
          <div
            className="relative w-full h-[40dvh] sm:h-[50dvh] md:h-[60dvh] flex flex-col items-center justify-center bg-cover bg-center px-4"
            style={{ backgroundImage: `url(/eventBannerBg.png)` }}
          >
            <div className="flex flex-col items-center bg-white bg-opacity-60 px-6 sm:px-12 py-6 sm:py-8 text-center shadow-lg relative">
              <div className="bg-brandGold text-white px-6 sm:px-12 py-2 rounded-tl-lg rounded-tr-lg flex items-center space-x-2 sm:space-x-3">
                {bannerEvent?.theme ? <div className="text-center">
                  <p className="text-sm sm:text-lg font-semibold">
                    {bannerEvent?.theme}
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-yellow-300">
                    {bannerEvent?.season ? bannerEvent?.season : ''}
                  </p>
                </div>
                  :null}
              </div>

              <h2 className="text-lg sm:text-2xl w-5/6 font-bold text-gray-900 mt-4 sm:mt-8">
                {bannerEvent.title}
              </h2>
              <p className="text-sm sm:text-lg font-semibold text-gray-700 mt-4 sm:mt-8">
                {new Date(bannerEvent.date).toDateString()}
              </p>
                      </div>
                      <Link href={`/events/${bannerEvent._id}`} passHref>
            <button className="mt-6 sm:mt-8 bg-brandGold text-white px-8 sm:px-12 py-4 sm:py-6 hover:bg-yellow-600 transition-all duration-300 ease-in-out">
              More Details
                          </button>
                          </Link>
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6 py-10">
          <div className="flex space-x-4 sm:space-x-6 border-b mb-6">
            <button
              className={`pb-2 ${
                activeTab === "upcoming"
                  ? "border-b-2 border-brandGold text-brandGold"
                  : "text-gray-700 hover:text-brandGold transition-all duration-300 ease-linear"
              }`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming Events
            </button>
            <button
              className={`pb-2 ${
                activeTab === "past"
                  ? "border-b-2 border-brandGold text-brandGold"
                  : "text-gray-700 hover:text-brandGold transition-all duration-300 ease-linear"
              }`}
              onClick={() => setActiveTab("past")}
            >
              Past Events
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {(activeTab === "past" ? events.past : events.upcoming).map(
                (event) => (
                    <Link key={event._id} href={`/events/${event._id}`} passHref>
                <div
                  
                  className="cursor-pointer bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 ease-in-out"
                >
                  <div className="relative w-full h-48 sm:h-64 overflow-hidden rounded-lg">
                    <Image
                      src={event.image}
                      alt={event.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="text-base sm:text-lg font-bold text-brandGold">
                      {event.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {new Date(event.date).toDateString()}
                    </p>
                  </div>
                        </div>
                        </Link>
              )
            )}
          </div>
          {(activeTab === "past" && hasMorePast) ||
          (activeTab === "upcoming" && hasMoreUpcoming) ? (
            <button
              className="mt-6 px-8 sm:px-12 py-4 sm:py-6 bg-brandGold text-white"
              onClick={() => loadMoreEvents(activeTab)}
            >
              See More Events &rarr;
            </button>
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  );
}
