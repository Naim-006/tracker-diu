-- 1. Create Batches Table
CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Profiles Table (extends Auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    batch_id UUID REFERENCES batches(id),
    section TEXT,
    sub_section TEXT,
    role TEXT DEFAULT 'student', -- 'student' or 'CR'
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Courses Table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    teacher TEXT,
    credit NUMERIC DEFAULT 3.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Academic Records Table
CREATE TABLE academic_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    section TEXT NOT NULL,
    sub_section TEXT,
    date DATE NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    link TEXT,
    link_two TEXT,
    topics TEXT,
    time TEXT,
    room TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Course Groups Table
CREATE TABLE course_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    section TEXT NOT NULL,
    sub_section TEXT NOT NULL,
    group_number INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Group Members Table
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES course_groups(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES --

-- Enable RLS on all tables
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Public Read Access
CREATE POLICY "Public Read Access" ON batches FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON courses FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON academic_records FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON course_groups FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON group_members FOR SELECT USING (true);

-- Admin (Approved CR) Write Access
CREATE POLICY "Admin Write Access academic_records" ON academic_records 
    FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE is_approved = true AND role = 'CR'));

CREATE POLICY "Admin Write Access courses" ON courses 
    FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE is_approved = true AND role = 'CR'));

CREATE POLICY "Admin Write Access course_groups" ON course_groups 
    FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE is_approved = true AND role = 'CR'));

CREATE POLICY "Admin Write Access group_members" ON group_members 
    FOR ALL USING (auth.uid() IN (
        SELECT id FROM profiles WHERE is_approved = true AND role = 'CR'
    ));

-- AUTH TRIGGER --
-- Automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, batch_id, section, sub_section, role, is_approved)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    (new.raw_user_meta_data->>'batch_id')::uuid,
    new.raw_user_meta_data->>'section',
    new.raw_user_meta_data->>'sub_section',
    new.raw_user_meta_data->>'role',
    FALSE
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Additional RLS for profiles
CREATE POLICY "Users can update own profile" ON profiles 
    FOR UPDATE USING (auth.uid() = id);

-- Seed Some Batches (Optional)
 INSERT INTO batches (name) VALUES ('CSE 65'), ('CSE 66'), ('CSE 71');
