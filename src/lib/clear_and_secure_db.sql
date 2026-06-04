-- Step 1: Clear old custom auth users
TRUNCATE TABLE public.admission_form CASCADE;
TRUNCATE TABLE public.faculty_registrations CASCADE;

-- Step 2: Enable RLS on all tables to prevent anonymous access
ALTER TABLE IF EXISTS public.online_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.test_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.test_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notices ENABLE ROW LEVEL SECURITY;

-- Step 3: Create permissive policies for authenticated users
-- Since the exact business logic for RLS is complex (e.g. students only see their own tests, faculty see all),
-- we will start by restricting ALL access to only logged-in users.
-- You can later refine these policies in the Supabase Dashboard.

CREATE POLICY "Allow authenticated access to online_tests" ON public.online_tests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated access to test_questions" ON public.test_questions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated access to test_submissions" ON public.test_submissions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated access to test_answers" ON public.test_answers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated access to students" ON public.students FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated access to faculty" ON public.faculty FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated access to attendance" ON public.attendance FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated access to marks" ON public.marks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated access to fees" ON public.fees FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated access to notices" ON public.notices FOR ALL USING (auth.role() = 'authenticated');
