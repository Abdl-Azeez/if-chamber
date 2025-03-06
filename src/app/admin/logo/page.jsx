"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import AdminNav from "@/app/components/AdminNav";

export default function ManageLogo() {
  const [logos, setLogos] = useState({ dashboard: null, site: null });
  const [images, setImages] = useState({ dashboard: "", site: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    const res = await fetch("/api/logo");
    const data = await res.json();
    const logoData = {
      dashboard: data.find((logo) => logo.type === "dashboard") || null,
      site: data.find((logo) => logo.type === "site") || null,
    };
    setLogos(logoData);
  };

  const handleImageUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage("Image size must be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => ({ ...prev, [type]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    if (!images[type]) {
      setMessage("Please upload an image.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/logo", {
      method: logos[type] ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: images[type], type }),
    });

    if (res.ok) {
      setMessage(`${type} logo updated successfully!`);
      fetchLogos();
    } else {
      setMessage("Error updating logo.");
    }
    setLoading(false);
  };

  const handleDelete = async (type) => {
    setLoading(true);
    const res = await fetch("/api/logo", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });

    if (res.ok) {
      setLogos((prev) => ({ ...prev, [type]: null }));
      setMessage(`${type} logo deleted successfully.`);
    } else {
      setMessage("Error deleting logo.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <AdminNav active="logo" />
      <main className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold">Manage Logos</h2>
        {message && (
          <p
            className={`mt-2 ${
              message.includes("Error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}

        {["dashboard", "site"].map((type) => (
          <div key={type} className="mt-6">
            <h3 className="text-xl font-bold">
              {type.charAt(0).toUpperCase() + type.slice(1)} Logo
            </h3>
            <form
              onSubmit={(e) => handleSubmit(e, type)}
              className="mt-4 space-y-2"
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, type)}
                className="w-full p-2 border rounded"
                required
              />
              {images[type] && (
                <div className="mt-2">
                  <Image
                    src={images[type]}
                    alt={`${type} Logo Preview`}
                    width={150}
                    height={150}
                    className="rounded"
                  />
                </div>
              )}
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : logos[type]
                  ? "Update Logo"
                  : "Upload Logo"}
              </button>
            </form>

            {logos[type] && (
              <div className="mt-6">
                <h4 className="text-lg font-bold">
                  Current {type.charAt(0).toUpperCase() + type.slice(1)} Logo
                </h4>
                <Image
                  src={logos[type].image}
                  alt={`Current ${type} Logo`}
                  width={150}
                  height={150}
                  className="rounded"
                />
                <button
                  onClick={() => handleDelete(type)}
                  className="bg-red-500 text-white p-2 rounded mt-2 hover:bg-red-600"
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete Logo"}
                </button>
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}
