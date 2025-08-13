import { GeoLocation } from '@/types/invc';

/**
 * Get current position using Geolocation API
 */
export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
};

/**
 * Calculate distance between two points using Haversine formula
 * @param lat1 Latitude of first point
 * @param lng1 Longitude of first point  
 * @param lat2 Latitude of second point
 * @param lng2 Longitude of second point
 * @returns Distance in meters
 */
export const distanceInMeters = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Validate if current location is within tolerance of expected location
 * @param actual Current location
 * @param expected Expected location
 * @param toleranceM Tolerance in meters (default: 100m)
 * @returns true if location is valid
 */
export const validateGeotag = (
  actual: GeoLocation,
  expected: GeoLocation,
  toleranceM: number = 100
): boolean => {
  const distance = distanceInMeters(
    actual.latitude,
    actual.longitude,
    expected.latitude,
    expected.longitude
  );
  
  return distance <= toleranceM;
};

/**
 * Format coordinates for display
 */
export const formatCoordinates = (location: GeoLocation): string => {
  return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
};

/**
 * Check if browser supports geolocation
 */
export const supportsGeolocation = (): boolean => {
  return 'geolocation' in navigator;
};