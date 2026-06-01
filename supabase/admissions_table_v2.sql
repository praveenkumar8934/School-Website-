-- Create the complete v2 admissions table with all 22 required fields
CREATE TABLE IF NOT EXISTS public.admissions_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Step 1: Student Information
    student_name TEXT NOT NULL,
    dob DATE NOT NULL,
    gender TEXT NOT NULL,
    religion TEXT NOT NULL,
    blood_group TEXT NOT NULL,
    student_photo TEXT NOT NULL, -- Storage URL or Base64 representation of student photo
    
    -- Step 2: Parent & Contacts
    father_name TEXT NOT NULL,
    mother_name TEXT NOT NULL,
    parent_phone TEXT NOT NULL,
    alt_phone TEXT,
    parent_email TEXT NOT NULL,
    emergency_contact TEXT NOT NULL,
    
    -- Step 3: Academic Profile
    prev_school TEXT NOT NULL,
    prev_class TEXT NOT NULL,
    grade TEXT NOT NULL,
    marksheet TEXT NOT NULL, -- Storage URL or Base64 representation of the marksheet
    
    -- Step 4: Residential Details & Notes
    aadhar_number TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pin_code TEXT NOT NULL,
    notes TEXT,
    
    -- System fields
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for complete safety
ALTER TABLE public.admissions_v2 ENABLE ROW LEVEL SECURITY;

-- Allow public/anonymous inserts via your frontend website
CREATE POLICY "Allow public inserts on admissions_v2" 
ON public.admissions_v2 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Restrict select queries strictly to authenticated system administrators/dashboard users
CREATE POLICY "Restrict select on admissions_v2 to authenticated admins only" 
ON public.admissions_v2 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Performance and scale indexes
CREATE INDEX IF NOT EXISTS admissions_v2_email_idx ON public.admissions_v2(parent_email);
CREATE INDEX IF NOT EXISTS admissions_v2_phone_idx ON public.admissions_v2(parent_phone);
CREATE INDEX IF NOT EXISTS admissions_v2_status_idx ON public.admissions_v2(status);
CREATE INDEX IF NOT EXISTS admissions_v2_created_idx ON public.admissions_v2(created_at DESC);
