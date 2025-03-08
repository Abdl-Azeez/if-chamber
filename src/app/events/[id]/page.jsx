    "use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks"; 
import remarkGfm from "remark-gfm"; 
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return; 
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events?id=${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch event");

        setEvent(data.event);
      } catch (error) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

if (loading)
  return (
    <div className="min-h-screen bg-white">
      <Navbar isEvent={true} />
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-900">Loading event...</p>
        </div>
      </div>
      <Footer />
    </div>
  );

if (error)
  return (
    <div className="min-h-screen bg-white">
      <Navbar isEvent={true} />
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-red-500">⚠️</div>
          <p className="mt-4 text-lg text-red-500">Event not found</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
  return (
    <div className="min-h-screen bg-white">
  <Navbar isEvent={true} />
  <div className="bg-gray-100 min-h-screen">
    {/* Flex container for sidebar and main content */}
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-1/4 bg-white shadow py-12 lg:py-24 px-6 lg:pl-16">
        <h3 className="font-bold text-gray-900 text-lg lg:text-xl">Past Events</h3>
        <p className="text-gray-700 text-sm lg:text-base mt-2">{event.title}</p>
      </aside>

      {/* Event Content */}
      <main className="w-full lg:w-3/4 bg-white shadow py-12 lg:py-24 px-6 lg:pr-16 text-black">
        {/* Banner */}
        <div className="relative">
          <Image
  src={event.image}
  alt={event.title}
  width={800}
  height={600}
  className="w-full h-48 md:h-64 lg:h-96 object-cover rounded-lg"
/>
          <div className="absolute top-4 left-4 bg-yellow-700 text-white px-4 py-1 rounded">
            <p className="text-sm font-bold">{event.theme || "IFChamber"}</p>
          </div>
        </div>

        {/* Title & Date */}
        <h1 className="text-xl lg:text-2xl font-bold mt-8 lg:mt-16 pl-2 lg:pl-4">
          {event.title}
        </h1>
        <p className="text-gray-600 text-sm pl-2 lg:pl-4 mt-2">
          {new Date(event.date).toDateString()}
        </p>

        {/* Description using ReactMarkdown */}
        <div className="react-markdown mt-8 lg:mt-16 pl-2 lg:pl-4 text-gray-800 leading-relaxed text-justify">
          <ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]}>{event.description}</ReactMarkdown>
        </div>
      </main>
    </div>
  </div>
  <Footer />
</div>
  );
}
