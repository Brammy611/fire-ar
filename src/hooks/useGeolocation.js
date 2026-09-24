import { useEffect, useState } from "react";

export function useGeolocation() {
  const [location, setLocation] =
    useState(null);

  const [error, setError] =
    useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(
        "Geolocation tidak didukung browser"
      );

      return;
    }

    const watchId =
      navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            latitude:
              position.coords.latitude,

            longitude:
              position.coords.longitude,

            accuracy:
              position.coords.accuracy,
          });
        },

        (error) => {
          console.error(
            "Geolocation error:",
            error
          );

          setError(error.message);
        },

        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 10000,
        }
      );

    return () => {
      navigator.geolocation.clearWatch(
        watchId
      );
    };
  }, []);

  return {
    location,
    error,
  };
}