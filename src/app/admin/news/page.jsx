"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks"; 
import remarkGfm from "remark-gfm"; 
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import AdminNav from "@/app/components/AdminNav";
import Image from "next/image";

export default function NewsAdmin() {
  const [news, setNews] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    image: "",
    visible: true,
    showInHero: false, 
    source: "IFChamber"
  });
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
    const [selectedTab, setSelectedTab] = useState("write");

  useEffect(() => {
    fetchNews();
  }, [page]);

   async function fetchNews() {
     const res = await fetch(`/api/news?page=${page}&limit=5`);
     const data = await res.json();
     setNews(data.news);
     setTotalPages(Math.ceil(data.total / 5)=== 0 ? 1 : Math.ceil(data.total / 5));
   }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true); 
    setError(""); 
    setSuccess("");

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
        showInHero: false,
        source: "IFChamber"
      });
      setSelectedId(null);
      fetchNews();
    } catch (err) {
      setError(err.message || "An error occurred while submitting the form.");
    } finally {
      setIsLoading(false); 
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
      showInHero: newsItem.showInHero,
      source: "IFChamber"
    });
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this news item?")) return;
    setIsLoading(true); 
    setError(""); 

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
      setIsLoading(false); 
    }
  }

  // Handle image file upload and convert to Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setError("File size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result });
      setError(""); 
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

        {error && <div className="bg-red-100 text-red-700 p-2 mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 mb-4">{success}</div>}


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
            <ReactMde
              value={form.description}
              onChange={(val) => setForm({ ...form, description: val })}
              selectedTab={selectedTab}
                          onTabChange={setSelectedTab}
                          generateMarkdownPreview={(markdown) =>
                            Promise.resolve(<ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]}>{markdown}</ReactMarkdown>)
                          }
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
            <label className="flex items-center space-x-2 cursor-pointer">
  <div className="relative">
    <input
      type="checkbox"
      checked={form.showInHero}
      onChange={(e) => setForm({ ...form, showInHero: e.target.checked })}
      className="sr-only" // Hide the default checkbox
    />
    <div className="w-6 h-6 bg-white border-2 border-blue-600 rounded-md flex items-center justify-center transition-colors duration-200">
      {form.showInHero && (
        <svg
          className="w-4 h-4 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </div>
  </div>
  <span className="text-gray-700">Show in Hero Page</span>
</label>

<label className="flex items-center space-x-2 cursor-pointer">
  <div className="relative">
    <input
      type="checkbox"
      checked={form.visible}
      onChange={(e) => setForm({ ...form, visible: e.target.checked })}
      className="sr-only" // Hide the default checkbox
    />
    <div className="w-6 h-6 bg-white border-2 border-blue-600 rounded-md flex items-center justify-center transition-colors duration-200">
      {form.visible && (
        <svg
          className="w-4 h-4 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </div>
  </div>
  <span className="text-gray-700">Visible</span>
</label>
            <button
              type="submit"
              disabled={isLoading} 
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
                <th className="border p-4">Show in Hero Page</th>
        <th className="border p-4">Visible</th>
        <th className="border p-4">Actions</th>
      </tr>
    </thead>
    <tbody>
      {news.map((item) => (
        <tr key={item._id} className="border">
          <td className="p-2 border">{item.title}</td>
          <td className="p-2 border max-h-32 overflow-y-auto">
  <div className="line-clamp-4">
    <ReactMarkdown>{item.description}</ReactMarkdown>
  </div>
</td>
          <td className="p-2 border">
            {new Date(item.date).toLocaleDateString()}
          </td>
          <td className="p-2 border text-center">
  {item.showInHero ? (
    <span className="text-green-600">
      <svg
        className="w-6 h-6 mx-auto"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    </span>
  ) : (
    <span className="text-red-600">
      <svg
        className="w-6 h-6 mx-auto"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </span>
  )}
</td>
<td className="p-2 border text-center">
  {item.visible ? (
    <span className="text-green-600">
      <svg
        className="w-6 h-6 mx-auto"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    </span>
  ) : (
    <span className="text-red-600">
      <svg
        className="w-6 h-6 mx-auto"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </span>
  )}
</td>
          <td className="p-2 border space-x-2 flex items-center justify-content min-h-[120px]">
            <button
              onClick={() => handleEdit(item)}
              className="bg-green-500 hover:bg-green-700 text-white p-2 rounded transition-colors duration-200"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item._id)}
              className="bg-red-500 hover:bg-red-700 text-white p-2 rounded transition-colors duration-200"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Pagination */}
  <div className="flex justify-between items-center mt-6">
    <button
      onClick={() => setPage(page - 1)}
      disabled={page === 1}
      className={`flex items-center justify-center px-4 py-2 text-sm font-medium text-white ${
        page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
      } rounded-md transition-colors duration-200`}
    >
      Previous
    </button>
    <span className="text-sm text-gray-700">
      Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span>
    </span>
    <button
      onClick={() => setPage(page + 1)}
      disabled={page === totalPages}
      className={`flex items-center justify-center px-4 py-2 text-sm font-medium text-white ${
        page === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
      } rounded-md transition-colors duration-200`}
    >
      Next
    </button>
  </div>
</div>
      </main>
    </div>
  );
}
