'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface LocationData {
  country: string;
  countryCode: string;
  city: string;
  region: string;
  timezone: string;
  latitude: number;
  longitude: number;
}

interface LocationContextType {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
}

const LocationContext = createContext<LocationContextType>({
  location: null,
  loading: true,
  error: null,
});

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to get location from browser geolocation first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // In a real app, you'd use a geolocation API to get location details
            // For demo purposes, we'll use mock data based on common locations
            const mockLocation: LocationData = {
              country: 'United States',
              countryCode: 'US',
              city: 'New York',
              region: 'New York',
              timezone: 'America/New_York',
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setLocation(mockLocation);
          } catch (err) {
            setError('Failed to get location details');
          } finally {
            setLoading(false);
          }
        },
        () => {
          // Fallback to IP-based location (mock data)
          const fallbackLocation: LocationData = {
            country: 'United States',
            countryCode: 'US',
            city: 'San Francisco',
            region: 'California',
            timezone: 'America/Los_Angeles',
            latitude: 37.7749,
            longitude: -122.4194,
          };
          setLocation(fallbackLocation);
          setLoading(false);
        }
      );
    } else {
      // Fallback for browsers without geolocation
      const fallbackLocation: LocationData = {
        country: 'United States',
        countryCode: 'US',
        city: 'Los Angeles',
        region: 'California',
        timezone: 'America/Los_Angeles',
        latitude: 34.0522,
        longitude: -118.2437,
      };
      setLocation(fallbackLocation);
      setLoading(false);
    }
  }, []);

  return (
    <LocationContext.Provider value={{ location, loading, error }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}