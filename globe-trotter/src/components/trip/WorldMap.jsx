import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const WorldMap = ({ onCountrySelect }) => {

  const onEachCountry = (feature, layer) => {
    layer.on({
      click: () => {
        onCountrySelect(feature.properties.name);
      },
      mouseover: () => {
        layer.setStyle({ fillColor: "#4f46e5", fillOpacity: 0.6 });
      },
      mouseout: () => {
        layer.setStyle({ fillColor: "#3b82f6", fillOpacity: 0.3 });
      }
    });
  };

  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: "500px" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON
        data={null}
        url="/data/countries.geo.json"
        onEachFeature={onEachCountry}
        style={{
          fillColor: "#3b82f6",
          weight: 1,
          color: "#1e3a8a",
          fillOpacity: 0.3,
        }}
      />
    </MapContainer>
  );
};

export default WorldMap;
