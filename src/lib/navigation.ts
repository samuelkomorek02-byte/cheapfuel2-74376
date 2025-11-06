import { validateCoordinates } from "./validation";

/**
 * Opens Apple Maps with the given destination coordinates
 * Supports route mode with origin and waypoint/destination
 * Uses maps:// URL scheme on iOS devices, falls back to web URL
 */
export const openAppleMaps = (
  lat: number, 
  lng: number,
  origin?: { lat: number; lng: number },
  destination?: { lat: number; lng: number }
) => {
  if (!validateCoordinates(lat, lng)) {
    console.error("Invalid coordinates for Apple Maps");
    return;
  }

  const isMobile = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  // Route mode with origin but no destination: only navigate to station
  // Using only daddr allows Apple Maps to use current GPS location and show single "Go" button
  if (origin && !destination) {
    if (isMobile) {
      window.location.href = `maps://?daddr=${lat},${lng}`;
    } else {
      window.location.href = `https://maps.apple.com/?daddr=${lat},${lng}`;
    }
  }
  // Route mode with full route (fallback, not used anymore)
  else if (origin && destination) {
    if (isMobile) {
      window.location.href = `maps://?saddr=${origin.lat},${origin.lng}&daddr=${lat},${lng}&daddr=${destination.lat},${destination.lng}`;
    } else {
      window.location.href = `https://maps.apple.com/?saddr=${origin.lat},${origin.lng}&daddr=${lat},${lng}&daddr=${destination.lat},${destination.lng}`;
    }
  } 
  // Simple navigation to station from current location
  else if (isMobile) {
    window.location.href = `maps://?daddr=${lat},${lng}`;
  } else {
    window.location.href = `https://maps.apple.com/?daddr=${lat},${lng}`;
  }
};

/**
 * Opens Google Maps with the given destination coordinates
 * Supports route mode with origin and waypoint/destination
 */
export const openGoogleMaps = (
  lat: number, 
  lng: number, 
  origin?: { lat: number; lng: number },
  destination?: { lat: number; lng: number }
) => {
  if (!validateCoordinates(lat, lng)) {
    console.error("Invalid coordinates for Google Maps");
    return;
  }

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Route mode: user wants to go via this station to their destination
  if (origin && destination) {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&waypoints=${lat},${lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;
    window.location.href = googleMapsUrl;
  } 
  // Simple navigation to station
  else if (isMobile) {
    // Mobile: Use Google Maps app URL scheme for better integration
    window.location.href = `https://maps.google.com/?daddr=${lat},${lng}&directionsmode=driving`;
  } else {
    // Desktop: Use standard Google Maps directions
    window.location.href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
  }
};
