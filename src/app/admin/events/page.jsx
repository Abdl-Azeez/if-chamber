"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import ReactMde from "react-mde";
import remarkBreaks from "remark-breaks"; 
import remarkGfm from "remark-gfm"; 
import "react-mde/lib/styles/css/react-mde-all.css";
import ReactMarkdown from "react-markdown";
import AdminNav from "@/app/components/AdminNav";

export default function EventsDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedTab, setSelectedTab] = useState("write");

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    image: "",
    visible: true,
    theme: "",
    season: "",
  });

  const fetchEvents = async () => {
    const res = await fetch(`/api/events?page=${page}&limit=${limit}`);
    const data = await res.json();
    setEvents(data?.events || []);
    setTotal(data?.total || 0);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage("Error: Image size must be less than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () =>
        setNewEvent((prev) => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!newEvent.image) {
      setMessage("Error: Please upload an image.");
      return;
    }
    setLoading(true);

    const method = editEventId ? "PUT" : "POST";
    const endpoint = "/api/events";
    const token = localStorage.getItem("token");
    const body = editEventId ? { ...newEvent, id: editEventId } : newEvent;
    if (!token) {
      setMessage("Error: Unauthorized Please login again.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
if (!res.ok) {
      if (res.status === 401) {
          localStorage.removeItem("token"); // Clear token
          window.location.href = "/admin/login"; // Redirect

          throw new Error(`HTTP Error! Status: ${res.status}`);
        }
      throw new Error("Failed to submit resource")
      
    };
      if (res.ok) {
        setMessage(
          editEventId
            ? "Event updated successfully!"
            : "Event added successfully!"
        );
        setNewEvent({
          title: "",
          description: "",
          date: "",
          image: "",
          visible: true,
          theme: "",
          season: "",
        });
        setEditEventId(null);
        fetchEvents();
      } else {
        setMessage("Error: Something went wrong. Please try again.");
      }
    } catch (error) {
      setMessage("Error: Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
    fetchEvents();
  }, [message, page]);

  const handleDeleteEvent = async (id) => {
    const token = localStorage.getItem("token");
    await fetch("/api/events", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    fetchEvents();
  };

  const toggleVisibility = async (id) => {
    const event = events.find((e) => e._id === id);
    const token = localStorage.getItem("token");
    await fetch("/api/events", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, visible: !event.visible }),
    });
    fetchEvents();
  };

  const handleEdit = (event) => {
    setNewEvent(event);
    setEditEventId(event._id);
  };

  const currentDate = new Date().toISOString().split("T")[0];

  const sortedEvents = useCallback(() => {
    return events.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [events])();

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <AdminNav active="events" />
      <main className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Manage Events</h2>
        {message && (
          <p
            className={`mt-2 text-lg font-semibold ${
              message.startsWith("Error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-black space-y-4">
          <h3 className="text-xl font-semibold">
            {editEventId ? "Edit Event" : "Add Event"}
          </h3>
          <input
            type="text"
            placeholder="Title"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
            className="block w-full border p-2 mt-2 text-black rounded mb-2"
            required
          />
          {/* <textarea
          placeholder="Description"
          value={newEvent.description}
          onChange={(e) =>
            setNewEvent({ ...newEvent, description: e.target.value })
          }
          className="block w-full border p-2 mt-2 text-black rounded"
          required
        /> */}
          {/* ReactMde Markdown Editor */}
          <ReactMde
            value={newEvent.description}
            onChange={(value) =>
              setNewEvent({ ...newEvent, description: value })
            }
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={(markdown) =>
              Promise.resolve(<ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]}>{markdown}</ReactMarkdown>)
            }
            className="mt-2 text-black h-60"
          />
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            className="block w-full border p-2 mt-2 text-black rounded"
            required
          />
          <input
            type="text"
            placeholder="Example: What's Up Islamic Finance (optional)"
            value={newEvent.theme}
            onChange={(e) =>
              setNewEvent({ ...newEvent, theme: e.target.value })
            }
            className="block w-full border p-2 mt-2 text-black rounded"
          />
          <input
            type="text"
            placeholder="Example: Ramadam 2025 (optional)"
            value={newEvent.season}
            onChange={(e) =>
              setNewEvent({ ...newEvent, season: e.target.value })
            }
            className="block w-full border p-2 mt-2 text-black rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full border p-2 mt-2 rounded"
            required={!editEventId}
          />
          <label className="block mt-2">
            <input
              type="checkbox"
              checked={newEvent.visible}
              onChange={(e) =>
                setNewEvent({ ...newEvent, visible: e.target.checked })
              }
            />{" "}
            Visible
          </label>
          {newEvent.image && (
            <Image
              src={newEvent.image}
              alt="Preview"
              width={200}
              height={200}
              className="mt-2 object-cover rounded"
            />
          )}
          <button
            onClick={handleSubmit}
            className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin border-2 border-white border-t-transparent w-5 h-5 rounded-full inline-block"></span>
            ) : editEventId ? (
              "Update Event"
            ) : (
              "Add Event"
            )}
          </button>
        </div>

        <h3 className="text-2xl font-semibold mt-6">All Events</h3>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="w-full table-auto rounded-lg">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border p-4">Image</th>
                <th className="border p-4">Title</th>
                <th className="border p-4">Theme</th>
                <th className="border p-4">Season</th>
                <th className="border p-4">Date</th>
                <th className="border p-4">Period</th>
                <th className="border p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedEvents.map((event) => (
                <tr key={event._id} className="border">
                  <td className="border p-2">
                    <Image
                      src={event.image}
                      alt={event.title}
                      width={100}
                      height={100}
                      className="object-cover rounded"
                    />
                  </td>
                  <td className="border p-2">{event.title}</td>
                  <td className="border p-2">
                    {event?.theme ? event.theme : "----"}
                  </td>
                  <td className="border p-2">
                    {event?.season ? event.season : "-----"}
                  </td>
                  <td className="border p-2">
                    {new Date(event.date).toLocaleDateString()}
                  </td>
                  <td className="border p-2">
                    {event.date >= currentDate ? "Upcoming" : "Past"}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => toggleVisibility(event._id)}
                      className={`p-2 rounded ${
                        event.visible ? "bg-green-500" : "bg-gray-500"
                      }`}
                    >
                      {event.visible ? "Visible" : "Hidden"}
                    </button>
                    <button
                      onClick={() => handleEdit(event)}
                      className="bg-yellow-500 text-white p-2 rounded ml-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="bg-red-500 text-white p-2 rounded ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="p-2 bg-blue-500 text-white rounded disabled:invisible"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="p-2 bg-blue-500 text-white rounded disabled:invisible"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
