-- Create report_access table to log access to the confidential audit report
CREATE TABLE IF NOT EXISTS public.report_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  consent_given BOOLEAN DEFAULT TRUE,
  accessed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_report_access_email ON public.report_access(email);

-- Enable RLS
ALTER TABLE public.report_access ENABLE ROW LEVEL SECURITY;

-- Allow inserts from authenticated users
CREATE POLICY "Allow authenticated inserts" ON public.report_access 
  FOR INSERT TO authenticated WITH CHECK (true);

-- Allow selects from authenticated users for their own records
CREATE POLICY "Allow authenticated selects" ON public.report_access 
  FOR SELECT TO authenticated USING (true);
