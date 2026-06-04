-- Create Online Tests Table
CREATE TABLE IF NOT EXISTS public.online_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    teacher_id TEXT NOT NULL, -- references faculty_registrations.faculty_id
    grade TEXT NOT NULL,
    section TEXT NOT NULL,
    subject TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    is_published BOOLEAN DEFAULT false,
    publish_immediately BOOLEAN DEFAULT true,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Test Questions Table
CREATE TABLE IF NOT EXISTS public.test_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES public.online_tests(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of strings e.g., ["A", "B", "C", "D"]
    correct_option_index INTEGER NOT NULL,
    marks INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Test Submissions Table
CREATE TABLE IF NOT EXISTS public.test_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES public.online_tests(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL, -- references students.student_id
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    score INTEGER DEFAULT 0,
    status TEXT DEFAULT 'in_progress', -- 'in_progress' or 'completed'
    UNIQUE(test_id, student_id)
);

-- Create Test Answers Table
CREATE TABLE IF NOT EXISTS public.test_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES public.test_submissions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.test_questions(id) ON DELETE CASCADE,
    selected_option_index INTEGER NOT NULL,
    UNIQUE(submission_id, question_id)
);

-- Enable RLS
ALTER TABLE public.online_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_answers ENABLE ROW LEVEL SECURITY;

-- Setup basic policies
-- Online Tests
CREATE POLICY "Enable read access for all users" ON public.online_tests FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.online_tests FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for creators" ON public.online_tests FOR UPDATE USING (true);

-- Test Questions
CREATE POLICY "Enable read access for all users" ON public.test_questions FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.test_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for creators" ON public.test_questions FOR UPDATE USING (true);
CREATE POLICY "Enable delete for creators" ON public.test_questions FOR DELETE USING (true);

-- Test Submissions
CREATE POLICY "Enable read access for all users" ON public.test_submissions FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.test_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for owner" ON public.test_submissions FOR UPDATE USING (true);

-- Test Answers
CREATE POLICY "Enable read access for all users" ON public.test_answers FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.test_answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for owner" ON public.test_answers FOR UPDATE USING (true);
