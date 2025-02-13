"use client";
import { useState } from "react";

export default function ManageTrending() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [position, setPosition] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return setMessage("Unauthorized");

    const res = await fetch("/api/trending/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, image, position }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Add Trending Content</h2>
      {message && <p className="text-green-500">{message}</p>}
      <form onSubmit={handleSubmit} className="mt-4 space-y-2">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        ></textarea>
        <input
          type="text"
          placeholder="Base64 Image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
