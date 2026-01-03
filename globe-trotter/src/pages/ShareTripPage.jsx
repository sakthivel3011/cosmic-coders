import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export default function ShareTripPage() {
  const { tripId } = useParams();
  const linkRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [trip, setTrip] = useState(null);
  const [ownerName, setOwnerName] = useState("");
  const [loading, setLoading] = useState(true);

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

  const handleCopy = () => {
    navigator.clipboard.writeText(linkRef.current.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                <p className="text-sm text-gray-500">{label}</p>
                <p className="font-bold text-lg">{value}</p>
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
          {/* SHARE */}
          <div className="bg-white rounded-2xl p-6 shadow">
            <h2 className="text-xl font-bold mb-4 text-center">
              Share This Trip
            </h2>

            <div className="relative mb-4">
              <input
                ref={linkRef}
                readOnly
                value={`${window.location.origin}/share/${tripId}`}
                className="w-full border rounded-lg px-4 py-3 pr-24 text-sm"
              />
              <button
                onClick={handleCopy}
                className={`absolute right-2 top-2 px-4 py-2 rounded-lg text-white ${
                  copied ? "bg-green-500" : "bg-green-600"
                }`}
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-green-500 text-white py-3 rounded-xl">
                WhatsApp
              </button>
              <button className="w-full bg-blue-600 text-white py-3 rounded-xl">
                Facebook
              </button>
              <button className="w-full bg-sky-500 text-white py-3 rounded-xl">
                Twitter
              </button>
              <button className="w-full bg-pink-600 text-white py-3 rounded-xl">
                Instagram
              </button>
              <button className="w-full bg-gray-700 text-white py-3 rounded-xl">
                Email
              </button>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-2xl p-6 text-center">
            <h3 className="text-xl font-bold mb-3">Create Your Own Trip</h3>
            <p className="mb-4 opacity-90">
              Plan and share your travel adventures for free.
            </p>
            <button className="bg-white text-green-600 font-semibold py-3 px-6 rounded-xl">
              Sign Up Free
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="text-center py-8 text-gray-500">
        © 2024 GlobeTrotter. All rights reserved.
      </footer>
    </div>
  );
}
