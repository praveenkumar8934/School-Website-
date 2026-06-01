-- Create the admission_form table to store complete multi-step application entries
CREATE TABLE IF NOT EXISTS public.admission_form (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Step 1: Student Information
    student_name TEXT NOT NULL,
    dob TEXT NOT NULL,
    gender TEXT NOT NULL,
    religion TEXT NOT NULL,
    blood_group TEXT NOT NULL,
    student_photo TEXT NOT NULL, -- Holds CDN URL of uploaded portrait
    
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
    marksheet TEXT NOT NULL, -- Holds CDN URL of uploaded marksheet file
    
    -- Step 4: Residential Details & Notes
    aadhar_number TEXT NOT NULL,
    aadhar_image TEXT NOT NULL, -- Holds CDN URL of uploaded Aadhar card image
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pin_code TEXT NOT NULL,
    notes TEXT,
    
    -- System status tracker fields
    status TEXT NOT NULL DEFAULT 'pending',
    student_id TEXT, -- Generated upon approval
    assigned_section TEXT DEFAULT 'Unassigned',
    fee_status TEXT DEFAULT 'Pending',
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- If you are updating an existing table, run this:
-- ALTER TABLE public.admission_form ADD COLUMN IF NOT EXISTS student_id TEXT;
-- ALTER TABLE public.admission_form ADD COLUMN IF NOT EXISTS assigned_section TEXT DEFAULT 'Unassigned';
-- ALTER TABLE public.admission_form ADD COLUMN IF NOT EXISTS fee_status TEXT DEFAULT 'Pending';
-- ALTER TABLE public.admission_form ADD COLUMN IF NOT EXISTS password_hash TEXT NOT NULL;

-- Enable Row Level Security (RLS) on the newly created table
ALTER TABLE public.admission_form ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they conflict
DROP POLICY IF EXISTS "Allow public inserts" ON public.admission_form;
DROP POLICY IF EXISTS "Allow authenticated select" ON public.admission_form;

-- Create an explicit policy to authorize anonymous insertions from the public web form
CREATE POLICY "Allow public inserts" 
ON public.admission_form 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Create a policy to allow selective database inspections for authenticated admin operators
CREATE POLICY "Allow authenticated select" 
ON public.admission_form 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Create a policy to allow updating the status by admin operators
CREATE POLICY "Allow authenticated update" 
ON public.admission_form 
FOR UPDATE
TO anon, authenticated 
USING (true);

-- Create a policy to allow deleting admissions by admin operators
CREATE POLICY "Allow authenticated delete" 
ON public.admission_form 
FOR DELETE
TO anon, authenticated 
USING (true);
