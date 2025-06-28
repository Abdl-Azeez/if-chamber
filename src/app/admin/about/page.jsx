"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import AdminNav from "@/app/components/AdminNav";
import { adminApiCall } from "@/utils/adminApi";

export default function AboutAdmin() {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedTab, setSelectedTab] = useState("write");

  useEffect(() => {
    fetchDescription();
  }, []);

  async function fetchDescription() {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/about");
      const data = await res.json();
      setDescription(data.description || "");
    } catch (err) {
      setError("Failed to fetch description");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    
    try {
      await adminApiCall("/api/about", {
        method: "POST",
        body: JSON.stringify({ description }),
      });
      setSuccess("Description updated successfully!");
    } catch (err) {
      setError(err.message || "An error occurred while updating.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <AdminNav active="about" />
      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Manage About Us Description</h1>
        {error && <div className="bg-red-100 text-red-700 p-2 mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 mb-4">{success}</div>}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <ReactMde
            value={description}
            onChange={setDescription}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={(markdown) =>
              Promise.resolve(
                <ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]}>{markdown}</ReactMarkdown>
              )
            }
            className="w-full"
          />
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              "Save Description"
            )}
          </button>
        </form>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Preview</h2>
          <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]}>{description}</ReactMarkdown>
          </div>
        </div>
      </main>
    </div>
  );
} 