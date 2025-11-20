-- Priority 1: Move PostGIS extension to separate schema and improve RLS policies

-- 1. Create extensions schema if not exists
CREATE SCHEMA IF NOT EXISTS extensions;

-- 2. Move PostGIS extension to extensions schema
ALTER EXTENSION postgis SET SCHEMA extensions;

-- 3. Update sync_logs RLS policy to be more robust
-- Drop the weak policy
DROP POLICY IF EXISTS "No public access to sync_logs" ON public.sync_logs;
DROP POLICY IF EXISTS "Service role can manage sync logs" ON public.sync_logs;

-- Create robust policy that checks for service_role
CREATE POLICY "Only service role can access sync_logs"
ON public.sync_logs
FOR ALL
USING (
  auth.role() = 'service_role'
)
WITH CHECK (
  auth.role() = 'service_role'
);