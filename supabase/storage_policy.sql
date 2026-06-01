-- ============================================================
-- Run this in Supabase SQL Editor AFTER creating your bucket
-- named "admissions" with "Public bucket" toggled ON.
-- ============================================================

-- 1. Allow anyone (anon + authenticated) to UPLOAD files into the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('admissions', 'admissions', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop old policies if re-running
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads"   ON storage.objects;

-- 3. Allow anonymous INSERT (file uploads) into the admissions bucket
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'admissions');

-- 4. Allow anyone to read/download files from the admissions bucket
CREATE POLICY "Allow public reads"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'admissions');
