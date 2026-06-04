-- Run this SQL in your Supabase Dashboard -> SQL Editor

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  subscribed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Optional: Enable Row Level Security (RLS) but allow the service role to bypass it
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- No policies are strictly needed since we only insert via the service_role key on the backend.
