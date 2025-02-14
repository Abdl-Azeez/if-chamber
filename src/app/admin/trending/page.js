"use client";
import { useState } from "react";
import Image from "next/image";

export default function ManageTrending() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [position, setPosition] = useState("");
  const [message, setMessage] = useState("");

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 2MB for base64 conversion)
      if (file.size > 2 * 1024 * 1024) {
        setMessage("Image size must be less than 2MB.");
        return;
      }

      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Set base64 image
        setMessage(""); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return setMessage("Unauthorized");

    if (!image) {
      setMessage("Please upload an image.");
      return;
    }

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

    // Clear form after successful submission
    if (res.ok) {
      setTitle("");
      setDescription("");
      setImage("");
      setPosition("");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Add Trending Content</h2>
      {message && (
        <p
          className={`mt-2 ${
            message.startsWith("Error") ? "text-red-500" : "text-green-500"
          }`}
        >
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="mt-4 space-y-2">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        ></textarea>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full p-2 border rounded"
          required
        />
        {image && (
          <div className="mt-2">
            <Image
              src={image}
              alt="Uploaded Image Preview"
              width={200}
              height={200}
              className="object-cover rounded"
            />
          </div>
        )}
        <input
          type="number"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
