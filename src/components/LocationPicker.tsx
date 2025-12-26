'use client';

import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Next.js
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

interface LocationPickerProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

export default function LocationPicker({ initialLat, initialLng, onLocationSelect }: LocationPickerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Fix Leaflet default icon issue - create custom icon
    const customIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Create map instance
    const center: [number, number] = initialLat && initialLng 
      ? [initialLat, initialLng] 
      : [40.7128, -74.0060];

    const map = L.map(containerRef.current).setView(center, initialLat && initialLng ? 15 : 4);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    // Add click handler
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      
      // Remove old marker if exists
      if (markerRef.current) {
        markerRef.current.remove();
      }
      
      // Add new marker with custom icon
      markerRef.current = L.marker([lat, lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
        .openPopup();
      
      // Update state
      setSelectedLocation({ lat, lng });
      
      // Call callback
      onLocationSelect(lat, lng);
    });

    // Try to get user's location
    map.locate({ setView: false, maxZoom: 15 });
    
    map.on('locationfound', (e: L.LocationEvent) => {
      if (!markerRef.current) {
        markerRef.current = L.marker(e.latlng, { icon: customIcon })
          .addTo(map)
          .bindPopup('Your current location')
          .openPopup();
        map.flyTo(e.latlng, 15);
        setSelectedLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    });

    mapRef.current = map;
    setIsLoading(false);

    // Cleanup function
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run once

  return (
    <div className="space-y-3">
      {isLoading && (
        <div className="absolute inset-0 bg-secondary/50 rounded-lg flex items-center justify-center z-10">
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      )}
      <div 
        ref={containerRef} 
        className="h-96 rounded-lg overflow-hidden border border-border relative"
        style={{ height: '384px', width: '100%' }}
      />
      <div className="text-sm text-center space-y-1">
        <p className="text-muted-foreground">
          Click anywhere on the map to set the location
        </p>
        {selectedLocation && (
          <p className="text-primary font-medium">
            Selected: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
          </p>
        )}
      </div>
    </div>
  );
}
