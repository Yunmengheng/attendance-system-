'use client';

import { useState, useEffect } from 'react';
import { X, MapPin, MapIcon } from 'lucide-react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const LocationPicker = dynamic(() => import('./LocationPicker'), {
  ssr: false,
  loading: () => <div className="h-96 bg-secondary rounded-lg animate-pulse" />
});

interface CreateClassModalProps {
  onClose: () => void;
  onCreate: (classData: {
    name: string;
    code: string;
    location: {
      latitude: number;
      longitude: number;
      radius: number;
      address: string;
    };
  }) => void;
}

export function CreateClassModal({ onClose, onCreate }: CreateClassModalProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState('100');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    // Try to get reverse geocoded address when coordinates change
    if (latitude && longitude && !address) {
      reverseGeocode(parseFloat(latitude), parseFloat(longitude));
    }
  }, [latitude, longitude]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      name,
      code: code || generateCode(),
      location: {
        latitude: parseFloat(latitude) || 0,
        longitude: parseFloat(longitude) || 0,
        radius: parseFloat(radius),
        address
      }
    });
  };

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLoadingLocation(true);
    toast.info('Requesting location permission...');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        setLatitude(lat);
        setLongitude(lng);
        setLoadingLocation(false);
        toast.success('Location captured successfully!');
        reverseGeocode(parseFloat(lat), parseFloat(lng));
      },
      (error) => {
        setLoadingLocation(false);
        let errorMessage = 'Unable to get current location. ';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please try again.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage = 'An unknown error occurred. Please enter coordinates manually.';
        }
        
        console.error('Geolocation error:', error);
        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  const handleMapLocationSelect = (lat: number, lng: number) => {
    setLatitude(lat.toFixed(6));
    setLongitude(lng.toFixed(6));
    setShowMap(false);
    toast.success('Location selected from map');
    reverseGeocode(lat, lng);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-white dark:bg-card rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-card border-b border-border px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl">Create New Class</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Class Name */}
          <div>
            <label htmlFor="className" className="block text-sm mb-2">
              Class Name
            </label>
            <input
              id="className"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Computer Science 101"
              required
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Class Code */}
          <div>
            <label htmlFor="classCode" className="block text-sm mb-2">
              Class Code (Optional)
            </label>
            <div className="flex gap-3">
              <input
                id="classCode"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Auto-generated if left empty"
                className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setCode(generateCode())}
                className="px-6 py-3 bg-primary/5 border border-primary/20 text-primary rounded-lg hover:bg-primary/10 transition-colors"
              >
                Generate
              </button>
            </div>
          </div>

          {/* Location Section */}
          <div className="border-t border-border pt-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-lg">Class Location</h3>
            </div>

            {/* Address */}
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm mb-2">
                Location Address
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g., Room 205, Main Building"
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Coordinates */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="latitude" className="block text-sm mb-2">
                  Latitude
                </label>
                <input
                  id="latitude"
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="e.g., 40.7128"
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="longitude" className="block text-sm mb-2">
                  Longitude
                </label>
                <input
                  id="longitude"
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="e.g., -74.0060"
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {/* Location Buttons */}
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={loadingLocation}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-primary/5 text-primary border border-primary/20 rounded-lg hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MapPin className={`w-4 h-4 ${loadingLocation ? 'animate-pulse' : ''}`} />
                {loadingLocation ? 'Getting location...' : 'Use Current Location'}
              </button>
              
              <button
                type="button"
                onClick={() => setShowMap(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <MapIcon className="w-4 h-4" />
                Choose from Map
              </button>
            </div>

            {/* Map Modal */}
            {showMap && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-[60]">
                <div className="bg-white dark:bg-card rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                  <div className="px-6 py-4 border-b border-border flex justify-between items-center">
                    <h3 className="text-xl">Select Location on Map</h3>
                    <button
                      onClick={() => setShowMap(false)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-6">
                    <LocationPicker
                      key={Date.now()}
                      initialLat={latitude ? parseFloat(latitude) : undefined}
                      initialLng={longitude ? parseFloat(longitude) : undefined}
                      onLocationSelect={handleMapLocationSelect}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Radius */}
            <div>
              <label htmlFor="radius" className="block text-sm mb-2">
                Check-in Radius (meters)
              </label>
              <input
                id="radius"
                type="number"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                placeholder="100"
                required
                min="10"
                max="1000"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Students must be within this distance to check in
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-5 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
