import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix standard marker icons in Leaflet for React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export const RouteMap = ({ stops = [], height = '400px' }) => {
  if (!stops || stops.length === 0) {
    return (
      <div style={{ height }} className="bg-gray-100 rounded-xl border border-gray-300 flex items-center justify-center text-gray-400">
        No pickup stops data available for route display
      </div>
    );
  }

  const center = [stops[0].latitude || 12.9716, stops[0].longitude || 77.5946];
  const polylineCoords = stops.map(s => [s.latitude, s.longitude]);

  return (
    <div style={{ height }} className="rounded-xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
      <MapContainer center={center} zoom={11} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stops.map((stop, idx) => (
          <Marker key={stop.membershipId || idx} position={[stop.latitude, stop.longitude]}>
            <Popup>
              <div className="text-xs">
                <div className="font-bold text-sm text-green-700">Stop #{stop.stopOrder}: {stop.farmerName}</div>
                <div className="text-gray-600 mt-1">{stop.address}</div>
                <div className="font-semibold text-gray-800 mt-1">Allocated: {Number(stop.allocatedQtyKg).toFixed(1)} kg</div>
                <div className="text-gray-400 text-[10px]">Next stop: ~{stop.distanceToNextKm ? Number(stop.distanceToNextKm).toFixed(1) : 0} km</div>
              </div>
            </Popup>
          </Marker>
        ))}
        {polylineCoords.length > 1 && (
          <Polyline positions={polylineCoords} color="#16a34a" weight={4} dashArray="6, 6" />
        )}
      </MapContainer>
    </div>
  );
};
