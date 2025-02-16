"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function ManageTrending() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [position, setPosition] = useState("");
  const [message, setMessage] = useState("");
  const [trendingList, setTrendingList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    const res = await fetch("/api/trending");
    const data = await res.json();
    setTrendingList(data.sort((a, b) => a.position - b.position));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage("Image size must be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setMessage("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Unauthorized");
      setLoading(false);
      return;
    }
    if (!image) {
      setMessage("Please upload an image.");
      setLoading(false);
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
    if (res.ok) {
      setTitle("");
      setDescription("");
      setImage("");
      setPosition("");
      fetchTrending();
    }
    setLoading(false);
  };

  const handleUpdate = async (id, updatedData) => {
    const res = await fetch(`/api/trending/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedData),
    });
    if (res.ok) fetchTrending();
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
      <form onSubmit={handleSubmit} className="mt-4 space-y-2 text-black">
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
          disabled={loading}
        >
          {loading ? (
            <span className="animate-spin border-2 border-white border-t-transparent w-5 h-5 rounded-full inline-block"></span>
          ) : (
            "Submit"
          )}
        </button>
      </form>

      <h2 className="text-2xl font-bold mt-8">Manage Trending Content</h2>
      <table className="w-full mt-4 border-collapse border border-gray-300 text-black">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="border p-2">Image</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Position</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {trendingList.map((item) => (
            <tr key={item._id} className="border">
              <td className="border p-2">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={100}
                  height={100}
                  className="object-cover rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) =>
                    handleUpdate(item._id, { ...item, title: e.target.value })
                  }
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border p-2">
                <textarea
                  value={item.description}
                  onChange={(e) =>
                    handleUpdate(item._id, {
                      ...item,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  value={item.position}
                  onChange={(e) =>
                    handleUpdate(item._id, {
                      ...item,
                      position: e.target.value,
                    })
                  }
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleUpdate(item._id, item)}
                  className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
