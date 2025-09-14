// Simple Google Maps loader utility
// NOTE: The Maps JavaScript API key is public and safe to use in frontend for demo purposes.
// For production, restrict the key by domain in Google Cloud Console.

import { Loader } from '@googlemaps/js-api-loader';

const GOOGLE_MAPS_API_KEY = "AIzaSyBJWZnYCVnumgKB1h5uYvbkSTAvilhHLQ4"; // Provided by user

let loaderPromise: Promise<typeof google> | null = null;

export function loadGoogleMaps() {
  if (!loaderPromise) {
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['geometry', 'places'],
    });
    loaderPromise = loader.load();
  }
  return loaderPromise;
}
