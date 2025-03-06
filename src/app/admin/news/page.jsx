"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";

const MDEditor = dynamic(() => import("react-mde"), { ssr: false });
import "react-mde/lib/styles/css/react-mde-all.css";
import AdminNav from "@/app/components/AdminNav";
import Image from "next/image";

// TODO:
// 1. Add pagination
// API SAMPLE
// export async function GET(req) {
//   await connectToDatabase();
//   const { searchParams } = new URL(req.url);
//   const id = searchParams.get("id");
//   if (id) {
//     const newsItem = await News.findById(id);
//     return Response.json({ news: newsItem });
//   }
//   const page = parseInt(searchParams.get("page")) || 1;
//   const limit = parseInt(searchParams.get("limit")) || 10;
//   const total = await News.countDocuments();
//   const news = await News.find()
//     .skip((page - 1) * limit)
//     .limit(limit)
//     .sort({ createdAt: -1 });
//   return Response.json({ news, total });
// }

// 2. Message for successful submission
// 3. Confirm before deleting
// 4. If file selected is not image, show error message

export default function NewsAdmin() {
  const [news, setNews] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    image: "",
    visible: true,
  });
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    const res = await fetch("/api/news");
    const data = await res.json();
    setNews(data.news);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true); // Start loading
    setError(""); // Clear previous errors

    try {
      const method = selectedId ? "PUT" : "POST";
      const body = selectedId ? { id: selectedId, ...form } : form;
      const response = await fetch("/api/news", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to submit news");
      }

      setForm({
        title: "",
        description: "",
        date: "",
        image: "",
        visible: true,
      });
      setSelectedId(null);
      fetchNews();
    } catch (err) {
      setError(err.message || "An error occurred while submitting the form.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  }

  function handleEdit(newsItem) {
    setSelectedId(newsItem._id);
    setForm({
      title: newsItem.title,
      description: newsItem.description,
      date: newsItem.date.split("T")[0],
      image: newsItem.image,
      visible: newsItem.visible,
    });
  }

  async function handleDelete(id) {
    setIsLoading(true); // Start loading
    setError(""); // Clear previous errors

    try {
      const response = await fetch("/api/news", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete news");
      }

      fetchNews();
    } catch (err) {
      setError(err.message || "An error occurred while deleting the news.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  }

  // Handle image file upload and convert to Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setError("File size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result });
      setError(""); // Clear any previous errors
    };
    reader.onerror = () => {
      setError("Failed to read the file.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <AdminNav active="news" />
      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Manage News</h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md mb-8"
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <MDEditor
              value={form.description}
              onChange={(val) => setForm({ ...form, description: val })}
              className="w-full"
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {form.image && (
              <Image
                src={form.image}
                alt="Preview"
                width={200}
                height={200}
                className="mt-2 object-cover rounded"
              />
            )}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={form.visible}
                onChange={(e) =>
                  setForm({ ...form, visible: e.target.checked })
                }
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span>Visible</span>
            </label>
            <button
              type="submit"
              disabled={isLoading} // Disable button when loading
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {selectedId ? "Updating..." : "Adding..."}
                </div>
              ) : selectedId ? (
                "Update News"
              ) : (
                "Add News"
              )}
            </button>
          </div>
        </form>

        {/* Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="w-full table-auto rounded-lg">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border p-4">Title</th>
                <th className="border p-4">Description</th>
                <th className="border p-4">Date</th>
                <th className="border p-4">Visible</th>
                <th className="border p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item) => (
                <tr key={item._id} className="border">
                  <td className="p-2 border">{item.title}</td>
                  <td className="p-2 border">
                    <ReactMarkdown>{item.description}</ReactMarkdown>
                  </td>
                  <td className="p-2 border">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 border text-center">
                    {item.visible ? (
                      <span className="text-green-600">✔</span>
                    ) : (
                      <span className="text-red-600">✖</span>
                    )}
                  </td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-green-500 hover:bg-green-900 text-white p-2 rounded ml-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 hover:bg-red-900 text-white p-2 rounded ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
