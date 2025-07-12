"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import AdminNav from "@/app/components/AdminNav";
import { adminApiCall } from "@/utils/adminApi";

const TABS = ["Hero", "Mission", "Vision", "Story", "Team", "Preview"];

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function AboutAdmin() {
  const [tab, setTab] = useState("Hero");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // About fields
  const [hero, setHero] = useState({ title: "", subtitle: "", bgColor: "#92751B", bgImage: "" });
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [story, setStory] = useState({ text: "", image: "" });
  const [team, setTeam] = useState([]);

  // Team editing state
  const [editingMember, setEditingMember] = useState(null);
  const [memberForm, setMemberForm] = useState({ name: "", role: "", image: "" });

  useEffect(() => {
    fetchAbout();
  }, []);

  async function fetchAbout() {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/about");
      const data = await res.json();
      setHero(data.hero || { title: "", subtitle: "", bgColor: "#92751B", bgImage: "" });
      setMission(data.mission || "");
      setVision(data.vision || "");
      setStory(data.story || { text: "", image: "" });
      setTeam(data.team || []);
    } catch (err) {
      setError("Failed to fetch about page data");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveAll(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      await adminApiCall("/api/about", {
        method: "POST",
        body: JSON.stringify({ hero, mission, vision, story, team }),
      });
      setSuccess("About page updated successfully!");
    } catch (err) {
      setError(err.message || "An error occurred while updating.");
    } finally {
      setIsLoading(false);
    }
  }

  // Team logic
  function handleEditMember(idx) {
    setEditingMember(idx);
    setMemberForm(team[idx]);
  }
  function handleDeleteMember(idx) {
    setTeam(team.filter((_, i) => i !== idx));
    setEditingMember(null);
    setMemberForm({ name: "", role: "", image: "" });
  }
  function handleAddOrUpdateMember(e) {
    e.preventDefault();
    if (!memberForm.name || !memberForm.role) return;
    if (editingMember !== null) {
      // Update
      setTeam(team.map((m, i) => (i === editingMember ? memberForm : m)));
    } else {
      // Add
      setTeam([...team, memberForm]);
    }
    setEditingMember(null);
    setMemberForm({ name: "", role: "", image: "" });
  }
  function handleMemberImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setMemberForm((f) => ({ ...f, image: reader.result }));
    };
    reader.readAsDataURL(file);
  }
  function handleStoryImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setStory((s) => ({ ...s, image: reader.result }));
    };
    reader.readAsDataURL(file);
  }
  function handleHeroBgImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setHero((h) => ({ ...h, bgImage: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <AdminNav active="about" />
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Manage About Us Page</h1>
        {error && <div className="bg-red-100 text-red-700 p-2 mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 mb-4">{success}</div>}
        <div className="mb-6 flex gap-2 border-b">
          {TABS.map((t) => (
            <button
              key={t}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${tab === t ? "border-brandGold text-brandGold" : "border-transparent text-gray-600"}`}
              onClick={() => setTab(t)}
              type="button"
            >
              {t}
            </button>
          ))}
        </div>
        <form onSubmit={handleSaveAll}>
          {tab === "Hero" && (
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
              <label className="font-semibold">Title</label>
              <input className="input" value={hero.title} onChange={e => setHero(h => ({ ...h, title: e.target.value }))} />
              <label className="font-semibold">Subtitle</label>
              <input className="input" value={hero.subtitle} onChange={e => setHero(h => ({ ...h, subtitle: e.target.value }))} />
              <label className="font-semibold">Background Color</label>
              <input type="color" value={hero.bgColor} onChange={e => setHero(h => ({ ...h, bgColor: e.target.value }))} />
              <label className="font-semibold">Background Image (optional)</label>
              <input type="file" accept="image/*" onChange={handleHeroBgImage} />
              {hero.bgImage && <img src={hero.bgImage} alt="bg preview" className="w-32 h-20 object-cover mt-2 rounded" />}
            </div>
          )}
          {tab === "Mission" && (
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
              <label className="font-semibold">Mission</label>
              <textarea className="input border border-gray-300 min-h-[100px]" value={mission} onChange={e => setMission(e.target.value)} />
            </div>
          )}
          {tab === "Vision" && (
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
              <label className="font-semibold">Vision</label>
              <textarea className="input border border-gray-300 min-h-[100px]" value={vision} onChange={e => setVision(e.target.value)} />
            </div>
          )}
          {tab === "Story" && (
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
              <label className="font-semibold">Story Text</label>
              <textarea className="input border border-gray-300 min-h-[100px]" value={story.text} onChange={e => setStory(s => ({ ...s, text: e.target.value }))} />
              <label className="font-semibold">Story Image (optional)</label>
              <input type="file" accept="image/*" onChange={handleStoryImage} />
              {story.image && <img src={story.image} alt="story preview" className="w-32 h-20 object-cover mt-2 rounded" />}
            </div>
          )}
          {tab === "Team" && (
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-6">
              <h2 className="font-semibold text-lg mb-2 text-black">Team Members</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {team.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-gray-50 p-3 rounded">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-14 h-14 rounded-full object-cover" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-brandGold flex items-center justify-center text-white text-xl font-bold">
                        {getInitials(member.name)}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-semibold">{member.name}</div>
                      <div className="text-sm text-gray-600">{member.role}</div>
                    </div>
                    <button type="button" className="text-blue-600 mr-2" onClick={() => handleEditMember(idx)}>Edit</button>
                    <button type="button" className="text-red-600" onClick={() => handleDeleteMember(idx)}>Delete</button>
                  </div>
                ))}
              </div>
              {/* Fix: Use div, not form, for Add/Edit Member */}
              <div className="flex flex-col gap-2 mt-4 bg-gray-100 p-4 rounded">
                <div className="flex gap-2 flex-col sm:flex-row">
                  <input className="input flex-1" placeholder="Name" value={memberForm.name} onChange={e => setMemberForm(f => ({ ...f, name: e.target.value }))} />
                  <input className="input flex-1" placeholder="Role" value={memberForm.role} onChange={e => setMemberForm(f => ({ ...f, role: e.target.value }))} />
                </div>
                <input type="file" accept="image/*" onChange={handleMemberImage} />
                {memberForm.image && <img src={memberForm.image} alt="preview" className="w-14 h-14 rounded-full object-cover mt-2" />}
                <button type="button" onClick={handleAddOrUpdateMember} className="bg-brandGold text-white px-4 py-2 rounded mt-2 w-fit self-end">
                  {editingMember !== null ? "Update Member" : "Add Member"}
                </button>
                {editingMember !== null && (
                  <button type="button" className="text-gray-500 underline mt-1 self-end" onClick={() => { setEditingMember(null); setMemberForm({ name: "", role: "", image: "" }); }}>Cancel</button>
                )}
              </div>
            </div>
          )}
          {tab === "Preview" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-8" style={{ background: hero.bgColor, backgroundImage: hero.bgImage ? `url(${hero.bgImage})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}>
                <div className="py-12 text-center">
                  <h1 className="text-4xl font-bold text-white mb-2">{hero.title}</h1>
                  <div className="text-lg text-white">{hero.subtitle}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h2 className="font-bold text-xl mb-2 text-black">Our Mission</h2>
                  <div className="text-gray-700">{mission}</div>
                </div>
                <div>
                  <h2 className="font-bold text-xl mb-2 text-black">Our Vision</h2>
                  <div className="text-gray-700">{vision}</div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center bg-gray-50 rounded-lg p-6 mb-8 gap-6">
                {story.image && <img src={story.image} alt="story" className="w-48 h-32 object-cover rounded" />}
                <div>
                  <h2 className="font-bold text-xl mb-2 text-black">Our Story</h2>
                  <div className="text-gray-700">{story.text}</div>
                </div>
              </div>
              <div>
                <h2 className="font-bold text-2xl mb-6 text-center text-black">Meet Our Team</h2>
                <div className="flex flex-wrap justify-center gap-8">
                  {team.map((member, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      {member.image ? (
                        <img src={member.image} alt={member.name} className="w-20 h-20 rounded-full object-cover mb-2" />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-brandGold flex items-center justify-center text-white text-2xl font-bold mb-2">
                          {getInitials(member.name)}
                        </div>
                      )}
                      <div className="font-semibold">{member.name}</div>
                      <div className="text-sm text-gray-600">{member.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="mt-8 flex justify-end">
          <button
            type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
                "Save All"
            )}
          </button>
          </div>
        </form>
      </main>
      <style jsx global>{`
        .input {
          @apply border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brandGold;
        }
      `}</style>
    </div>
  );
} 