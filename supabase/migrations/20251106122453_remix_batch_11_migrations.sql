
-- Migration: 20251013055641
-- Enable PostGIS extension for spatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create enum for fuel types
CREATE TYPE public.fuel_type AS ENUM ('e5', 'e10', 'diesel');

-- Table: stations (static data)
CREATE TABLE public.stations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  street TEXT,
  house_number TEXT,
  post_code TEXT,
  city TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  location GEOGRAPHY(POINT, 4326), -- PostGIS point for spatial queries
  is_open BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create spatial index for fast geo-queries
CREATE INDEX idx_stations_location ON public.stations USING GIST (location);

-- Table: fuel_prices (historical prices)
CREATE TABLE public.fuel_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id TEXT NOT NULL REFERENCES public.stations(id) ON DELETE CASCADE,
  fuel_type public.fuel_type NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for fast price lookups
CREATE INDEX idx_fuel_prices_station_fuel ON public.fuel_prices(station_id, fuel_type, created_at DESC);

-- Table: sync_logs (monitoring)
CREATE TABLE public.sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type TEXT NOT NULL, -- 'initial_import', 'price_update'
  stations_synced INTEGER DEFAULT 0,
  stations_failed INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  status TEXT NOT NULL DEFAULT 'running' -- 'running', 'completed', 'failed'
);

-- Enable Row Level Security
ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

-- Public read access for stations and prices (no auth required)
CREATE POLICY "Public stations read access" ON public.stations FOR SELECT USING (true);
CREATE POLICY "Public fuel_prices read access" ON public.fuel_prices FOR SELECT USING (true);
CREATE POLICY "Public sync_logs read access" ON public.sync_logs FOR SELECT USING (true);

-- Function: find_nearby_stations
CREATE OR REPLACE FUNCTION public.find_nearby_stations(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_km INTEGER,
  fuel_type_filter public.fuel_type
)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  brand TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  dist DOUBLE PRECISION,
  price DOUBLE PRECISION,
  is_open BOOLEAN,
  fuel_type TEXT,
  price_updated_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.brand,
    s.lat,
    s.lng,
    ST_Distance(
      s.location,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    ) / 1000.0 AS dist, -- Distance in km
    fp.price,
    s.is_open,
    fp.fuel_type::TEXT,
    fp.created_at AS price_updated_at
  FROM public.stations s
  LEFT JOIN LATERAL (
    SELECT price, fuel_type, created_at
    FROM public.fuel_prices
    WHERE station_id = s.id 
      AND fuel_type = fuel_type_filter
    ORDER BY created_at DESC
    LIMIT 1
  ) fp ON true
  WHERE ST_DWithin(
    s.location,
    ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
    radius_km * 1000 -- Convert km to meters
  )
  AND fp.price IS NOT NULL -- Only return stations with prices
  ORDER BY dist ASC, fp.price ASC;
END;
$$;

-- Trigger: Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stations_updated_at
  BEFORE UPDATE ON public.stations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Migration: 20251013055729
-- Fix 1: Update function search paths
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix 2: Move PostGIS extension to extensions schema
CREATE SCHEMA IF NOT EXISTS extensions;
DROP EXTENSION IF EXISTS postgis CASCADE;
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;

-- Fix 3: Update find_nearby_stations function to use correct schema
CREATE OR REPLACE FUNCTION public.find_nearby_stations(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_km INTEGER,
  fuel_type_filter public.fuel_type
)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  brand TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  dist DOUBLE PRECISION,
  price DOUBLE PRECISION,
  is_open BOOLEAN,
  fuel_type TEXT,
  price_updated_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.brand,
    s.lat,
    s.lng,
    extensions.ST_Distance(
      s.location,
      extensions.ST_SetSRID(extensions.ST_MakePoint(user_lng, user_lat), 4326)::geography
    ) / 1000.0 AS dist,
    fp.price,
    s.is_open,
    fp.fuel_type::TEXT,
    fp.created_at AS price_updated_at
  FROM public.stations s
  LEFT JOIN LATERAL (
    SELECT price, fuel_type, created_at
    FROM public.fuel_prices
    WHERE station_id = s.id 
      AND fuel_type = fuel_type_filter
    ORDER BY created_at DESC
    LIMIT 1
  ) fp ON true
  WHERE extensions.ST_DWithin(
    s.location,
    extensions.ST_SetSRID(extensions.ST_MakePoint(user_lng, user_lat), 4326)::geography,
    radius_km * 1000
  )
  AND fp.price IS NOT NULL
  ORDER BY dist ASC, fp.price ASC;
