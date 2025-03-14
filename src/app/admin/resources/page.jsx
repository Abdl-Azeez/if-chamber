"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/app/components/AdminNav";
import Image from "next/image";

export default function ResourcesAdmin() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    author: "",
    file: null,
    fileUrl: "",
    fileSize: "",
    fileType: "",
    category: "",
    source: "",
    thumbnail: "",
    thumbnailUrl: "",
    thumbnailType: "",
    hasThumbnail: false,
    visible: true,
  });
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    fetchResources();
  }, [page]);

  async function fetchResources() {
    const res = await fetch(`/api/resources?page=${page}&limit=5`);
    const data = await res.json();
    setResources(data.resources);
    setTotalPages(Math.ceil(data.total / 5) || 1);
  }

  async function handleSubmit(e) {
  e.preventDefault();
  setIsLoading(true);
    setError("");

  if (!form.category.trim()) {
    setCategoryError("Category is required.");
    return;
  }
    
  const token = localStorage.getItem("token");
  if (!token) {
    setMessage("Error: Unauthorized. Please login again.");
    setIsLoading(false);
    return;
  }

  try {
    const method = selectedId ? "PUT" : "POST";

    const body = {
      id: selectedId || null,
      title: form.title,
      description: form.description,
      author: form.author,
      category: form.category,
      source: form.source,
      visible: form.visible,

      // File information
      file: form.file || form.fileUrl, 
      fileUrl: form.fileUrl || "", 
      fileSize: form.fileSize || "",
      fileType: form.fileType || "",

      // Thumbnail
      thumbnail: form.thumbnail || form.thumbnailUrl,
      thumbnailUrl: form.thumbnailUrl || "", 
      thumbnailType: form.thumbnailType || "",
      hasThumbnail: form.hasThumbnail,
    };

    const response = await fetch("/api/resources", {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 401) {
          localStorage.removeItem("token"); // Clear token
          window.location.href = "/admin/login"; // Redirect

          throw new Error(`HTTP Error! Status: ${response.status}`);
        }
      throw new Error("Failed to submit resource")
      
    };

    setForm({
      title: "",
      description: "",
      author: "",
      file: null,
      fileUrl: "",
      fileSize: "",
      fileType: "",
      category: "",
      source: "",
      thumbnail: null,
      thumbnailUrl: "",
      thumbnailType: "",
      hasThumbnail: false,
      visible: true,
    });

    setSelectedId(null);
    fetchResources();
  } catch (err) {
    setError(err.message || "An error occurred while submitting.");
  } finally {
    setIsLoading(false);
    setCategoryError("");
  }
}

const categories = [
  "Template",
  "Standard",
  "Research",
  "Banking",
  "Capital Market",
];

  function handleEdit(resource) {
    setSelectedId(resource._id);
    setForm({
      title: resource.title,
      description: resource.description,
      author: resource.author,
      file: resource.file, 
      fileUrl: resource.fileUrl,
      fileSize: resource.fileSize,
      fileType: resource.fileType,
      category: resource.category,
      source: resource.source,
      thumbnail: resource.thumbnail, 
      thumbnailUrl: resource.thumbnail,
      thumbnailType: resource.thumbnailType,
      hasThumbnail: resource.hasThumbnail,
      visible: resource.visible,
    });
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/resources", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Failed to delete resource");

      fetchResources();
    } catch (err) {
      setError(err.message || "An error occurred while deleting.");
    } finally {
      setIsLoading(false);
    }
  }

  // Handle file upload (Resource & Thumbnail)
const handleFileUpload = (e, type) => {
  const file = e.target.files[0];
  if (!file) return;

  const fileSizeMB = file.size / (1024 * 1024); // Convert bytes to MB
  const formattedSize = fileSizeMB.toFixed(2) + " MB";
  const fileType = file.name.split(".").pop().toUpperCase();

  // Define size limits (Adjust as needed)
  const maxFileSize = 5; // Maximum file size for resources (5MB)
  const maxThumbnailSize = 2; // Maximum file size for thumbnails (2MB)

  if (type === "file") {
    if (fileSizeMB > maxFileSize) {
      setError(`File is too large. Maximum allowed size is ${maxFileSize}MB.`);
      return;
    }
    setError(""); // Clear error if valid

    setForm({
      ...form,
      file: file, // Store the actual file
      fileUrl: URL.createObjectURL(file), // Temporary preview URL
      fileSize: formattedSize,
      fileType,
    });
  } else {
    if (fileSizeMB > maxThumbnailSize) {
      setError(`Thumbnail is too large. Maximum allowed size is ${maxThumbnailSize}MB.`);
      return;
    }
    setError(""); // Clear error if valid

    // Convert to Base64 for thumbnail
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({
        ...form,
        thumbnail: reader.result, // Store base64 image
        thumbnailUrl: URL.createObjectURL(file), // Temporary preview URL
        thumbnailType: fileType,
        hasThumbnail: true,
      });
    };
    reader.readAsDataURL(file);
  }
};

