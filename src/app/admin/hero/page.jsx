"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import AdminNav from "@/app/components/AdminNav";

export default function HeroAdmin() {
  const [heroes, setHeroes] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    buttons: [],
    visible: true,
    textColor: "#000000"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    fetch("/api/hero")
      .then((res) => res.json())
      .then((data) => setHeroes(data.heroes))
      .catch((err) => setError("Failed to fetch hero sections"))
      .finally(() => setLoading(false));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const method = form._id ? "PUT" : "POST";
    try {
      await fetch("/api/hero", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form._id ? { id: form._id, ...form } : form),
      });
      setForm({
        title: "",
        description: "",
        image: "",
        buttons: [],
        visible: true,
        textColor: "#000000",
      });
      fetchHeroes();
    } catch (err) {
      setError("Failed to submit hero section");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hero) => {
    setForm({
      ...hero,
      textColor: hero.textColor || "#000000" // Default to black if no textColor is set
    });
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError("");
    try {
      await fetch("/api/hero", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchHeroes();
    } catch (err) {
      setError("Failed to delete hero section", err);
      fetchHeroes();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav active="hero" />
      <main className="p-6 text-black max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Manage Hero Sections</h1>

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
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />

            <input
              type="file"
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
            {/* Buttons Section */}
            <div className="space-y-2">
              {form.buttons.map((button, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Button Label"
                    value={button.label}
                    onChange={(e) => {
                      const updatedButtons = [...form.buttons];
                      updatedButtons[index].label = e.target.value;
                      setForm({ ...form, buttons: updatedButtons });
                    }}
                    className="w-1/3 p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Button Link"
                    value={button.link}
                    onChange={(e) => {
                      const updatedButtons = [...form.buttons];
                      updatedButtons[index].link = e.target.value;
                      setForm({ ...form, buttons: updatedButtons });
                    }}
                    className="w-1/3 p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="color"
                    value={button.color}
                    onChange={(e) => {
                      const updatedButtons = [...form.buttons];
                      updatedButtons[index].color = e.target.value;
                      setForm({ ...form, buttons: updatedButtons });
                    }}
                    className="w-12 h-10 border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setForm({
                        ...form,
                        buttons: form.buttons.filter((_, i) => i !== index),
                      });
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded-md"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    buttons: [
                      ...form.buttons,
                      { label: "", link: "", color: "#000000" },
                    ],
                  })
                }
                className="bg-green-500 text-white px-3 py-1 rounded-md"
              >
                + Add Button
              </button>
            </div>
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
           
            <label className="flex items-center space-x-2 cursor-pointer mt-2">
             <input
                    type="color"
                    value={form.textColor}
                    onChange={(e) => {
                      setForm({ ...form, textColor: e.target.value });
                    }}
                    className="w-12 h-10 border border-gray-300 rounded-md mr-2"
            />
            Text Color
          </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              {loading ? (
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
                  {form._id ? "Updating..." : "Adding..."}
                </div>
              ) : form._id ? (
                "Update Hero Section"
              ) : (
                "Add Hero Section"
              )}
            </button>
          </div>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center p-6">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
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
          </div>
        )}

        {/* Hero Sections List */}
        {heroes?.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ul className="space-y-4">
              {heroes.map((hero) => (
                <li key={hero._id} className="border-b pb-4">
                  <h3 className="text-xl font-bold mb-2" style={{ color: hero.textColor }}>{hero.title}</h3>
                  {hero.image && (
                    <Image
                      src={hero.image}
                      alt={hero.title}
                      width={200}
                      height={200}
                      className="w-48 h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <p className="text-gray-700 mb-4" style={{ color: hero.textColor }}>{hero.description}</p>
                  {/* Display Buttons if Available */}
                  {hero.buttons?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hero.buttons.map((button, index) => (
                        <a
                          key={index}
                          href={button.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-4 rounded-md text-white"
                          style={{ backgroundColor: button.color }}
                        >
                          {button.label}
                        </a>
                      ))}
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(hero)}
                      className="bg-blue-600 text-white py-1 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(hero._id)}
                      className="bg-red-600 text-white py-1 px-4 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
