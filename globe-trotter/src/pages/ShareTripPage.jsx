import React, { useEffect, useRef, useState } from "react";

export default function ShareTripPage() {
  const linkRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(linkRef.current.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HERO */}
      <div className="bg-gradient-to-r from-green-700 to-green-500 text-white p-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold">Europe Adventure 2024</h1>
            <p className="opacity-90 mt-2">
              Shared by John Doe • Created with GlobeTrotter
            </p>
          </div>
          <span className="bg-white/20 px-4 py-2 rounded-full self-start">
            Upcoming Trip
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
              ["Duration", "16 Days"],
              ["Cities", "4"],
              ["Budget", "$3,500"],
              ["Activities", "24"],
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
              A 16-day adventure through Europe’s most iconic cities including
              Paris, Rome, Barcelona, and Amsterdam.
            </p>
          </div>

          {/* ITINERARY */}
          <div className="bg-white rounded-2xl p-6 shadow">
            <h2 className="text-xl font-bold mb-6">Itinerary Preview</h2>

            <div className="space-y-6">
              {/* Paris */}
              <div className="border-l-4 border-green-600 pl-4">
                <h3 className="font-bold text-lg">Paris, France</h3>
                <p className="text-sm text-gray-500">Days 1–3</p>
                <ul className="mt-2 text-gray-600 list-disc ml-4">
                  <li>Eiffel Tower</li>
                  <li>Louvre Museum</li>
                  <li>Seine Cruise</li>
                </ul>
              </div>

              {/* Rome */}
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="font-bold text-lg">Rome, Italy</h3>
                <p className="text-sm text-gray-500">Days 4–7</p>
                <ul className="mt-2 text-gray-600 list-disc ml-4">
                  <li>Colosseum Tour</li>
                  <li>Vatican City</li>
                </ul>
              </div>
            </div>
          </div>
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
                value="https://globetrotter.app/trip/europe-adventure-2024"
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
