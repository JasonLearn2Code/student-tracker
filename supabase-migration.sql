-- Care Givers table
CREATE TABLE IF NOT EXISTS care_givers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('httd_ca_nhan', 'giai_quyet_van_de')),
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Care Sessions table
CREATE TABLE IF NOT EXISTS care_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  care_giver_id UUID REFERENCES care_givers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  topic TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Care Attendance table
CREATE TABLE IF NOT EXISTS care_attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  care_session_id UUID REFERENCES care_sessions(id) ON DELETE CASCADE,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  evaluation TEXT,
  progress_level INTEGER CHECK (progress_level BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add care giver columns to students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS care_giver_httd_id UUID REFERENCES care_givers(id);
ALTER TABLE students ADD COLUMN IF NOT EXISTS care_giver_gqvd_id UUID REFERENCES care_givers(id);

-- Enable RLS but allow anonymous access (same pattern as existing tables)
ALTER TABLE care_givers ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read on care_givers" ON care_givers FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous insert on care_givers" ON care_givers FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous update on care_givers" ON care_givers FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous delete on care_givers" ON care_givers FOR DELETE TO anon USING (true);

CREATE POLICY "Allow anonymous read on care_sessions" ON care_sessions FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous insert on care_sessions" ON care_sessions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous update on care_sessions" ON care_sessions FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous delete on care_sessions" ON care_sessions FOR DELETE TO anon USING (true);

CREATE POLICY "Allow anonymous read on care_attendance" ON care_attendance FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous insert on care_attendance" ON care_attendance FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous update on care_attendance" ON care_attendance FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous delete on care_attendance" ON care_attendance FOR DELETE TO anon USING (true);

-- Add progress_level column to attendance table
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS "progressLevel" INTEGER CHECK ("progressLevel" BETWEEN 1 AND 5);
