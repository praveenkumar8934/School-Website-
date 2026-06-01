-- ==========================================
-- NOVA ACADEMY SIS SCHEMA
-- ==========================================

-- 1. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Present', 'Absent', 'Late', 'Excused')),
    notes TEXT,
    recorded_by TEXT, -- faculty_id
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(student_id, date)
);

-- 2. MARKS TABLE
CREATE TABLE IF NOT EXISTS public.marks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    exam_type TEXT NOT NULL, -- e.g., 'Term 1', 'Unit Test 1'
    marks_obtained NUMERIC NOT NULL,
    max_marks NUMERIC NOT NULL,
    grade TEXT,
    remarks TEXT,
    recorded_by TEXT, -- faculty_id
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(student_id, subject, exam_type)
);

-- 3. TIMETABLE TABLE
CREATE TABLE IF NOT EXISTS public.timetable (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade TEXT NOT NULL,
    section TEXT NOT NULL,
    day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject TEXT NOT NULL,
    room TEXT,
    teacher_id TEXT, -- faculty_id
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. FEES TABLE
CREATE TABLE IF NOT EXISTS public.fees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    term TEXT NOT NULL, -- e.g., 'Term 1 (Apr - Jun)'
    amount_due NUMERIC NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Upcoming' CHECK (status IN ('Paid', 'Upcoming', 'Overdue')),
    paid_on DATE,
    transaction_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(student_id, term)
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;

-- POLICIES (Read for anon/auth, write for auth)
-- Attendance
CREATE POLICY "Allow public select on attendance" ON public.attendance FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow authenticated insert on attendance" ON public.attendance FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on attendance" ON public.attendance FOR UPDATE TO anon, authenticated USING (true);

-- Marks
CREATE POLICY "Allow public select on marks" ON public.marks FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow authenticated insert on marks" ON public.marks FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on marks" ON public.marks FOR UPDATE TO anon, authenticated USING (true);

-- Timetable
CREATE POLICY "Allow public select on timetable" ON public.timetable FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow authenticated insert on timetable" ON public.timetable FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on timetable" ON public.timetable FOR UPDATE TO anon, authenticated USING (true);

-- Fees
CREATE POLICY "Allow public select on fees" ON public.fees FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow authenticated insert on fees" ON public.fees FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on fees" ON public.fees FOR UPDATE TO anon, authenticated USING (true);
