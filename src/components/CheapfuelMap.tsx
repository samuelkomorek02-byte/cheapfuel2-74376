import { useEffect, useRef, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Skeleton } from "@/components/ui/skeleton";
import type { Map as MaplibreMap } from 'maplibre-gl';

export type Station = {
  id: string;
  name: string;
  brand?: string | null;
  lat: number;
  lng: number;
  dist?: number | null;
  price?: number | null;
  isOpen?: boolean;
  fuelType: string;
  openingTimes?: Array<{
    text: string;
    start: string;
    end: string;
  }>;
  overrides?: string[];
  wholeDay?: boolean;
};

interface CheapfuelMapProps {
  userLocation: { lat: number; lng: number; heading?: number } | null;
  stations: Station[];
  selectedStationId?: string | null;
  onMarkerClick?: (id: string) => void;
  onNavigate?: (station: Station) => void;
  cheapestPrice?: number | null;
  routePath?: Array<[number, number]> | null;
  destination?: { lat: number; lng: number; address: string } | null;
}

const CheapfuelMap = ({ 
  userLocation, 
  stations, 
  selectedStationId, 
  onMarkerClick, 
  onNavigate, 
  cheapestPrice,
  routePath,
  destination
}: CheapfuelMapProps) => {
  const mapRef = useRef<any>(null);
  const [popupInfo, setPopupInfo] = useState<{ station: Station; index: number } | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Calculate initial viewport
  const getInitialViewState = () => {
    if (userLocation) {
      return {
        longitude: userLocation.lng,
        latitude: userLocation.lat,
        zoom: 11,
      };
    }
    if (stations[0]) {
      return {
        longitude: stations[0].lng,
        latitude: stations[0].lat,
        zoom: 11,
      };
    }
    return {
      longitude: 13.404954,
      latitude: 52.520008,
      zoom: 11,
    };
  };

  // Add route layer to map
  useEffect(() => {
    if (!mapRef.current || !routePath || routePath.length === 0) return;
    
    const map = mapRef.current.getMap() as MaplibreMap;
    if (!map || !map.isStyleLoaded()) return;

    // Remove existing route layer if it exists
    if (map.getLayer('route-layer')) {
      map.removeLayer('route-layer');
    }
    if (map.getSource('route')) {
      map.removeSource('route');
    }

    // Add route source and layer
    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: routePath
        }
      }
    });

    map.addLayer({
      id: 'route-layer',
      type: 'line',
      source: 'route',
      paint: {
        'line-color': '#3b82f6',
        'line-width': 4,
        'line-opacity': 0.8
      }
    });

    return () => {
      // Cleanup on unmount
      if (map.getLayer('route-layer')) {
        map.removeLayer('route-layer');
      }
      if (map.getSource('route')) {
        map.removeSource('route');
      }
    };
  }, [routePath]);

  // Close popup when stations list changes (e.g., when station count selection changes)
  useEffect(() => {
    setPopupInfo(null);
  }, [stations]);

  // Fit bounds to show all markers and route
  useEffect(() => {
    if (!mapRef.current) return;
    
    const points: [number, number][] = [];
    if (userLocation) points.push([userLocation.lng, userLocation.lat]);
    stations.forEach(s => points.push([s.lng, s.lat]));
    
    // Add route points if available
    if (routePath && routePath.length > 0) {
      routePath.forEach(p => points.push(p));
    }
    
    if (points.length === 0) return;

    const map = mapRef.current.getMap();
    if (!map) return;

    // Calculate bounds
    const lngs = points.map(p => p[0]);
    const lats = points.map(p => p[1]);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    // Fit bounds with padding to show all stations and price labels
    map.fitBounds(
      [[minLng, minLat], [maxLng, maxLat]],
      { padding: { top: 80, bottom: 60, left: 60, right: 60 }, maxZoom: 16, duration: 1000 }
    );
  }, [userLocation, stations, routePath]);

  return (
    <div className="relative w-full h-[45vh] md:h-[70vh] rounded-lg overflow-hidden ring-1 ring-border">
      {/* Skeleton loader */}
      {!isMapLoaded && (
        <div className="absolute inset-0 z-10">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
      )}
      
      <Map
        ref={mapRef}
        initialViewState={getInitialViewState()}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        scrollZoom={false}
        attributionControl={false}
        reuseMaps={true}
        onLoad={() => setIsMapLoaded(true)}
        style={{
          opacity: isMapLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            longitude={userLocation.lng}
            latitude={userLocation.lat}
            anchor="center"
          >
            <div className="relative">
              {/* Inner dot */}
              <div 
                className="relative w-4 h-4 rounded-full border-2 border-white shadow-lg"
                style={{
                  backgroundColor: 'hsl(var(--primary))',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              />
            </div>
          </Marker>
        )}

        {/* Destination marker (red pin) */}
        {destination && (
          <Marker
            longitude={destination.lng}
            latitude={destination.lat}
            anchor="bottom"
          >
            <div className="relative">
              {/* Red pin for destination - Google Maps style */}
              <svg width="32" height="48" viewBox="0 0 32 48" className="drop-shadow-lg">
                {/* Red teardrop shape */}
                <path
                  d="M16 0C9.373 0 4 5.373 4 12c0 9 12 26 12 26s12-17 12-26c0-6.627-5.373-12-12-12z"
                  fill="#EA4335"
                  stroke="white"
                  strokeWidth="2"
                />
                {/* White circle in the middle */}
                <circle cx="16" cy="12" r="5" fill="white" />
              </svg>
            </div>
          </Marker>
        )}

        {/* Station markers - Render non-cheapest first, then cheapest (on top) */}
        {/* First pass: All non-cheapest stations */}
        {stations
          .filter((station) => station.price !== cheapestPrice)
          .map((station) => {
            const originalIndex = stations.findIndex(s => s.id === station.id);
            
            return (
              <Marker
                key={station.id}
                longitude={station.lng}
                latitude={station.lat}
                anchor="bottom"
                style={{ zIndex: 1 }}
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  onMarkerClick?.(station.id);
                  setPopupInfo({ station, index: originalIndex });
                }}
              >
                <div className="relative cursor-pointer">
                  {/* Price label above marker */}
                  {typeof station.price === "number" && (
                    <div
                      className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-xs font-bold whitespace-nowrap shadow-md border"
                      style={{
                        backgroundColor: 'hsl(var(--background))',
                        color: 'hsl(var(--foreground))',
                        borderColor: 'hsl(var(--border))',
                      }}
                    >
                      €{station.price.toFixed(3)}
                    </div>
                  )}

                  {/* Marker pin */}
                  <svg width="25" height="41" viewBox="0 0 25 41" className="drop-shadow-lg">
                    <path
                      d="M12.5 0C5.6 0 0 5.6 0 12.5c0 9.4 12.5 28.5 12.5 28.5S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z"
                      fill="hsl(var(--primary))"
                      stroke="white"
                      strokeWidth="1"
                    />
                  </svg>

                  {/* Number badge */}
                  <div
                    className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{
                      backgroundColor: 'hsl(var(--primary))',
                      color: 'hsl(var(--primary-foreground))',
                    }}
                  >
                    {originalIndex + 1}
                  </div>
                </div>
              </Marker>
            );
          })}

        {/* Second pass: All cheapest stations (render on top) */}
        {stations
          .filter((station) => station.price === cheapestPrice)
          .map((station) => {
            const originalIndex = stations.findIndex(s => s.id === station.id);
            
            return (
              <Marker
                key={station.id}
                longitude={station.lng}
                latitude={station.lat}
                anchor="bottom"
                style={{ zIndex: 10 }}
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  onMarkerClick?.(station.id);
                  setPopupInfo({ station, index: originalIndex });
                }}
              >
                <div className="relative cursor-pointer">
                  {/* Price label above marker - green for cheapest */}
                  {typeof station.price === "number" && (
                    <div
                      className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-xs font-bold whitespace-nowrap shadow-md border"
                      style={{
                        backgroundColor: '#16a34a',
                        color: 'white',
                        borderColor: '#16a34a',
                      }}
                    >
                      €{station.price.toFixed(3)}
                    </div>
                  )}

                  {/* Marker pin */}
                  <svg width="25" height="41" viewBox="0 0 25 41" className="drop-shadow-lg">
                    <path
                      d="M12.5 0C5.6 0 0 5.6 0 12.5c0 9.4 12.5 28.5 12.5 28.5S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z"
                      fill="hsl(var(--primary))"
                      stroke="white"
                      strokeWidth="1"
                    />
                  </svg>

                  {/* Number badge */}
                  <div
                    className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{
                      backgroundColor: 'hsl(var(--primary))',
                      color: 'hsl(var(--primary-foreground))',
                    }}
                  >
                    {originalIndex + 1}
                  </div>
                </div>
              </Marker>
            );
          })}

        {/* Popup for clicked station */}
        {popupInfo && (
        <Popup
          longitude={popupInfo.station.lng}
          latitude={popupInfo.station.lat}
          anchor="bottom"
          offset={40}
          onClose={() => setPopupInfo(null)}
          closeButton={true}
          closeOnClick={true}
          maxWidth="160px"
          style={{ zIndex: 50 }}
          >
            <div
              className="text-xs cursor-pointer hover:bg-accent/10 p-1 rounded transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setPopupInfo(null); // Close popup when navigating
                onNavigate?.(popupInfo.station);
              }}
              style={{ cursor: 'pointer', width: '140px' }}
            >
              <div className="font-semibold text-xs">
                #{popupInfo.index + 1} {popupInfo.station.name}
              </div>
              {typeof popupInfo.station.price === "number" && (
                <div className="text-xs flex items-center gap-1">
                  <span>€{popupInfo.station.price.toFixed(3)}/L</span>
                  {typeof popupInfo.station.isOpen === "boolean" && (
                    <span className={`font-medium ${popupInfo.station.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                      {popupInfo.station.isOpen ? 'open' : 'close'}
                    </span>
                  )}
                </div>
              )}
              {typeof popupInfo.station.dist === "number" && (
                <div className="text-xs">{popupInfo.station.dist.toFixed(1)} km</div>
              )}
            </div>
          </Popup>
        )}
      </Map>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/0 via-background/0 to-background/0" />
    </div>
  );
};

export default CheapfuelMap;
