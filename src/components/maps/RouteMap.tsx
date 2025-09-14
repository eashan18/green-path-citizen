/// <reference types="google.maps" />
import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps } from '@/hooks/useGoogleMaps';

export type LatLng = google.maps.LatLngLiteral;

interface RouteMapProps {
  start: LatLng;
  end: LatLng;
  current?: LatLng | null;
  height?: number;
  onDirectionsReady?: (path: LatLng[]) => void;
}

// Vehicle icon will be created after Google Maps loads

export const RouteMap: React.FC<RouteMapProps> = ({ start, end, current, height = 360, onDirectionsReady }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const vehicleMarkerRef = useRef<google.maps.Marker | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps().then(() => {
      if (cancelled) return;
      if (!containerRef.current) return;

      mapRef.current = new google.maps.Map(containerRef.current, {
        center: start,
        zoom: 13,
        disableDefaultUI: false,
        mapTypeControl: false,
        streetViewControl: false,
      });

      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        preserveViewport: false,
        polylineOptions: { strokeColor: '#0ea5e9', strokeWeight: 5, strokeOpacity: 0.9 },
      });
      directionsRendererRef.current.setMap(mapRef.current);

      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: start,
          destination: end,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            directionsRendererRef.current?.setDirections(result);

            const overviewPath = result.routes[0].overview_path.map((p) => ({ lat: p.lat(), lng: p.lng() }));
            onDirectionsReady?.(overviewPath);

            // Place start and end markers
            new google.maps.Marker({ position: start, map: mapRef.current, label: 'S' });
            new google.maps.Marker({ position: end, map: mapRef.current, label: 'E' });

            // Vehicle marker
            const initial = current ?? start;
            const vehicleSvg: google.maps.Symbol = {
              path: 'M20 10c0-1.1-.9-2-2-2h-3.3l-2-3.5C12.3 3.2 11.7 3 11 3H6C4.9 3 4 3.9 4 5v7c0 1.1.9 2 2 2 .7 0 1.3-.4 1.7-1h6.6c.4.6 1 .9 1.7.9 1.1 0 2-.9 2-2V10z',
              fillColor: '#0ea5e9',
              fillOpacity: 1,
              scale: 1.2,
              anchor: new google.maps.Point(12, 12),
            };
            vehicleMarkerRef.current = new google.maps.Marker({
              position: initial,
              map: mapRef.current!,
              icon: vehicleSvg,
            });

            setReady(true);
          }
        }
      );
    });
    return () => {
      cancelled = true;
      directionsRendererRef.current?.setMap(null as any);
      vehicleMarkerRef.current?.setMap(null as any);
      mapRef.current = null;
    };
  }, [start.lat, start.lng, end.lat, end.lng]);

  // Update vehicle position when current changes
  useEffect(() => {
    if (!ready || !vehicleMarkerRef.current || !current) return;
    vehicleMarkerRef.current.setPosition(current);
  }, [current?.lat, current?.lng, ready]);

  return <div ref={containerRef} style={{ width: '100%', height }} className="rounded-lg shadow-md" />;
};

export default RouteMap;
