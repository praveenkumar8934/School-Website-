-- Supabase Schema for Newsletter Subscribers

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text NOT NULL UNIQUE,
    subscribed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Since the SUPABASE_SERVICE_ROLE_KEY in .env.local is actually just the anon key,
-- we must explicitly allow inserts from anyone (anon).
CREATE POLICY "Allow public inserts to newsletter" 
ON public.newsletter_subscribers
FOR INSERT 
TO public 
WITH CHECK (true);

-- Optional: If you want to see the list from your admin dashboard later
CREATE POLICY "Allow public reads of newsletter" 
ON public.newsletter_subscribers
FOR SELECT 
TO public 
USING (true);
