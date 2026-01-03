import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { FiArrowLeft, FiGlobe, FiCopy, FiCheck } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function ShareTripPage() {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const linkRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [trip, setTrip] = useState(null);
  const [ownerName, setOwnerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  useEffect(() => {
    const fetchTripData = async () => {
      if (!tripId) return;

      try {
        const tripRef = doc(db, "trips", tripId);
        const tripSnap = await getDoc(tripRef);

        if (tripSnap.exists()) {
          const tripData = { id: tripSnap.id, ...tripSnap.data() };
          setTrip(tripData);

          // Fetch owner's profile data if userId exists
          if (tripData.userId) {
            const userRef = doc(db, "users", tripData.userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              setOwnerName(userSnap.data().displayName || "Anonymous User");
            } else {
              // Fallback: try to get from creatorName field or default
              setOwnerName(tripData.creatorName || "Anonymous User");
            }
          } else {
            setOwnerName(tripData.creatorName || "Anonymous User");
          }
        }
      } catch (error) {
        console.error("Error fetching trip:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId]);

  const shareOnWhatsApp = () => {
    const message = trip
      ? `Check out my trip "${trip.name}" on GlobeTrotter! ✈️🗺️
Trip: ${trip.name || "Untitled Trip"}
Dates: ${trip.startDate || "?"} – ${trip.endDate || "?"}
Budget: $${trip.budget || "?"}
${window.location.origin}/share/${tripId}`
      : "Check out my trip on GlobeTrotter!";
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/share/${tripId}`);
    setShowCopyMessage(true);
    setTimeout(() => setShowCopyMessage(false), 3000);
  };

  const calculateDuration = () => {
    if (!trip?.startDate || !trip?.endDate) return "N/A";
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} Days`;
  };

  const getCitiesCount = () => {
    return trip?.cities?.length || trip?.destinations?.length || 0;
  };

  const getActivitiesCount = () => {
    return trip?.activities?.length || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Trip Not Found</h2>
          <p className="text-gray-600">This trip doesn't exist or is no longer available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
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

      {/* HERO */}
      <div className="bg-gradient-to-r from-green-700 to-green-500 text-white p-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold">{trip.name || "Untitled Trip"}</h1>
            <p className="opacity-90 mt-2">
              Shared by {ownerName} • Created with GlobeTrotter
            </p>
          </div>
          <span className="bg-white/20 px-4 py-2 rounded-full self-start">
            {trip.status || "Upcoming Trip"}
          </span>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <button
        onClick={shareOnWhatsApp}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition"
      >
        <FaWhatsapp className="text-white text-2xl" />
      </button>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ["Duration", calculateDuration()],
              ["Cities", getCitiesCount()],
              ["Budget", trip.budget ? `$${trip.budget.toLocaleString()}` : "N/A"],
              ["Activities", getActivitiesCount()],
            ].map(([label, value]) => (
              <div
                key={label}
                className="bg-white rounded-xl p-4 text-center shadow"
              >
                <div className="text-gray-500 text-sm">{label}</div>
                <div className="text-2xl font-bold">{value}</div>
              </div>
            ))}
          </div>

          {/* OVERVIEW */}
          <div className="bg-white rounded-2xl p-6 shadow">
            <h2 className="text-xl font-bold mb-4">Trip Overview</h2>
            <p className="text-gray-600">
              {trip.description || "No description available for this trip."}
            </p>
          </div>

          {/* ITINERARY */}
          {trip.itinerary && trip.itinerary.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow">
              <h2 className="text-xl font-bold mb-6">Itinerary Preview</h2>
              <div className="space-y-6">
                {trip.itinerary.map((item, index) => (
                  <div key={index} className="border-l-4 border-green-600 pl-4">
                    <h3 className="font-bold text-lg">{item.city || item.destination}</h3>
                    <p className="text-sm text-gray-500">
                      {item.days || `Day ${index + 1}`}
                    </p>
                    {item.activities && (
                      <ul className="mt-2 text-gray-600 list-disc ml-4">
                        {item.activities.map((activity, actIndex) => (
                          <li key={actIndex}>{activity.name || activity}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-center">
              Share This Trip
            </h3>

            <input
              readOnly
              value={`${window.location.origin}/share/${tripId}`}
              className="w-full border rounded-lg px-4 py-3 pr-24 text-sm mb-4"
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
  );
}
