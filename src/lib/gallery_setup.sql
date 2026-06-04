-- Run this SQL in your Supabase Dashboard -> SQL Editor

CREATE TABLE IF NOT EXISTS public.gallery_images (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  image_url text not null,
  span text default 'col-span-1 row-span-1',
  hue text default '220',
  category text default 'Campus',
  description text default '',
  filter_style text default 'none',
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- IMPORTANT: If you already created the table, run this ALTER TABLE block:
-- ALTER TABLE public.gallery_images 
-- ADD COLUMN IF NOT EXISTS category text default 'Campus',
-- ADD COLUMN IF NOT EXISTS description text default '',
-- ADD COLUMN IF NOT EXISTS filter_style text default 'none',
-- ADD COLUMN IF NOT EXISTS is_published boolean default true;

-- Note: We assume the admin API or client bypasses RLS using the service role key, or you can set public read access:
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to gallery images"
  ON public.gallery_images FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to gallery images"
  ON public.gallery_images FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to gallery images"
  ON public.gallery_images FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to gallery images"
  ON public.gallery_images FOR DELETE
  USING (true);

-- You will also need to create a storage bucket named 'gallery'.
-- Go to Storage -> New Bucket -> name it "gallery" and toggle "Public bucket" to ON.
-- IMPORTANT: You also need to allow uploads to the bucket. Go to Storage -> Policies -> under 'gallery', click "New Policy", select "For full customization", and allow INSERT/DELETE for all users, or simply run:

CREATE POLICY "Allow public uploads to gallery bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Allow public deletes from gallery bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'gallery');
