"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSignup() {
  const [admin, setAdmin] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(admin),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Admin created successfully. Redirecting to login...");
      router.push("/admin/login");
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 shadow-md rounded w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-800">Admin Sign-Up</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          className="block w-full p-2 border rounded mb-3"
          value={admin.username}
          onChange={(e) => setAdmin({ ...admin, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="block w-full p-2 border rounded mb-3"
          value={admin.password}
          onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
          required
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
}
