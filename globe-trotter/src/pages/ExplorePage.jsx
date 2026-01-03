import { useState } from "react";
import WorldMap from "../components/trip/WorldMap";
import { fetchTouristSpots } from "../hooks/useTourism";

const ExplorePage = () => {
  const [country, setCountry] = useState("");
  const [info, setInfo] = useState(null);

  const handleCountryClick = async (name) => {
    setCountry(name);
    const data = await fetchTouristSpots(name);
    setInfo(data);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Explore the World 🌍</h1>

      <WorldMap onCountrySelect={handleCountryClick} />

      {info && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">{country}</h2>
          <p className="mt-2 text-gray-700">{info.extract}</p>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
