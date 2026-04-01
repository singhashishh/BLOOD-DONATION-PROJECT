import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- ✅ Export Interface so Dashboard can use it ---
export interface Location {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  type: "donor" | "hospital" | "sos";
  bloodType?: string;
  urgency?: string;
}

interface MapProps {
  userLocation: { latitude: number; longitude: number };
  locations: Location[];
  onLocationSelect?: (location: Location) => void;
}

// --- ✅ Custom Neon Markers ---
const createIcon = (color: string) => L.divIcon({
  html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 12px ${color};"></div>`,
  className: "custom-marker",
  iconSize: [14, 14],
});

const icons = {
  donor: createIcon("#ef4444"),    // Red
  hospital: createIcon("#3b82f6"), // Blue
  sos: createIcon("#f59e0b"),      // Amber
  user: createIcon("#10b981"),     // Emerald (You)
};

// --- ✅ Internal Map Controller (FlyTo Logic) ---
const MapHandler = ({ center }: { center: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1.5, easeLinearity: 0.25 });
    }
  }, [center, map]);
  return null;
};

const MapComponentWithSearch: React.FC<MapProps> = ({ userLocation, locations, onLocationSelect }) => {
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);

  return (
    <div className="w-full h-[500px] rounded-[32px] overflow-hidden border border-white/10 relative shadow-2xl group">
      <MapContainer
        center={[userLocation.latitude, userLocation.longitude]}
        zoom={13}
        style={{ height: "100%", width: "100%", background: "#050505" }}
        zoomControl={false}
      >
        {/* Futuristic Dark Tiles */}
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        
        <MapHandler center={flyTo} />

        {/* User Current Location */}
        <Marker position={[userLocation.latitude, userLocation.longitude]} icon={icons.user}>
          <Popup className="custom-popup">You are here</Popup>
        </Marker>

        {/* 5KM Safe Zone Circle */}
        <Circle 
          center={[userLocation.latitude, userLocation.longitude]} 
          radius={5000} 
          pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.05, weight: 1 }} 
        />

        {/* Dynamic Markers for Donors/Hospitals */}
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.latitude, loc.longitude]}
            icon={icons[loc.type]}
            eventHandlers={{
              click: () => {
                setFlyTo([loc.latitude, loc.longitude]);
                if (onLocationSelect) onLocationSelect(loc);
              },
            }}
          >
            <Popup>
              <div className="text-black font-sans p-1">
                <p className="font-bold text-sm uppercase">{loc.name}</p>
                <p className="text-xs text-red-600 font-black mt-1">
                  {loc.bloodType ? `BLOOD: ${loc.bloodType}` : `URGENCY: ${loc.urgency}`}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Re-center Button */}
      <button 
        onClick={() => setFlyTo([userLocation.latitude, userLocation.longitude])}
        className="absolute bottom-6 right-6 z-[1000] bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl hover:bg-white/20 transition-all active:scale-90"
      >
        <div className="w-4 h-4 rounded-full border-2 border-emerald-400"></div>
      </button>

      <style>{`
        .leaflet-popup-content-wrapper { border-radius: 16px; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); }
        .leaflet-container { cursor: crosshair !important; }
      `}</style>
    </div>
  );
};

export default MapComponentWithSearch;