END;
$$;

-- Migration: 20251013060041
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule hourly price sync
SELECT cron.schedule(
  'hourly-fuel-price-sync',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT
    net.http_post(
      url := 'https://vjmkxotqexywevkygamb.supabase.co/functions/v1/sync-fuel-prices',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqbWt4b3RxZXh5d2V2a3lnYW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTc5NDIsImV4cCI6MjA3NTU3Mzk0Mn0.FXS931oDf4s-kedytyDKeOPtp3fNE4_ke1UlPpK-yUg"}'::jsonb,
      body := '{}'::jsonb
    ) as request_id;
  $$
);

-- Migration: 20251013064104
-- Add location column to stations table
ALTER TABLE public.stations 
ADD COLUMN location geography(Point, 4326);

-- Create spatial index for performance
CREATE INDEX IF NOT EXISTS idx_stations_location 
ON public.stations USING GIST (location);

-- Create trigger function to automatically populate location from lat/lng
CREATE OR REPLACE FUNCTION public.update_station_location()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location = ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326)::geography;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update location on insert/update
DROP TRIGGER IF EXISTS trigger_update_station_location ON public.stations;
CREATE TRIGGER trigger_update_station_location
  BEFORE INSERT OR UPDATE OF lat, lng ON public.stations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_station_location();

-- Migrate existing data (if any)
UPDATE public.stations 
SET location = ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography 
WHERE location IS NULL AND lat IS NOT NULL AND lng IS NOT NULL;

-- Migration: 20251013064134
-- Fix search_path for update_station_location function
CREATE OR REPLACE FUNCTION public.update_station_location()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  NEW.location = extensions.ST_SetSRID(extensions.ST_MakePoint(NEW.lng, NEW.lat), 4326)::geography;
  RETURN NEW;
END;
$$;

-- Migration: 20251014071640
-- Phase 3: Database Optimization

