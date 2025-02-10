"use client";
import { useState, useEffect } from "react";

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

  const handleAddEvent = async () => {
    await fetch("/api/events", {
      method: "POST",
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
      body: JSON.stringify({ id }),
    });
    fetchEvents();
  };

  const toggleVisibility = async (id) => {
    await fetch("/api/events/visibility", {
      method: "PATCH",
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
          type="text"
          placeholder="Image (Base64)"
          value={newEvent.image}
          onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
          className="block w-full border p-2 mt-2"
        />
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
