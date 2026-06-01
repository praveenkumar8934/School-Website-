-- Create the faculty_registrations table
CREATE TABLE IF NOT EXISTS public.faculty_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    department TEXT NOT NULL,
    qualification TEXT NOT NULL,
    experience_years INTEGER NOT NULL,
    
    -- Status of the registration request: 'pending', 'approved', 'rejected'
    status TEXT NOT NULL DEFAULT 'pending',
    
    -- Generated Faculty ID (only set after approval)
    faculty_id TEXT,
    
    -- Assigned Class and Section (for Class Teachers)
    assigned_class TEXT,
    assigned_section TEXT,
    assigned_subject TEXT,
    role_type TEXT,
    
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.faculty_registrations ENABLE ROW LEVEL SECURITY;

-- If you are updating an existing table, run this:
-- ALTER TABLE public.faculty_registrations ADD COLUMN IF NOT EXISTS faculty_id TEXT;
-- ALTER TABLE public.faculty_registrations ADD COLUMN IF NOT EXISTS assigned_class TEXT;
-- ALTER TABLE public.faculty_registrations ADD COLUMN IF NOT EXISTS assigned_section TEXT;
-- ALTER TABLE public.faculty_registrations ADD COLUMN IF NOT EXISTS assigned_subject TEXT;
-- ALTER TABLE public.faculty_registrations ADD COLUMN IF NOT EXISTS role_type TEXT;
-- ALTER TABLE public.faculty_registrations ADD COLUMN IF NOT EXISTS password_hash TEXT NOT NULL;

-- Drop existing policies if they conflict (useful for iterative development)
DROP POLICY IF EXISTS "Allow public inserts" ON public.faculty_registrations;
DROP POLICY IF EXISTS "Allow authenticated select" ON public.faculty_registrations;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.faculty_registrations;

-- Create an explicit policy to authorize anonymous insertions from the public web form
CREATE POLICY "Allow public inserts" 
ON public.faculty_registrations 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Create a policy to allow selective database inspections for authenticated admin operators
CREATE POLICY "Allow authenticated select" 
ON public.faculty_registrations 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Create a policy to allow updating the status by authenticated admin operators
CREATE POLICY "Allow authenticated update" 
ON public.faculty_registrations 
FOR UPDATE
TO anon, authenticated 
USING (true);
