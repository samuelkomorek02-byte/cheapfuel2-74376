-- Enable Row Level Security on sync_logs table
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

-- Block all client access to sync_logs - this is internal operational data
-- Only edge functions using service role key should access this table
CREATE POLICY "No public access to sync_logs"
ON public.sync_logs
FOR ALL
USING (false);