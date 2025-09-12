import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface MapSelectorProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number };
}

const MapSelector = ({ onLocationSelect, initialLocation }: MapSelectorProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [address, setAddress] = useState('');

  useEffect(() => {
    // Simple map placeholder - in production you'd integrate with Google Maps
    // Since we're focusing on backend functionality, we'll use a simple location picker
    if (navigator.geolocation && !initialLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setSelectedLocation(location);
          geocodeLocation(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to a central location
          const defaultLocation = { lat: 28.6139, lng: 77.2090 }; // New Delhi
          setSelectedLocation(defaultLocation);
          setAddress('New Delhi, India');
        }
      );
    } else if (initialLocation) {
      setSelectedLocation(initialLocation);
      geocodeLocation(initialLocation);
    }
  }, [initialLocation]);

  const geocodeLocation = async (location: { lat: number; lng: number }) => {
    // In production, you'd use Google Maps Geocoding API
    // For now, we'll generate a simple address
    setAddress(`Location: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`);
  };

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Simple click-to-select location (placeholder)
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert click position to lat/lng (simplified)
    const lat = selectedLocation?.lat || 28.6139;
    const lng = selectedLocation?.lng || 77.2090;
    
    // Small random offset based on click position
    const newLocation = {
      lat: lat + (y / rect.height - 0.5) * 0.01,
      lng: lng + (x / rect.width - 0.5) * 0.01
    };
    
    setSelectedLocation(newLocation);
    geocodeLocation(newLocation);
  };

  const handleSelectLocation = () => {
    if (selectedLocation) {
      onLocationSelect({
        ...selectedLocation,
        address
      });
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div
            ref={mapRef}
            className="w-full h-64 bg-muted rounded-lg border-2 border-dashed border-border cursor-crosshair flex items-center justify-center relative overflow-hidden"
            onClick={handleMapClick}
          >
            {/* Simple map placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
              <div className="absolute inset-0 opacity-20">
                {/* Grid pattern to simulate map */}
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              {selectedLocation && (
                <div 
                  className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                >
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping"></div>
                </div>
              )}
            </div>
            <div className="text-center z-10">
              <p className="text-sm text-muted-foreground mb-2">Click to select location</p>
              {selectedLocation && (
                <div className="bg-white/90 backdrop-blur p-2 rounded text-xs">
                  📍 {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Selected Location:</p>
            <p className="text-xs text-muted-foreground">{address}</p>
          </div>
          
          <Button 
            onClick={handleSelectLocation}
            disabled={!selectedLocation}
            className="w-full gradient-primary"
          >
            Use This Location
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapSelector;