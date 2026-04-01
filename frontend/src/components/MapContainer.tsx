import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: 'donor' | 'hospital' | 'sos';
  label: string;
  bloodType?: string;
  urgency?: string;
}

interface MapContainerProps {
  markers: MapMarker[];
  userLocation: { lat: number; lng: number } | null;
  onMarkerClick?: (marker: MapMarker) => void;
}

// Create custom icons
const createIcon = (type: 'donor' | 'hospital' | 'sos') => {
  const iconUrl =
    type === 'donor'
      ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'
      : type === 'hospital'
        ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
        : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';

  return new L.Icon({
    iconUrl,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

export const MapDisplay: React.FC<MapContainerProps> = ({ markers, userLocation, onMarkerClick }) => {
  const defaultCenter: [number, number] = [40, -95];
  const center = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter;

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden glass">
      <MapContainer
        center={center as [number, number]}
        zoom={12}
        className="w-full h-full dark-mode-map"
        style={{ background: '#0f0f0f' }}
      >
        {/* Dark theme tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">carto</a> | &copy; contributors'
        />

        {/* User location circle */}
        {userLocation && (
          <>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={5000} // 5km radius
              pathOptions={{
                color: '#ef4444',
                fillColor: '#ef4444',
                fillOpacity: 0.1,
                weight: 2,
                dashArray: '5, 5',
              }}
            />
            <Marker position={[userLocation.lat, userLocation.lng]} icon={createIcon('donor')}>
              <Popup>
                <div className="text-xs">
                  <p className="font-bold">📍 Your Location</p>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* All markers */}
        {markers.map((marker) => (
          <motion.div key={marker.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
            <Marker
              position={[marker.lat, marker.lng]}
              icon={createIcon(marker.type)}
              eventHandlers={{
                click: () => onMarkerClick?.(marker),
              }}
            >
              <Popup>
                <div className="text-xs text-gray-800">
                  <p className="font-bold">{marker.label}</p>
                  {marker.bloodType && <p>🩸 {marker.bloodType}</p>}
                  {marker.urgency && <p className="text-red-600 font-semibold">⚠️ {marker.urgency}</p>}
                </div>
              </Popup>
            </Marker>
          </motion.div>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapDisplay;
