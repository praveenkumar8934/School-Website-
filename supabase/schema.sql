-- Create the admissions table
CREATE TABLE IF NOT EXISTS public.admissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    grade TEXT NOT NULL,
    address TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for safety
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow the server (service_role) to insert records
CREATE POLICY "Allow public insert via server API" 
    ON public.admissions 
    FOR INSERT 
    WITH CHECK (true);

-- Create policy to restrict select queries to authenticated system administrators/dashboard users
CREATE POLICY "Restrict select queries to authenticated admins only" 
    ON public.admissions 
    FOR SELECT 
    USING (auth.role() = 'authenticated');

-- Create indexes for scalability, analytics, and faster searches in future dashboard integrations
CREATE INDEX IF NOT EXISTS admissions_email_idx ON public.admissions(email);
CREATE INDEX IF NOT EXISTS admissions_status_idx ON public.admissions(status);
CREATE INDEX IF NOT EXISTS admissions_created_at_idx ON public.admissions(created_at DESC);
