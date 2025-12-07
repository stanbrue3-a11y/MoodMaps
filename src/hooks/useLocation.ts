import { useState, useEffect, useRef } from 'react';
import * as ExpoLocation from 'expo-location';
import { Location } from '../types';
import { useUserStore } from '../store/userStore';

const PARIS_CENTER: Location = {
  latitude: 48.8566,
  longitude: 2.3522,
};

const LOCATION_UPDATE_INTERVAL = 60000; // 60 seconds

export function useLocation() {
  const [location, setLocation] = useState<Location>(PARIS_CENTER);
  const [permission, setPermission] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useUserStore();

  useEffect(() => {
    requestLocationPermission();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (!user?.geolocConsent) {
        setLocation(PARIS_CENTER);
        return;
      }

      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      setPermission(status === 'granted');

      if (status === 'granted') {
        updateLocation();
        // Set up interval for periodic updates
        intervalRef.current = setInterval(updateLocation, LOCATION_UPDATE_INTERVAL);
      } else {
        setLocation(PARIS_CENTER);
        setError('Location permission denied');
      }
    } catch {
      setError('Failed to get location permission');
      setLocation(PARIS_CENTER);
    }
  };

  const updateLocation = async () => {
    try {
      const currentLocation = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.Balanced,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      setError(null);
    } catch {
      setError('Failed to get current location');
      setLocation(PARIS_CENTER);
    }
  };

  const requestOnDemandLocation = async () => {
    if (!permission || !user?.geolocConsent) {
      return;
    }
    await updateLocation();
  };

  return {
    location,
    permission,
    error,
    requestOnDemandLocation,
  };
}
