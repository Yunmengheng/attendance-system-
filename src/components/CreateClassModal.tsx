'use client';

import { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { toast } from 'sonner';

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
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setAddress('Current Location');
        setLoadingLocation(false);
        toast.success('Location captured successfully');
      },
      (error) => {
        setLoadingLocation(false);
        let errorMessage = 'Unable to get current location. ';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'Please enter coordinates manually.';
        }
        
        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
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

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={loadingLocation}
              className="flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MapPin className={`w-4 h-4 ${loadingLocation ? 'animate-pulse' : ''}`} />
              {loadingLocation ? 'Getting location...' : 'Use Current Location'}
            </button>

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
