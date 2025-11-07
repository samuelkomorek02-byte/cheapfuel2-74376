import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CheapfuelMap, { type Station } from "@/components/CheapfuelMap";
import LanguageMenu from "@/components/LanguageMenu";
import RouteSearchDialog from "@/components/RouteSearchDialog";
import NavigationDialog from "@/components/NavigationDialog";
import { toast } from "@/hooks/use-toast";
import { MapPin, Fuel, ShieldCheck, ExternalLink, Instagram, Clock, AlertTriangle, Globe, Route, X, Menu, LogOut, Languages, Settings, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import cheapfuelLogo from "@/assets/cheapfuel-logo.svg";
import { analytics } from "@/lib/analytics";
import { useSubscription } from "@/hooks/useSubscription";
import { validateCoordinates } from "@/lib/validation";
import Footer from "@/components/Footer";
import { isPreviewMode } from "@/lib/utils";
const DEFAULT_RADIUS_KM = 25; // Fixed search radius to avoid rate limiting
const FUEL_TYPE = "e5"; // e5 | e10 | diesel
function isHttpsOrLocalhost() {
  if (typeof window === "undefined") return false;
  const isLocal = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  return location.protocol === "https:" || isLocal;
}
function isInstagramBrowser() {
  if (typeof window === "undefined") return false;
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  return /Instagram/.test(userAgent);
}
function formatPrice(price?: number | null) {
  if (typeof price !== "number") return "–";
  return `€${price.toFixed(3)}/L`;
}

// Check if coordinates are within Germany
function isLocationInGermany(lat: number, lng: number): boolean {
  // Germany's approximate boundaries
  const GERMANY_BOUNDS = {
    north: 55.1,
    south: 47.3,
    east: 15.0,
    west: 5.9
  };
  return lat >= GERMANY_BOUNDS.south && lat <= GERMANY_BOUNDS.north && lng >= GERMANY_BOUNDS.west && lng <= GERMANY_BOUNDS.east;
}
const Index = () => {
  const {
    t
  } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const navigationState = location.state as { subscribed?: boolean; checkedAt?: number } | null;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  // Skip initial subscription check wenn von Auth navigiert mit frischem Status
  const skipCheck = navigationState?.subscribed && 
                    navigationState?.checkedAt && 
                    Date.now() - navigationState.checkedAt < 10000;
  
  const { subscribed, loading: subLoading, manageSubscription } = useSubscription(
    skipCheck, 
    navigationState?.subscribed || false // Pass initial subscribed state
  );
  const [userLoc, setUserLoc] = useState<{
    lat: number;
    lng: number;
    heading?: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [stations, setStations] = useState<Station[]>([]);
  const [fuelType, setFuelType] = useState<"e5" | "e10" | "diesel" | "superplus" | "lpg">(FUEL_TYPE as any);
  const [stationLimit, setStationLimit] = useState<number>(10);
  const [locationError, setLocationError] = useState<'denied' | 'instagram' | 'unavailable' | 'timeout' | null>(null);
  const [outsideGermany, setOutsideGermany] = useState(false);
  const [routeMode, setRouteMode] = useState(false);
  const [routeDialogOpen, setRouteDialogOpen] = useState(false);
  const [destination, setDestination] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [routePath, setRoutePath] = useState<Array<[number, number]> | null>(null);
  const [routeLength, setRouteLength] = useState<number>(0);
  const [navigationStation, setNavigationStation] = useState<Station | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const radius = DEFAULT_RADIUS_KM;
  const canUseGeo = useMemo(() => isHttpsOrLocalhost(), []);
  const SUPPORTED_FUEL_TYPES = new Set(["e5", "e10", "diesel"]);

  // Request deduplication and throttling
  const pendingRequests = useRef<Map<string, {
    promise: Promise<Station[]>;
    timestamp: number;
  }>>(new Map());
  const lastFetchTime = useRef<number>(0);
  const MIN_FETCH_INTERVAL = 1000; // 1 second between fetches for better UX
  
  // Check authentication and onboarding
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session?.user);
        setUserEmail(session?.user?.email || null);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session?.user);
      setUserEmail(session?.user?.email || null);
      setCheckingAuth(false);
      
      // Check onboarding only after auth check
      const onboardingCompleted = localStorage.getItem("onboarding_completed");
      if (!onboardingCompleted) {
        navigate("/onboarding");
      } else if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Clear navigation state after use
  useEffect(() => {
    if (navigationState?.subscribed) {
      // Clear state nach kurzer Verzögerung
      setTimeout(() => {
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [navigationState]);

  // Check subscription status after authentication
  useEffect(() => {
    // Im Preview-Modus keine Redirects
    if (isPreviewMode()) return;
    
    // Wenn wir von Auth.tsx mit subscribed state kommen, nicht nochmal checken
    if (navigationState?.subscribed && navigationState?.checkedAt) {
      const timeSinceCheck = Date.now() - navigationState.checkedAt;
      // Wenn der Check weniger als 10 Sekunden alt ist, vertraue ihm
      if (timeSinceCheck < 10000) {
        return; // Kein Redirect nötig
      }
    }
    
    // Normale Subscription-Prüfung
    if (isAuthenticated && !checkingAuth && !subLoading) {
      if (!subscribed) {
        navigate("/paywall");
      }
    }
  }, [isAuthenticated, checkingAuth, subscribed, subLoading, navigate, navigationState]);

  // Cleanup pending requests on unmount and periodically
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      for (const [key, value] of pendingRequests.current.entries()) {
        if (now - value.timestamp > 30000) {
          // 30s timeout
          pendingRequests.current.delete(key);
          console.log(`Cleaned up stale request: ${key}`);
        }
      }
    }, 10000); // Check every 10s

    return () => {
      clearInterval(cleanup);
      pendingRequests.current.clear();
    };
  }, []);
  const requestLocation = useCallback(() => new Promise<{
    lat: number;
    lng: number;
    heading?: number;
  }>((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0 // Force fresh location, no caching
    };
    navigator.geolocation.getCurrentPosition(pos => {
      const location = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        heading: pos.coords.heading || undefined
      };
      console.log('Fresh location requested:', location);
      setLocationError(null); // Clear any previous error
      analytics.trackLocationRequest(true);
      resolve(location);
    }, err => {
      console.error('Geolocation error:', err);
      let errorType: 'denied' | 'instagram' | 'unavailable' | 'timeout' = 'denied';
      if (err.code === 1) {
        errorType = isInstagramBrowser() ? 'instagram' : 'denied';
      } else if (err.code === 2) {
        errorType = 'unavailable';
      } else if (err.code === 3) {
        errorType = 'timeout';
      }
      setLocationError(errorType);
      const errorMsg = t(`location_${errorType}`);
      analytics.trackLocationRequest(false, errorMsg);
      reject(new Error(errorMsg));
    }, options);
  }), [t]);
  const fetchStations = useCallback(async (lat: number, lng: number): Promise<Station[]> => {
    // Validate coordinates
    if (!validateCoordinates(lat, lng)) {
      throw new Error("Invalid coordinates");
    }

    // Request deduplication - reuse pending requests
    const requestKey = `${lat.toFixed(6)},${lng.toFixed(6)},${fuelType}`;
    const pending = pendingRequests.current.get(requestKey);
    if (pending) {
      console.log('Reusing pending request for', requestKey);
      return pending.promise;
    }

    // Create new request and cache it
    const requestPromise = (async () => {
      try {
        const {
          data,
          error
        } = await supabase.functions.invoke("fetch-stations", {
          body: {
            lat,
            lng,
            radius: 25,
            type: fuelType
          }
        });
        if (error) {
          throw new Error(error.message || "Edge function error");
        }
        const stations = (data?.stations ?? []) as Station[];
        return stations.sort((a, b) => (a.dist || 0) - (b.dist || 0));
      } finally {
        // Remove from cache when done
        pendingRequests.current.delete(requestKey);
      }
    })();
    pendingRequests.current.set(requestKey, {
      promise: requestPromise,
      timestamp: Date.now()
    });
    return requestPromise;
  }, [fuelType]);

  // Client-side throttling to limit API calls
  const throttledFetchStations = useCallback(async (lat: number, lng: number): Promise<Station[]> => {
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTime.current;
    if (timeSinceLastFetch < MIN_FETCH_INTERVAL) {
      const waitTime = MIN_FETCH_INTERVAL - timeSinceLastFetch;
      console.log(`Throttling: waiting ${waitTime}ms before next fetch`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    lastFetchTime.current = Date.now();
    return fetchStations(lat, lng);
  }, [fetchStations]);
  
  const handleStationClick = useCallback((station: Station) => {
    analytics.trackStationClick(station.id, station.price || 0, station.dist || 0);
    setNavigationStation(station);
  }, []);

  // Optimized: combine nearest stations filtering and display sorting in single pass
  const {
    displayStations,
    cheapestPrice
  } = useMemo(() => {
    // Get nearest stations based on limit (max 20 in route mode)
    const nearest = routeMode ? stations.slice(0, 10) : stations.slice(0, stationLimit);

    // Find cheapest price
    const prices = nearest.filter(s => typeof s.price === 'number').map(s => s.price as number);
    const cheapest = prices.length > 0 ? Math.min(...prices) : null;

    // Sort for display: price first (cheapest), then distance
    const sorted = [...nearest].sort((a, b) => {
      if (typeof a.price === 'number' && typeof b.price === 'number') {
        if (a.price !== b.price) {
          return a.price - b.price;
        }
      }
      return (a.dist || 0) - (b.dist || 0);
    });
    return {
      displayStations: sorted,
      cheapestPrice: cheapest
    };
  }, [stations, stationLimit]);
  const handleFind = useCallback(async () => {
    setLoading(true);
    // Reset route mode when finding regular stations
    setRouteMode(false);
    setDestination(null);
    setRoutePath(null);
    analytics.trackStationSearch(fuelType, canUseGeo);
    try {
      let loc = null;

      // ALWAYS request fresh location on every button click - NO FALLBACK
      if (canUseGeo) {
        try {
          loc = await requestLocation();
          console.log('Fresh location obtained:', loc);

          // Check if location is within Germany
          if (!isLocationInGermany(loc.lat, loc.lng)) {
            setStations([]);
            setUserLoc(null);
            setOutsideGermany(true);
            toast({
              title: t('outside_germany_title'),
              description: t('outside_germany_desc')
            });
            return;
          }

          // Clear outside Germany flag if we're now in Germany
          setOutsideGermany(false);
        } catch (geoError) {
          console.warn('Geolocation failed:', geoError);
          // NO FALLBACK - show error and stop
          setStations([]);
          setUserLoc(null);
          toast({
            title: t('location_error_title'),
            description: locationError ? t(`location_${locationError}`) : t('location_error_desc')
          });
          return;
        }
      } else {
        // If geolocation not available, show error and stop - NO FALLBACK
        setStations([]);
        setUserLoc(null);
        toast({
          title: t('toast_secure_title'),
          description: t('toast_secure_desc')
        });
        return;
      }

      // Check if fuel type is supported
      if (!SUPPORTED_FUEL_TYPES.has(fuelType)) {
        toast({
          title: 'Fuel not available',
          description: 'Super Plus and LPG are not supported yet.'
        });
        setStations([]);
        setUserLoc(loc);
        return;
      }

      // Fetch data with retry mechanism and exponential backoff
      let fetched: Station[] = [];
      let retryCount = 0;
      const MAX_RETRIES = 2;
      while (retryCount <= MAX_RETRIES) {
        try {
          fetched = await throttledFetchStations(loc.lat, loc.lng);
          break; // Success, exit loop
        } catch (e: any) {
          console.error(`Fetch attempt ${retryCount + 1} failed:`, e);
          if (retryCount === MAX_RETRIES) {
            // Last attempt failed
            setUserLoc(loc);
            setStations([]);
            toast({
              title: "Service momentan nicht verfügbar",
              description: "Die Tankstellen-Daten können gerade nicht abgerufen werden. Dein Standort wird trotzdem angezeigt.",
              variant: "destructive",
              action: <Button size="sm" onClick={() => handleFind()}>
                  Erneut versuchen
                </Button>
            });
            setLoading(false);
            return;
          }

          // Exponential backoff: 2s, 4s
          const delay = Math.pow(2, retryCount) * 2000;
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          retryCount++;
        }
      }

      // Success - update state atomically to prevent race conditions
      setUserLoc(loc);
      setStations(fetched);
      analytics.trackStationsLoaded(fetched.length, radius);
      toast({
        title: t('toast_found_title'),
        description: t('toast_found_desc', {
          count: fetched.length
        })
      });

      // Scroll to results section
      setTimeout(() => {
        document.getElementById('hero-subtitle')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 200);
    } catch (e: any) {
      console.error('Failed to fetch stations:', e);

      // Enhanced error handling with specific messages
      let errorTitle = "Fehler";
      let errorDesc = "Tankstellen konnten nicht geladen werden. Bitte versuche es erneut.";
      let variant: "default" | "destructive" = "default";
      if (e.message) {
        if (e.message.includes('429') || e.message.includes('rate limit')) {
          errorTitle = "Zu viele Anfragen";
          errorDesc = "Die maximale Anzahl an Anfragen wurde erreicht. Bitte warte einen Moment und versuche es erneut.";
          variant = "destructive";
        } else if (e.message.includes('503') || e.message.includes('unavailable')) {
          errorTitle = "Service nicht verfügbar";
          errorDesc = "Der Tankstellen-Service ist momentan überlastet. Bitte versuche es in wenigen Minuten erneut.";
          variant = "destructive";
        } else if (e.message.includes('network') || e.message.includes('fetch')) {
          errorTitle = "Verbindungsfehler";
          errorDesc = "Keine Internetverbindung. Bitte überprüfe deine Verbindung und versuche es erneut.";
        }
      }
      toast({
        title: errorTitle,
        description: errorDesc,
        variant
      });

      // Show empty results - NO FALLBACK LOCATION
      setStations([]);
    } finally {
      setLoading(false);
    }
  }, [canUseGeo, fetchStations, fuelType, t]);

  // Show loading while checking auth or subscription
  if (checkingAuth || subLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate route using OSRM
  const calculateRoute = async (start: {
    lat: number;
    lng: number;
  }, end: {
    lat: number;
    lng: number;
  }) => {
    // Validate coordinates before API call
    if (!validateCoordinates(start.lat, start.lng) || !validateCoordinates(end.lat, end.lng)) {
      throw new Error("Invalid coordinates for route calculation");
    }
    try {
      const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`);
      const data = await response.json();
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        return data.routes[0].geometry.coordinates as Array<[number, number]>;
      }
      return null;
    } catch (error) {
      console.error('Route calculation error:', error);
      return null;
    }
  };

  // Calculate distance from point to line segment
  const pointToLineDistance = (point: [number, number], lineStart: [number, number], lineEnd: [number, number]): number => {
    const [px, py] = point;
    const [x1, y1] = lineStart;
    const [x2, y2] = lineEnd;
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) param = dot / lenSq;
    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    // Use Haversine distance for precision
    return calculateDistance(py, px, yy, xx);
  };

  // Check if station is near route
  const isStationNearRoute = (station: Station, route: Array<[number, number]>, maxDistanceKm: number = 1.5): boolean => {
    for (let i = 0; i < route.length - 1; i++) {
      const distance = pointToLineDistance([station.lng, station.lat], route[i], route[i + 1]);
      if (distance <= maxDistanceKm) {
        return true;
      }
    }
    return false;
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Get checkpoints along route for multiple API requests
  const getRouteCheckpoints = (routeSegment: Array<[number, number]>): Array<{
    lat: number;
    lng: number;
  }> => {
    const checkpoints: Array<{
      lat: number;
      lng: number;
    }> = [];
    const segmentLength = 40; // km - create checkpoint every 40 km for 50 km radius coverage
    let cumulativeDistance = 0;

    // Add start point
    checkpoints.push({
      lat: routeSegment[0][1],
      lng: routeSegment[0][0]
    });
    for (let i = 0; i < routeSegment.length - 1; i++) {
      const [lng1, lat1] = routeSegment[i];
      const [lng2, lat2] = routeSegment[i + 1];
      const segmentDist = calculateDistance(lat1, lng1, lat2, lng2);
      cumulativeDistance += segmentDist;
      if (cumulativeDistance >= segmentLength) {
        checkpoints.push({
          lat: lat2,
          lng: lng2
        });
        cumulativeDistance = 0;
      }
    }

    // Add end point if not already included
    const lastPoint = routeSegment[routeSegment.length - 1];
    const lastCheckpoint = checkpoints[checkpoints.length - 1];
    if (lastCheckpoint.lat !== lastPoint[1] || lastCheckpoint.lng !== lastPoint[0]) {
      checkpoints.push({
        lat: lastPoint[1],
        lng: lastPoint[0]
      });
    }
    return checkpoints;
  };

  // Fetch stations for a single checkpoint
  const fetchStationsForCheckpoint = async (checkpoint: {
    lat: number;
    lng: number;
  }, userLat: number, userLng: number, retries: number = 2): Promise<Station[]> => {
    const radius = 50; // Maximum API limit

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const {
          data,
          error
        } = await supabase.functions.invoke("fetch-stations", {
          body: {
            lat: checkpoint.lat,
            lng: checkpoint.lng,
            radius: radius,
            type: fuelType
          }
        });
        if (error) {
          if (attempt < retries) {
            console.warn(`Checkpoint failed (attempt ${attempt + 1}/${retries + 1}), retrying...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          console.warn(`Checkpoint at ${checkpoint.lat},${checkpoint.lng} failed after ${retries + 1} attempts`);
          return [];
        }
        const stations = (data?.stations ?? []) as Station[];

        // Recalculate distance from user location
        return stations.map(station => ({
          ...station,
          dist: calculateDistance(userLat, userLng, station.lat, station.lng)
        }));
      } catch (err) {
        if (attempt < retries) {
          console.warn(`Error on attempt ${attempt + 1}, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        console.warn(`Error fetching stations after ${retries + 1} attempts:`, err);
        return [];
      }
    }
    return [];
  };

  // Calculate total route length in km
  const calculateTotalRouteLength = (route: Array<[number, number]>): number => {
    let totalDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
      const [lng1, lat1] = route[i];
      const [lng2, lat2] = route[i + 1];
      totalDistance += calculateDistance(lat1, lng1, lat2, lng2);
    }
    return totalDistance;
  };

  // Calculate route length in km (first 200 km from start for station search)
  const getRouteSegmentWithin200km = (route: Array<[number, number]>): Array<[number, number]> => {
    const maxDistance = 200; // km (reduziert von 300km für bessere API-Performance)
    let cumulativeDistance = 0;
    const segment: Array<[number, number]> = [route[0]];
    for (let i = 0; i < route.length - 1; i++) {
      const [lng1, lat1] = route[i];
      const [lng2, lat2] = route[i + 1];

      // Use precise Haversine distance calculation
      const segmentDist = calculateDistance(lat1, lng1, lat2, lng2);
      cumulativeDistance += segmentDist;
      segment.push(route[i + 1]);
      if (cumulativeDistance >= maxDistance) {
        break;
      }
    }
    return segment;
  };

  // Calculate bounding box for route segment
  const getBoundingBoxForRoute = (routeSegment: Array<[number, number]>): {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
    centerLat: number;
    centerLng: number;
  } => {
    const lats = routeSegment.map(coord => coord[1]);
    const lngs = routeSegment.map(coord => coord[0]);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const centerLat = (minLat + maxLat) / 2;

    // Calculate buffer dynamically based on latitude
    // 2.5 km buffer
    const bufferKm = 2.5;
    const latBuffer = bufferKm / 111; // Latitude: 1° ≈ 111 km everywhere
    const lngBuffer = bufferKm / (111 * Math.cos(centerLat * Math.PI / 180)); // Longitude: varies by latitude

    return {
      minLat: minLat - latBuffer,
      maxLat: maxLat + latBuffer,
      minLng: minLng - lngBuffer,
      maxLng: maxLng + lngBuffer,
      centerLat: centerLat,
      centerLng: (minLng + maxLng) / 2
    };
  };

  // Handle route search
  const handleRouteSearch = async (destinationAddress: string, coords: {
    lat: number;
    lng: number;
  }) => {
    setLoading(true);
    try {
      // Request location
      let loc = null;
      if (canUseGeo) {
        try {
          loc = await requestLocation();
          if (!isLocationInGermany(loc.lat, loc.lng)) {
            setRouteDialogOpen(false);
            setOutsideGermany(true);
            toast({
              title: t('outside_germany_title'),
              description: t('outside_germany_desc')
            });
            setLoading(false);
            return;
          }
          setOutsideGermany(false);
        } catch (geoError) {
          setRouteDialogOpen(false);
          toast({
            title: t('location_error_title'),
            description: locationError ? t(`location_${locationError}`) : t('location_error_desc')
          });
          setLoading(false);
          return;
        }
      } else {
        setRouteDialogOpen(false);
        toast({
          title: t('toast_secure_title'),
          description: t('toast_secure_desc')
        });
        setLoading(false);
        return;
      }

      // Use provided coordinates directly from Photon
      const destCoords = coords;

      // Calculate route
      const route = await calculateRoute(loc, destCoords);
      if (!route) {
        toast({
          title: t('route_error_directions')
        });
        setLoading(false);
        return;
      }

      // Calculate total route length
      const totalLength = calculateTotalRouteLength(route);
      setRouteLength(totalLength);
      console.log(`Total route length: ${totalLength.toFixed(1)} km`);

      // Get first 200 km of route for station search (reduces API load)
      // Full route is still displayed on map
      const routeSegment = getRouteSegmentWithin200km(route);

      // Get checkpoints along route (every 40 km for 50 km radius coverage)
      const checkpoints = getRouteCheckpoints(routeSegment);
      console.log(`Created ${checkpoints.length} checkpoints for route`);

      // Fetch stations in batches to avoid API overload
      console.log(`Fetching stations for ${checkpoints.length} checkpoints in batches`);
      const BATCH_SIZE = 3;
      const BATCH_DELAY = 1000; // 1 second between batches
      const stationResults: Station[][] = [];
      for (let i = 0; i < checkpoints.length; i += BATCH_SIZE) {
        const batch = checkpoints.slice(i, i + BATCH_SIZE);
        console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(checkpoints.length / BATCH_SIZE)}`);
        const batchPromises = batch.map(checkpoint => fetchStationsForCheckpoint(checkpoint, loc.lat, loc.lng));
        const batchResults = await Promise.all(batchPromises);
        stationResults.push(...batchResults);

        // Wait before next batch (except for last batch)
        if (i + BATCH_SIZE < checkpoints.length) {
          await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
        }
      }

      // Flatten and deduplicate stations by ID
      const allStationsMap = new Map<string, Station>();
      stationResults.flat().forEach(station => {
        if (!allStationsMap.has(station.id)) {
          allStationsMap.set(station.id, station);
        }
      });
      const allStations = Array.from(allStationsMap.values());
      console.log(`Found ${allStations.length} unique stations across all checkpoints`);

      // Filter stations near route (within 1.5 km)
      const routeStations = allStations.filter(station => isStationNearRoute(station, routeSegment));

      // Sort by price and take top 20
      const cheapestStations = routeStations.filter(s => typeof s.price === 'number').sort((a, b) => (a.price || 0) - (b.price || 0)).slice(0, 10);

      // Update state
      setUserLoc(loc);
      setDestination({
        lat: destCoords.lat,
        lng: destCoords.lng,
        address: destinationAddress
      });
      setRoutePath(route);
      setStations(cheapestStations);
      setRouteMode(true);
      setRouteDialogOpen(false);
      if (cheapestStations.length === 0) {
        toast({
          title: t('route_no_stations')
        });
      } else {
        toast({
          title: t('toast_found_title'),
          description: t('toast_found_desc', {
            count: cheapestStations.length
          })
        });
      }

      // Scroll to results section
      setTimeout(() => {
        document.getElementById('hero-subtitle')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 200);
    } catch (error) {
      console.error('Route search error:', error);
      toast({
        title: "Error",
        description: "Failed to calculate route. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <header className="container py-8 animate-fade-in">
        <nav className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <img src={cheapfuelLogo} alt="Cheapfuel Logo" className="h-10 w-10" />
            Cheapfuel
          </a>
          <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{t('profile')}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 py-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{t('language')}</p>
                  <LanguageMenu onLanguageChange={() => setUserMenuOpen(false)} />
                </div>
              </div>
              <DropdownMenuSeparator />
              {subscribed && (
                <>
                  <DropdownMenuItem onClick={manageSubscription}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t('manage_subscription')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={async () => {
                await supabase.auth.signOut();
                navigate("/onboarding");
              }}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

      </header>

      <main>
        <section className="container py-10 md:py-16 opacity-0 animate-fade-in" style={{
        animationDelay: '0.2s'
      }}>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {t('hero_title')}
            </h1>
            <p id="hero-subtitle" className="text-lg md:text-xl text-muted-foreground mb-8">
              {t('hero_subtitle')}
            </p>
            
            {/* Location Error Alert */}
            {locationError && <Alert className="max-w-md mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {t(`location_${locationError}`)}
                  {locationError === 'instagram' && <div className="mt-2 text-xs">
                      {t('instagram_help')}
                    </div>}
                </AlertDescription>
              </Alert>}

            {/* Outside Germany Alert - only show after user clicked and is outside Germany */}
            {outsideGermany && <Alert className="max-w-md mb-6 border-red-200 bg-red-50">
                <Globe className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {t('outside_germany_alert')}
                </AlertDescription>
              </Alert>}
            
            <div id="controls" className="flex flex-col items-center justify-center gap-4">
              <div className="flex flex-row items-center gap-4">
                <Select value={fuelType} onValueChange={v => {
                const newType = v as "e5" | "e10" | "diesel";
                analytics.trackFuelTypeChange(fuelType, newType);
                setFuelType(newType);
              }}>
                  <SelectTrigger className="w-32" aria-label="Fuel type">
                    <SelectValue placeholder="Fuel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="e5">Super 95</SelectItem>
                    <SelectItem value="e10">Super E10</SelectItem>
                  </SelectContent>
                </Select>
                
                {!routeMode && <div className="flex items-center gap-1 border border-input rounded-md p-1 bg-background">
                    {[5, 10, 15, 20].map(limit => <button key={limit} onClick={() => setStationLimit(limit)} className={`px-3 py-1 rounded text-sm transition-colors ${stationLimit === limit ? 'bg-black text-white' : 'text-black hover:bg-black/10'}`}>
                        {limit}
                      </button>)}
                  </div>}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" onClick={handleFind} disabled={loading} className="group" aria-label="Find cheapest fuel stations near you">
                  <Fuel className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
                  {loading ? t('finding') : t('find_button')}
                </Button>
                <Button size="lg" variant="outline" onClick={async () => {
                // Request location first if not available
                if (!userLoc && canUseGeo) {
                  setLoading(true);
                  try {
                    const loc = await requestLocation();

                    // Check if in Germany
                    if (!isLocationInGermany(loc.lat, loc.lng)) {
                      setOutsideGermany(true);
                      toast({
                        title: t('outside_germany_title'),
                        description: t('outside_germany_desc')
                      });
                      setLoading(false);
                      return;
                    }
                    setUserLoc(loc);
                    setOutsideGermany(false);
                    setRouteDialogOpen(true);
                  } catch (error) {
                    console.error('Location request failed:', error);
                    toast({
                      title: t('location_error_title'),
                      description: locationError ? t(`location_${locationError}`) : t('location_error_desc')
                    });
                  } finally {
                    setLoading(false);
                  }
                } else if (userLoc) {
                  // Location already available, open dialog directly
                  setRouteDialogOpen(true);
                } else {
                  // Geolocation not available
                  toast({
                    title: t('toast_secure_title'),
                    description: t('toast_secure_desc')
                  });
                }
              }} disabled={loading} style={{
                WebkitTapHighlightColor: 'transparent'
              }} className="group text-center text-black text-base bg-sky-50" aria-label="Find fuel stations along your route">
                  <Route className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                  {t('route_button')}
                </Button>
              </div>
              
              {/* Status messages */}
              {!canUseGeo && <span className="text-sm text-muted-foreground">{t('https_required')}</span>}
              {userLoc && !loading}
            </div>
          </div>
        </section>

        <section id="content" className="container pb-16 opacity-0 animate-fade-in" style={{
        animationDelay: '0.4s'
      }}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div id="map" className="lg:col-span-3">
              <CheapfuelMap userLocation={userLoc} stations={displayStations} onNavigate={handleStationClick} cheapestPrice={cheapestPrice} routePath={routePath} destination={destination} />
            </div>
            <aside id="results" className="lg:col-span-2">
              <Card>
                <CardContent className="p-0">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold">
                        {routeMode ? routeLength > 200 ? t('route_stations_along') : t('route_stations_along_short') : t('cheapest_stations')}
                      </h2>
                      <div className="text-sm text-muted-foreground">{t('results_count', {
                        count: displayStations.length
                      })}</div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {routeMode ? `${t('fuel_radius', {
                      type: fuelType.toUpperCase(),
                      radius: '2.5 km'
                    })}` : t('fuel_radius', {
                      type: fuelType.toUpperCase(),
                      radius: radius
                    })}
                    </div>
                  </div>
                  <ul className="divide-y">
                    {displayStations.length === 0 && <li className="p-4 text-sm text-muted-foreground">{t('no_results')}</li>}
                    {displayStations.map((s, index) => <li key={s.id} className="p-4 hover:bg-accent/5 cursor-pointer transition-colors" onClick={() => handleStationClick(s)}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium leading-6">{s.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-2 mt-0.5">
                                <MapPin className="h-4 w-4" /> {typeof s.dist === "number" ? `${s.dist.toFixed(1)} km` : "–"}
                                {s.isOpen ? <span className="text-green-600 font-medium">open</span> : <span className="text-red-600 font-medium">close</span>}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold ${s.price === cheapestPrice ? 'text-green-600' : ''}`}>
                              {formatPrice(s.price)}
                            </div>
                          </div>
                        </div>
                      </li>)}
                  </ul>
                </CardContent>
              </Card>
            </aside>
          </div>
        </section>
      </main>

      <Footer />

      {/* Navigation Dialog */}
      <NavigationDialog station={navigationStation} onClose={() => setNavigationStation(null)} routeMode={routeMode} origin={routeMode ? userLoc || undefined : undefined} destination={routeMode ? destination || undefined : undefined} />

      {/* Route Search Dialog */}
      <RouteSearchDialog open={routeDialogOpen} onOpenChange={setRouteDialogOpen} onSearch={handleRouteSearch} loading={loading} userLocation={userLoc} />
    </div>;
};
export default Index;