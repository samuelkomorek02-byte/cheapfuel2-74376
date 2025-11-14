-- Fix sync_logs policy to allow service role access
DROP POLICY IF EXISTS "Service role can manage sync logs" ON sync_logs;
CREATE POLICY "Service role can manage sync logs" 
ON sync_logs 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Add INSERT and UPDATE policies for fuel_prices (service role only)
CREATE POLICY "Service role can insert fuel prices" 
ON fuel_prices 
FOR INSERT 
TO service_role 
WITH CHECK (true);

CREATE POLICY "Service role can update fuel prices" 
ON fuel_prices 
FOR UPDATE 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Add INSERT and UPDATE policies for stations (service role only)
CREATE POLICY "Service role can insert stations" 
ON stations 
FOR INSERT 
TO service_role 
WITH CHECK (true);

CREATE POLICY "Service role can update stations" 
ON stations 
FOR UPDATE 
TO service_role 
USING (true) 
WITH CHECK (true);