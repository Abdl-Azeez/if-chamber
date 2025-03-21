"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import AdminNav from "@/app/components/AdminNav";

export default function ManageTrending() {
  const [newTrend, setNewTrend] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
    linkTitle: "",
    position: "",
  });
  const [message, setMessage] = useState("");
  const [trendingList, setTrendingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editTrendId, setEditTrendId] = useState(null);

  useEffect(() => {
    fetchTrending();
  }, [message]);

  const fetchTrending = async () => {
    const res = await fetch("/api/trending");
    const data = await res.json();
    setTrendingList(data.sort((a, b) => a.position - b.position));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage("Error: Image size must be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewTrend((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Error: Unauthorized, Please login again.");
      setLoading(false);
      return;
    }
    if (!newTrend.image) {
      setMessage("Please upload an image.");
      setLoading(false);
      return;
    }
    const res = await fetch("/api/trending", {
      method: editTrendId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(
        editTrendId ? { ...newTrend, id: editTrendId } : newTrend
      ),
    });
    const data = await res.json();
    setMessage(data.message);
    if (res.ok) {
      if (res.status === 401) {
        localStorage.removeItem("token"); // Clear token
        window.location.href = "/admin/login"; // Redirect

        throw new Error(`HTTP Error! Status: ${res.status}`);
      }
      setMessage(
        editTrendId
          ? "Content updated successfully!"
          : "Content added successfully!"
      );
  
      setNewTrend({
        title: "",
        description: "",
        image: "",
        link: "",
        linkTitle: "",
        position: "",
      });
      setEditTrendId(null);
      fetchTrending();
    } else {
      setMessage("Error: Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleDeleteTrend = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Error: Unauthorized, Please login again.");
      setLoading(false);
      localStorage.removeItem("token"); // Clear token
      window.location.href = "/admin/login"; // Redirect

      return;
    }
    await fetch("/api/trending", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    fetchTrending();
  };

  const handleEdit = (trending) => {
    setNewTrend(trending);
    setEditTrendId(trending._id);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <AdminNav active="trending" />
      <main className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Manage Trending Content</h2>
        {message && (
          <p
            className={`mt-2 ${
              message.startsWith("Error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md mb-8 text-black space-y-4"
        >
          <h3 className="text-xl font-semibold text-black">
            {editTrendId ? "Edit Trending Content" : "Add Trending Content"}
          </h3>
          <input
            type="text"
            placeholder="Title"
            value={newTrend.title}
            onChange={(e) =>
              setNewTrend({ ...newTrend, title: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={newTrend.description}
            onChange={(e) =>
              setNewTrend({ ...newTrend, description: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          ></textarea>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border rounded"
            required={!editTrendId}
          />
          {newTrend.image && (
            <div className="mt-2">
              <Image
                src={newTrend.image}
                alt="Uploaded Image Preview"
                width={200}
                height={200}
                className="object-cover rounded"
              />
            </div>
          )}
          <input
            type="url"
            placeholder="Link"
            value={newTrend.link}
            onChange={(e) => setNewTrend({ ...newTrend, link: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Link Title (e.g. Read More)"
            value={newTrend.linkTitle}
            onChange={(e) =>
              setNewTrend({ ...newTrend, linkTitle: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Position"
            value={newTrend.position}
            onChange={(e) =>
              setNewTrend({ ...newTrend, position: e.target.value })
            }
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
            ) : editTrendId ? (
              "Update Trending Content"
            ) : (
              "Add Trending Content"
            )}
          </button>
        </form>

        <h2 className="text-2xl font-bold mt-8">Trending Content</h2>
        <table className="bg-white w-full mt-4 border-collapse border border-gray-300 text-black">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border p-4">Image</th>
              <th className="border p-4">Title</th>
              <th className="border p-4">Description</th>
              <th className="border p-4">Link</th>
              <th className="border p-4">Link Title</th>
              <th className="border p-4">Position</th>
              <th className="border p-4">Actions</th>
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
                <td className="border p-2">{item.title}</td>
                <td className="border p-2">{item.description}</td>
                <td className="border p-2">{item.link}</td>
                <td className="border p-2">{item.linkTitle}</td>
                <td className="border p-2">{item.position}</td>
                <td className="border p-2 flex min-h-32 items-center">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 text-white p-2 rounded ml-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTrend(item._id)}
                    className={`bg-red-500 text-white p-2 rounded ml-2 ${
                      item.position === 1 ? "hidden" : ""
                    }`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
