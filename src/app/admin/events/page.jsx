"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function EventsDashboard() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    image: "",
    type: "upcoming",
    visible: true,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await fetch("/api/events");
    const data = await res.json();
    setEvents(data);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 2MB for base64 conversion)
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size must be less than 2MB.");
        return;
      }

      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEvent({ ...newEvent, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.image) {
      alert("Please upload an image.");
      return;
    }

    await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    });
    setNewEvent({
      title: "",
      description: "",
      date: "",
      image: "",
      type: "upcoming",
      visible: true,
    });
    fetchEvents();
  };

  const handleDeleteEvent = async (id) => {
    await fetch("/api/events", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    fetchEvents();
  };

  const toggleVisibility = async (id) => {
    await fetch("/api/events/visibility", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    fetchEvents();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Manage Events</h2>

      {/* Add Event */}
      <div className="mt-4 p-4 border rounded">
        <h3 className="text-xl font-semibold">Add Event</h3>
        <input
          type="text"
          placeholder="Title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          className="block w-full border p-2 mt-2"
        />
        <textarea
          placeholder="Description"
          value={newEvent.description}
          onChange={(e) =>
            setNewEvent({ ...newEvent, description: e.target.value })
          }
          className="block w-full border p-2 mt-2"
        ></textarea>
        <input
          type="date"
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          className="block w-full border p-2 mt-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full border p-2 mt-2"
        />
        {newEvent.image && (
          <div className="mt-2">
            <Image
              src={newEvent.image}
              alt="Uploaded Image Preview"
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
        )}
        <select
          value={newEvent.type}
          onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
          className="block w-full border p-2 mt-2"
        >
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
        <button
          onClick={handleAddEvent}
          className="mt-4 bg-blue-500 text-white p-2 rounded"
        >
          Add Event
        </button>
      </div>

      {/* Event List */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">All Events</h3>
        {events.map((event) => (
          <div key={event._id} className="border p-4 mt-2 flex justify-between">
            <div>
              <h4 className="text-lg font-bold">{event.title}</h4>
              <p>{event.description}</p>
              <p className="text-gray-500">
                {new Date(event.date).toLocaleDateString()}
              </p>
              {event.image && (
                <div className="mt-2">
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={200}
                    height={200}
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleVisibility(event._id)}
                className={`p-2 rounded ${
                  event.visible ? "bg-green-500" : "bg-gray-500"
                }`}
              >
                {event.visible ? "Visible" : "Hidden"}
              </button>
              <button
                onClick={() => handleDeleteEvent(event._id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
