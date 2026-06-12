"use client";
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Hotspot {
  id: string;
  lat: number;
  lng: number;
  risk_score: number;
  description: string;
  radius_meters: number;
}

export default function SpatialMap() {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);

  useEffect(() => {
    fetch('http://localhost:8001/predict/spatial')
      .then(res => res.json())
      .then(data => setHotspots(data.hotspots || []))
      .catch(err => console.error(err));
  }, []);

  // Bangalore Coordinates
  const position: [number, number] = [12.9716, 77.5946];

  return (
    <MapContainer 
      center={position} 
      zoom={12} 
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
      zoomControl={false}
    >
      {/* Dark Theme TileLayer */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
      />
      
      {hotspots.map(spot => (
        <Circle
          key={spot.id}
          center={[spot.lat, spot.lng]}
          pathOptions={{ 
            color: spot.risk_score > 90 ? '#ef4444' : '#f97316', 
            fillColor: spot.risk_score > 90 ? '#ef4444' : '#f97316',
            fillOpacity: 0.4
          }}
          radius={spot.radius_meters}
        >
          <Popup>
            <div className="p-2 font-sans">
              <h3 className="font-bold text-gray-800">{spot.id} - Risk Score: {spot.risk_score}/100</h3>
              <p className="text-sm text-gray-600 mt-1">{spot.description}</p>
            </div>
          </Popup>
        </Circle>
      ))}
    </MapContainer>
  );
}