const handleToggleVisibility = async (resourceId, newVisibility) => {
  try {
    // Call your API to update the visibility status
    const response = await fetch(`/api/resources/${resourceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ visible: newVisibility }),
    });

    if (response.ok) {
      // Update the local state to reflect the new visibility status
      setResources((prevResources) =>
        prevResources.map((resource) =>
          resource._id === resourceId
            ? { ...resource, visible: newVisibility }
            : resource
        )
      );

      // Show a success message
      setMessage({
        type: "success",
        text: `Resource visibility updated to ${newVisibility ? "visible" : "hidden"}.`,
      });
    } else {
      // Handle API errors
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update visibility");
    }
  } catch (error) {
    // Show an error message
    setMessage({
      type: "error",
      text: error.message || "An error occurred while updating visibility.",
    });
  }
};
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
  <AdminNav active="resources" />
  <main className="p-6 max-w-7xl mx-auto">
  <h1 className="text-3xl font-bold mb-8 text-gray-800">Manage Resources</h1>

  {/* Error Message */}
  {error && (
    <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-lg border border-red-200">
      {error}
    </div>
        )}
        
        {message && (
  <div
    className={`p-4 mb-6 rounded-lg border ${
      message.type === "success"
        ? "bg-green-100 text-green-700 border-green-200"
        : "bg-red-100 text-red-700 border-red-200"
    }`}
  >
    {message.text}
  </div>
)}

  {/* Form */}
  <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg mb-8">
    <div className="space-y-6">
      <input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        required
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        rows="4"
        required
      />
      <input
        type="text"
        placeholder="Author"
        value={form.author}
        onChange={(e) => setForm({ ...form, author: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        required={!form.source} 
      />
      <input
        type="text"
        placeholder="Source"
        value={form.source}
        onChange={(e) => setForm({ ...form, source: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        required={!form.author} 
      />

      <div>
      {/* <label className="block text-gray-700 mb-2">Category <span className="text-red-500">*</span></label> */}
      <div className="flex space-x-2">
        <select
          value={isAddingCategory ? "new" : form.category}
          onChange={(e) => {
            if (e.target.value === "new") {
              setIsAddingCategory(true);
              setForm({ ...form, category: "" });
            } else {
              setIsAddingCategory(false);
              setForm({ ...form, category: e.target.value });
            }
            setCategoryError("");
          }}
          className={`w-full p-3 border ${
            categoryError ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
          <option value="new">Add New Category</option>
        </select>

        {isAddingCategory && (
          <input
            type="text"
            placeholder="Enter new category"
            value={form.category}
            onChange={(e) => {
              setForm({ ...form, category: e.target.value });
              setCategoryError("");
            }}
            className={`w-full p-3 border ${
              categoryError ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
          />
        )}
      </div>

      {/* Show validation error */}
      {categoryError && <p className="text-red-500 text-sm mt-1">{categoryError}</p>}
    </div>

      {/* Visible Checkbox */}
      <div className="flex items-center space-x-2">
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={form.visible}
      onChange={(e) => setForm({ ...form, visible: e.target.checked })}
      className="sr-only" // Hide the default checkbox
    />
    <div
      className={`w-11 h-6 rounded-full transition-colors ${
        form.visible ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      {/* Toggle circle */}
      <div
        className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
          form.visible ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </div>
  </label>
  <span className="text-gray-700">Visible</span>
</div>

      {/* File Upload */}
      <div>
        <label className="block text-gray-700 mb-2">Upload Resource</label>
        <input
          type="file"
          onChange={(e) => handleFileUpload(e, "file")}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required={!form.fileUrl}
        />
        {form.fileUrl && (
          <p className="mt-2 text-sm text-gray-600">Current File: {form.fileUrl}</p>
        )}
      </div>

      {/* Thumbnail Upload */}
      <div>
        <label className="block text-gray-700 mb-2">Upload Thumbnail (Optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, "thumbnail")}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
        {form.thumbnail && (
          <Image
            src={form.thumbnail}
            alt="Thumbnail"
            width={150}
            height={150}
            className="mt-2 rounded-lg shadow-sm"
          />
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        {isLoading ? "Saving..." : selectedId ? "Update Resource" : "Add Resource"}
      </button>
    </div>
  </form>

  {/* Table */}
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-800 text-white">
          <th className="p-4 text-left">Thumbnail</th>
          <th className="p-4 text-left">Title</th>
          <th className="p-4 text-left">Author</th>
          <th className="p-4 text-left">Source</th>
          <th className="p-4 text-left">Category</th>
          <th className="p-4 text-left">Type</th>
          <th className="p-4 text-left">Visible</th>
          <th className="p-4 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {resources.map((resource) => (
          <tr key={resource._id} className="border-b hover:bg-gray-50 transition">
            <td className="p-4">
              {resource.hasThumbnail ? (
                <Image
                  src={resource.thumbnail}
                  alt="Thumbnail"
                  width={100}
                  height={100}
                  className="object-cover rounded"
                />
              ) : (
                <div className="w-[50px] h-[50px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                  N/A
                </div>
              )}
            </td>
            <td className="p-4">{resource.title}</td>
            <td className="p-4">{resource.author}</td>
            <td className="p-4">{resource.source}</td>
            <td className="p-4">{resource.category}</td>
            <td className="p-4">{resource.fileType}</td>
            <td className="p-4">
              <div
                onClick={() => handleToggleVisibility(resource._id, !resource.visible)}
                className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  resource.visible ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    resource.visible ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>
            </td>
            <td className="p-4 flex space-x-2">
              <button
                onClick={() => handleEdit(resource)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(resource._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Pagination */}
    <div className="flex justify-between mt-6">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
      >
        Previous
      </button>
      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
      >
        Next
      </button>
    </div>
  </div>
</main>
</div>
  );
}
