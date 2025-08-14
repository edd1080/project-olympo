import { useState, useCallback } from 'react';

interface GeolocationCoordinates {
  lat: number;
  lng: number;
  accuracy: number;
}

interface GeolocationState {
  isLoading: boolean;
  error: string | null;
  coordinates: GeolocationCoordinates | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    isLoading: false,
    error: null,
    coordinates: null
  });

  const getCurrentPosition = useCallback((): Promise<GeolocationCoordinates> => {
    return new Promise((resolve, reject) => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      if (!navigator.geolocation) {
        const error = 'Geolocalización no es compatible con este dispositivo';
        setState(prev => ({ ...prev, isLoading: false, error }));
        reject(new Error(error));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          
          setState({
            isLoading: false,
            error: null,
            coordinates
          });
          
          resolve(coordinates);
        },
        (error) => {
          let errorMessage = 'Error al obtener ubicación';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permisos de ubicación denegados';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Ubicación no disponible';
              break;
            case error.TIMEOUT:
              errorMessage = 'Tiempo de espera agotado';
              break;
          }
          
          setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }, []);

  const calculateDistance = useCallback((
    lat1: number, 
    lng1: number, 
    lat2: number, 
    lng2: number
  ): number => {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en metros
  }, []);

  const isWithinTolerance = useCallback((
    currentLat: number,
    currentLng: number,
    targetLat: number,
    targetLng: number,
    toleranceMeters: number = 10
  ): boolean => {
    const distance = calculateDistance(currentLat, currentLng, targetLat, targetLng);
    return distance <= toleranceMeters;
  }, [calculateDistance]);

  return {
    ...state,
    getCurrentPosition,
    calculateDistance,
    isWithinTolerance
  };
};