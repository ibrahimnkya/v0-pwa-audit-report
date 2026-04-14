-- Create report_access table to store verified users who have signed the consent form
CREATE TABLE IF NOT EXISTS public.report_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  otp_code TEXT,
  otp_expires_at TIMESTAMPTZ,
  consent_signed_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_report_access_email ON public.report_access(email);

-- Enable RLS but allow public access for this use case (no auth required)
ALTER TABLE public.report_access ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anyone (for consent form submission)
CREATE POLICY "Allow public inserts" ON public.report_access 
  FOR INSERT WITH CHECK (true);

-- Allow updates for OTP verification
CREATE POLICY "Allow public updates" ON public.report_access 
  FOR UPDATE USING (true);

-- Allow selects for verification checks
CREATE POLICY "Allow public selects" ON public.report_access 
  FOR SELECT USING (true);
