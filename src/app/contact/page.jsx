"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaHome } from "react-icons/fa";
import { Modal } from "../components/contactModal";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    comments: "",
  });

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = e.target;

    try {
      const response = await fetch("https://formsubmit.co/hazeezadediran@gmail.com.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Message sent successfully!");
        setFormData({ name: "", company: "", email: "", phone: "", comments: "" });
        setShowModal(true); // Show the modal on success
      } else {
        setMessage("Error sending message. Please try again.");
      }
    } catch (error) {
      setMessage("Error sending message. Please try again.");
    }

    setLoading(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage(null)
      }, 2000);
    }
  },[message])

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar isContact={true} />

      <main className="flex-grow">
        <div className="lg:h-80 relative flex justify-center flex-col bg-brandGold text-white px-16 pb-16 pt-4 text-center">
          <FaHome className="absolute top-10 left-14 text-xl text-white cursor-pointer hover:opacity-70" />
          <h1 className="text-4xl font-bold text-white">Contact Us</h1>
          <p className="text-white mt-2">
            To contact IFChamber, please complete the form below.
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <form onSubmit={handleSubmit} className="space-y-6 text-black">
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="basic" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-brandGold rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-brandGold rounded-md p-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-brandGold rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full border border-brandGold rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Comments*</label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-brandGold rounded-md p-2 h-32"
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="bg-brandGold text-white py-2 px-6 rounded-md hover:bg-opacity-90"
              >
                {loading ? "Sending..." : "Submit"}
              </button>
            </div>

            {message && (
              <p className={`mt-2 text-sm ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>
                {message}
              </p>
            )}
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-black">
            <div>
              <h3 className="text-lg font-semibold">Dubai</h3>
              <p>The Islamic Finance Chamber</p>
              <p>15 Sheikh Zayed Road, Business Bay, Dubai, UAE</p>
              <p className="font-semibold">Tel: +971 4 123 4567</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Abuja</h3>
              <p>The Islamic Finance Chamber</p>
              <p>
                22 Garki Crescent, Central Business District, Abuja, Nigeria
              </p>
              <p className="font-semibold">Tel: +234 809 123 4567</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Kuala Lumpur</h3>
              <p>The Islamic Finance Chamber</p>
              <p>88 Jalan Ampang, Golden Triangle, Kuala Lumpur, Malaysia</p>
              <p className="font-semibold">Tel: +60 3 9876 5432</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Muscat</h3>
              <p>The Islamic Finance Chamber</p>
              <p>10 Al Khuwair Street, Ruwi, Muscat, Oman</p>
              <p className="font-semibold">Tel: +968 24 567 890</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {showModal && (
        <Modal
          message="Thank you for contacting us! We will get back to you soon."
          onClose={closeModal}
        />
      )}
    </div>
  );
}