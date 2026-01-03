import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiGlobe, FiCopy, FiCheck } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function ShareTripPage() {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  const shareOnWhatsApp = () => {
    const message = `Check out my Europe trip on GlobeTrotter! ✈️🗺️
Trip: Europe Adventure 2024
Dates: March 15–30, 2024
Budget: $3,500
https://globetrotter.app/trip/europe-adventure-2024`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(
      "https://globetrotter.app/trip/europe-adventure-2024"
    );
    setShowCopyMessage(true);
    setTimeout(() => setShowCopyMessage(false), 3000);
  };

  useEffect(() => {
    console.log("Shared Trip Page Loaded for trip:", tripId);
  }, [tripId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-green-600"
              >
                <FiArrowLeft className="text-xl" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <FiGlobe className="text-white" />
                </div>
                <span className="text-xl font-bold text-green-600">GlobeTrotter</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-gray-700 hover:text-green-600"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/my-trips')}
                className="px-4 py-2 text-gray-700 hover:text-green-600"
              >
                My Trips
              </button>
              <button 
                onClick={() => navigate('/create-trip')}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create Trip
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* WhatsApp Floating Button */}
        <button
          onClick={shareOnWhatsApp}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition"
        >
          <FaWhatsapp className="text-white text-2xl" />
        </button>

        {/* Header */}
        <header className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-8 text-white mb-10">
          <h1 className="text-4xl font-bold">Europe Adventure 2024</h1>
          <p className="opacity-90 mt-2">
            16-day journey across Europe • Shared by John Doe
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Budget", value: "$3,500" },
            { label: "Daily Avg", value: "$219" },
            { label: "Activities", value: "24" },
            { label: "Flight Hours", value: "18" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow-lg flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Trip Overview</h2>
              <p className="text-gray-600">
                Explore Paris, Rome, Barcelona and Amsterdam in this perfectly
                planned Europe itinerary.
              </p>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Itinerary Preview</h2>
              <ul className="space-y-3">
                <li>🇫🇷 Paris – Eiffel Tower, Louvre</li>
                <li>🇮🇹 Rome – Colosseum, Vatican</li>
                <li>🇪🇸 Barcelona – City tour</li>
                <li>🇳🇱 Amsterdam – Canals</li>
              </ul>
            </section>
          </div>

          {/* Right */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-center">
                Share This Trip
              </h3>

              <input
                readOnly
                value="https://globetrotter.app/trip/europe-adventure-2024"
                className="w-full p-3 border rounded-lg text-sm mb-4"
              />

              {showCopyMessage && (
                <p className="text-green-600 text-sm text-center mb-2 flex items-center justify-center gap-2">
                  <FiCheck /> Link copied!
                </p>
              )}

              <button
                onClick={copyLink}
                className="w-full bg-green-600 text-white py-3 rounded-xl mb-4 hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <FiCopy /> Copy Link
              </button>

              <button
                onClick={shareOnWhatsApp}
                className="w-full bg-green-500 text-white py-3 rounded-xl hover:opacity-90 flex items-center justify-center gap-2"
              >
                <FaWhatsapp /> Share on WhatsApp
              </button>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-2">Create Your Own Trip</h3>
              <p className="opacity-90 mb-4">
                Plan & share trips with GlobeTrotter
              </p>
              <button 
                onClick={() => navigate('/create-trip')}
                className="w-full bg-white text-green-600 py-3 rounded-xl font-semibold hover:bg-gray-100"
              >
                Sign Up Free
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-600">
          © 2024 GlobeTrotter. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
