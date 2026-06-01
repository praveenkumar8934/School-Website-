-- Create the students table to store approved student profiles
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admission_id UUID REFERENCES public.admission_form(id) ON DELETE SET NULL,
    student_id TEXT UNIQUE NOT NULL,
    
    -- Core Details
    student_name TEXT NOT NULL,
    dob TEXT NOT NULL,
    gender TEXT NOT NULL,
    blood_group TEXT NOT NULL,
    student_photo TEXT,
    
    -- Academic Details
    grade TEXT NOT NULL,
    assigned_section TEXT DEFAULT 'Unassigned',
    fee_status TEXT DEFAULT 'Pending',
    
    -- Guardian & Contact
    parent_name TEXT NOT NULL,
    parent_phone TEXT NOT NULL,
    parent_email TEXT NOT NULL,
    address TEXT NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Allow anon and authenticated to view students (required for admin dashboard)
CREATE POLICY "Allow public select on students" 
ON public.students 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow anon and authenticated to insert students (required when admin approves)
CREATE POLICY "Allow authenticated insert on students" 
ON public.students 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Allow anon and authenticated to update students (for changing section/fee)
CREATE POLICY "Allow authenticated update on students" 
ON public.students 
FOR UPDATE 
TO anon, authenticated 
USING (true);

-- Allow anon and authenticated to delete students
CREATE POLICY "Allow authenticated delete on students" 
ON public.students 
FOR DELETE 
TO anon, authenticated 
USING (true);
