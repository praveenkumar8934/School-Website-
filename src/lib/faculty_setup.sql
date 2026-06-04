-- Supabase Schema Update for Faculty Images

-- Add image_url column to faculty_registrations table if it doesn't already exist
ALTER TABLE public.faculty_registrations 
ADD COLUMN IF NOT EXISTS image_url text;

-- (Optional) If you want to ensure the storage bucket 'gallery' exists, you would normally do this:
-- insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true) on conflict do nothing;
-- Note: 'gallery' bucket should already exist from the gallery setup.