-- 3.1 Performance Indexes
-- Geospatial index for radius search (already exists, but ensuring it's optimal)
CREATE INDEX IF NOT EXISTS idx_stations_location ON public.stations USING GIST(location);

-- Index for fuel price queries (station, type, latest first)
CREATE INDEX IF NOT EXISTS idx_fuel_prices_station_type_date 
ON public.fuel_prices(station_id, fuel_type, created_at DESC);

-- Index for sync logs (latest first)
CREATE INDEX IF NOT EXISTS idx_sync_logs_timestamp 
ON public.sync_logs(started_at DESC);

-- Index for open stations (filtered index)
CREATE INDEX IF NOT EXISTS idx_stations_open 
ON public.stations(is_open) 
WHERE is_open = true;

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_fuel_prices_lookup 
ON public.fuel_prices(fuel_type, created_at DESC);

-- 3.2 Materialized View for Latest Prices
-- This dramatically speeds up price lookups
CREATE MATERIALIZED VIEW IF NOT EXISTS latest_fuel_prices AS
SELECT DISTINCT ON (station_id, fuel_type)
  station_id,
  fuel_type,
  price,
  created_at as price_updated_at
FROM public.fuel_prices
ORDER BY station_id, fuel_type, created_at DESC;

-- Index on materialized view for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_latest_fuel_prices_station_type 
ON latest_fuel_prices(station_id, fuel_type);

CREATE INDEX IF NOT EXISTS idx_latest_fuel_prices_type_price 
ON latest_fuel_prices(fuel_type, price);

-- 3.3 Function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_latest_prices()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY latest_fuel_prices;
END;
$$;

-- 3.4 Optimized find_nearby_stations function using materialized view
CREATE OR REPLACE FUNCTION public.find_nearby_stations_optimized(
  user_lat double precision, 
  user_lng double precision, 
  radius_km integer, 
  fuel_type_filter fuel_type
)
RETURNS TABLE(
  id text,
  name text,
  brand text,
  lat double precision,
  lng double precision,
  dist double precision,
  price double precision,
  is_open boolean,
  fuel_type text,
  price_updated_at timestamp with time zone
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.brand,
    s.lat,
    s.lng,
    extensions.ST_Distance(
      s.location,
      extensions.ST_SetSRID(extensions.ST_MakePoint(user_lng, user_lat), 4326)::geography
    ) / 1000.0 AS dist,
    lfp.price,
    s.is_open,
    lfp.fuel_type::TEXT,
    lfp.price_updated_at
  FROM public.stations s
  INNER JOIN public.latest_fuel_prices lfp ON s.id = lfp.station_id
  WHERE extensions.ST_DWithin(
    s.location,
    extensions.ST_SetSRID(extensions.ST_MakePoint(user_lng, user_lat), 4326)::geography,
    radius_km * 1000
  )
  AND lfp.fuel_type = fuel_type_filter
  AND s.is_open = true
  ORDER BY dist ASC, lfp.price ASC
  LIMIT 100;
END;
$function$;

-- 3.5 Add index for better station updates
CREATE INDEX IF NOT EXISTS idx_stations_id ON public.stations(id);

-- 3.6 Trigger to auto-refresh materialized view after bulk inserts
-- Note: For production, this should be called manually after sync completes
-- to avoid performance issues during insert operations;

-- Migration: 20251014071757
-- Fix security warning: Revoke public access to materialized view
-- The materialized view is only used internally by database functions
-- and should not be directly accessible via the API

REVOKE ALL ON latest_fuel_prices FROM anon;
REVOKE ALL ON latest_fuel_prices FROM authenticated;
REVOKE ALL ON latest_fuel_prices FROM public;

-- Grant access only to postgres and service_role for internal use
GRANT SELECT ON latest_fuel_prices TO postgres;
GRANT SELECT ON latest_fuel_prices TO service_role;

-- Migration: 20251016131001
-- Enable required extensions for cron jobs and HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create cron job for hourly fuel price sync
SELECT cron.schedule(
  'hourly-fuel-price-sync',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT
    net.http_post(
        url:='https://vjmkxotqexywevkygamb.supabase.co/functions/v1/sync-fuel-prices',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqbWt4b3RxZXh5d2V2a3lnYW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTc5NDIsImV4cCI6MjA3NTU3Mzk0Mn0.FXS931oDf4s-kedytyDKeOPtp3fNE4_ke1UlPpK-yUg"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);

-- Migration: 20251020131328
-- Remove orphaned cron job that references non-existent sync-fuel-prices function
SELECT cron.unschedule('hourly-fuel-price-sync');

-- Migration: 20251020133259
-- Fix Security Issue #1: Remove public access to sync_logs table
-- This table contains operational metadata that shouldn't be exposed to anonymous users
DROP POLICY IF EXISTS "Public sync_logs read access" ON public.sync_logs;

-- Fix Security Issue #2: Move PostGIS extensions to proper schemas
-- Create the necessary schemas if they don't exist
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE SCHEMA IF NOT EXISTS topology;

-- Move PostGIS extensions from public to proper schemas
-- Note: postgis goes to extensions, postgis_topology must go to topology
DROP EXTENSION IF EXISTS postgis CASCADE;
DROP EXTENSION IF EXISTS postgis_topology CASCADE;

-- Recreate in the correct schemas
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS postgis_topology WITH SCHEMA topology;

-- Grant usage on schemas to authenticated and anon roles
GRANT USAGE ON SCHEMA extensions TO authenticated, anon;
GRANT USAGE ON SCHEMA topology TO authenticated, anon;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA extensions TO authenticated, anon;
GRANT ALL ON ALL TABLES IN SCHEMA extensions TO authenticated, anon;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA topology TO authenticated, anon;
GRANT ALL ON ALL TABLES IN SCHEMA topology TO authenticated, anon;

-- Migration: 20251022143748
-- Fix sync_logs table: Disable RLS for backend-only logging table
-- This table is used exclusively by backend processes for sync operation logging
-- and should not be subject to row-level security policies
ALTER TABLE public.sync_logs DISABLE ROW LEVEL SECURITY;
