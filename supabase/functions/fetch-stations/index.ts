import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Validation schemas
const requestSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  radius: z.number().min(1).max(50).default(5),
  type: z.enum(['e5', 'e10', 'diesel']).default('e5'),
  sort: z.enum(['price', 'dist']).optional(),
  stationId: z.string().optional()
});

// Generic error messages for clients
const ERROR_MESSAGES = {
  400: 'Invalid request parameters',
  429: 'Too many requests. Please try again later.',
  503: 'Service temporarily unavailable',
  500: 'An error occurred. Please try again.'
};

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 900000; // 15 minutes

// Cleanup old cache entries every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION * 2) {
      cache.delete(key);
      console.log(`[Cache] Cleaned up stale entry: ${key}`);
    }
  }
}, 30 * 60 * 1000);


serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check API key
    const apiKey = Deno.env.get("Tankkoenigapikey");
    if (!apiKey) {
      console.error("[CRITICAL] Tankkoenigapikey not configured");
      return new Response(JSON.stringify({ 
        error: ERROR_MESSAGES[503]
      }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Validate request body
    const body = await req.json();
    const validation = requestSchema.safeParse(body);
    
    if (!validation.success) {
      console.error("[Validation] Invalid parameters:", validation.error.issues);
      return new Response(JSON.stringify({ 
        error: ERROR_MESSAGES[400]
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const { lat, lng, radius, type, stationId } = validation.data;
    console.log(`[Request] lat=${lat}, lng=${lng}, radius=${radius}, type=${type}, stationId=${stationId}`);
    
    // Create cache key
    const cacheKey = stationId ? `detail-${stationId}` : `list-${lat}-${lng}-${radius}-${type}`;
    
    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
      console.log("[Cache] Hit for", cacheKey);
      return new Response(JSON.stringify(cached.data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch station details
    if (stationId) {
      const detailUrl = `https://creativecommons.tankerkoenig.de/json/detail.php?id=${stationId}&apikey=${apiKey}`;
      
      const detailResponse = await fetch(detailUrl);
      if (!detailResponse.ok) {
        console.error(`[Upstream] Detail API error: ${detailResponse.status}`);
        
        if (detailResponse.status === 503) {
          const fallbackCached = cache.get(cacheKey);
          if (fallbackCached) {
            console.log("[Cache] Using stale data due to upstream rate limit");
            return new Response(JSON.stringify(fallbackCached.data), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          return new Response(JSON.stringify({ 
            error: ERROR_MESSAGES[503]
          }), {
            status: 503,
            headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "60" }
          });
        }
        
        return new Response(JSON.stringify({ 
          error: ERROR_MESSAGES[500]
        }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const detailData = await detailResponse.json();
      if (!detailData.ok || !detailData.station) {
        console.error("[Upstream] Invalid detail response structure");
        return new Response(JSON.stringify({ 
          error: ERROR_MESSAGES[500]
        }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const station = detailData.station;
      const responseData = { 
        station: {
          id: station.id,
          name: station.name || station.brand || "Unknown",
          brand: station.brand ?? null,
          lat: station.lat,
          lng: station.lng,
          isOpen: station.isOpen === true,
          openingTimes: station.openingTimes || [],
          overrides: station.overrides || [],
          wholeDay: station.wholeDay === true,
          price: {
            e5: station.e5,
            e10: station.e10,
            diesel: station.diesel
          }
        }
      };
      
      cache.set(cacheKey, { data: responseData, timestamp: Date.now() });
      
      return new Response(JSON.stringify(responseData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch station list
    const url = `https://creativecommons.tankerkoenig.de/json/list.php?lat=${lat}&lng=${lng}&rad=${radius}&sort=dist&type=${type}&apikey=${apiKey}`;

    const upstream = await fetch(url);
    if (!upstream.ok) {
      console.error(`[Upstream] List API error: ${upstream.status}`);
      
      if (upstream.status === 503) {
        const fallbackCached = cache.get(cacheKey);
        if (fallbackCached) {
          const age = Date.now() - fallbackCached.timestamp;
          console.log(`[Cache] Using stale data (age: ${age}ms) due to upstream rate limit`);
          return new Response(JSON.stringify({
            ...fallbackCached.data,
            cached: true,
            cacheAge: age
          }), {
            headers: { 
              ...corsHeaders, 
              "Content-Type": "application/json",
              "X-Cache-Age": age.toString()
            },
          });
        }
        return new Response(JSON.stringify({ 
          error: ERROR_MESSAGES[503],
          stations: [] 
        }), {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "60" }
        });
      }
      
      return new Response(JSON.stringify({ 
        error: ERROR_MESSAGES[500]
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const data = await upstream.json();
    if (!data.ok || !Array.isArray(data.stations)) {
      console.error("[Upstream] Invalid list response structure");
      return new Response(JSON.stringify({ 
        error: ERROR_MESSAGES[500]
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const stations = data.stations.map((s: any) => ({
      id: s.id,
      name: s.name || s.brand || "Unknown",
      brand: s.brand ?? null,
      lat: s.lat,
      lng: s.lng,
      dist: typeof s.dist === "number" ? s.dist : null,
      price: typeof s.price === "number" ? s.price : null,
      isOpen: s.isOpen === true,
      fuelType: type,
    }));

    // Sort by distance first, then by price
    stations.sort((a: any, b: any) => {
      const distA = typeof a.dist === "number" ? a.dist : Number.POSITIVE_INFINITY;
      const distB = typeof b.dist === "number" ? b.dist : Number.POSITIVE_INFINITY;
      
      if (Math.abs(distA - distB) > 0.01) {
        return distA - distB;
      }
      
      const priceA = typeof a.price === "number" ? a.price : Number.POSITIVE_INFINITY;
      const priceB = typeof b.price === "number" ? b.price : Number.POSITIVE_INFINITY;
      return priceA - priceB;
    });

    const responseData = { stations };
    cache.set(cacheKey, { data: responseData, timestamp: Date.now() });

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("[Error]", e.message || "Unknown error");
    return new Response(JSON.stringify({ 
      error: ERROR_MESSAGES[500]
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
