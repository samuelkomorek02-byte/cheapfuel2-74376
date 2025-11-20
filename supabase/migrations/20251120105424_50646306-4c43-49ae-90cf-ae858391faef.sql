-- Fix overly permissive RLS policies for stations table
DROP POLICY IF EXISTS "Service role can insert stations" ON public.stations;
DROP POLICY IF EXISTS "Service role can update stations" ON public.stations;

CREATE POLICY "Service role can insert stations" 
ON public.stations 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update stations" 
ON public.stations 
FOR UPDATE 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Fix overly permissive RLS policies for fuel_prices table
DROP POLICY IF EXISTS "Service role can insert fuel prices" ON public.fuel_prices;
DROP POLICY IF EXISTS "Service role can update fuel prices" ON public.fuel_prices;

CREATE POLICY "Service role can insert fuel prices" 
ON public.fuel_prices 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update fuel prices" 
ON public.fuel_prices 
FOR UPDATE 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');