-- =====================================================
-- DIU CSE Academic Tracker - Row Level Security Policies
-- =====================================================
-- 
-- IMPORTANT: Run these SQL commands in your Supabase SQL Editor
-- These policies ensure data security at the database level
--
-- =====================================================

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES TABLE POLICIES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile (except approval status)
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND is_approved = (SELECT is_approved FROM profiles WHERE id = auth.uid())
);

-- Profiles are created automatically via trigger on auth.users
-- No manual INSERT policy needed

-- =====================================================
-- ACADEMIC_RECORDS TABLE POLICIES
-- =====================================================

-- Users can view records for their section
CREATE POLICY "Users can view section records"
ON academic_records FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.section = academic_records.section
    AND profiles.is_approved = true
  )
);

-- Only approved CRs can insert records
CREATE POLICY "Approved CRs can insert records"
ON academic_records FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_approved = true
  )
);

-- Only approved CRs can update records
CREATE POLICY "Approved CRs can update records"
ON academic_records FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_approved = true
  )
);

-- Only approved CRs can delete records
CREATE POLICY "Approved CRs can delete records"
ON academic_records FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_approved = true
  )
);

-- =====================================================
-- COURSES TABLE POLICIES
-- =====================================================

-- Everyone (authenticated) can read courses
CREATE POLICY "Authenticated users can view courses"
ON courses FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Only approved CRs can insert courses
CREATE POLICY "Approved CRs can insert courses"
ON courses FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_approved = true
  )
);

-- Only approved CRs can update courses
CREATE POLICY "Approved CRs can update courses"
ON courses FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_approved = true
  )
);

-- Only approved CRs can delete courses
CREATE POLICY "Approved CRs can delete courses"
ON courses FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_approved = true
  )
);

-- =====================================================
-- COURSE_GROUPS TABLE POLICIES
-- =====================================================

-- Users can view groups for their section
CREATE POLICY "Users can view section groups"
ON course_groups FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.section = course_groups.section
    AND profiles.is_approved = true
  )
);

-- Only approved CRs can insert groups
CREATE POLICY "Approved CRs can insert groups"
ON course_groups FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_approved = true
  )
);

-- Only approved CRs can update groups
CREATE POLICY "Approved CRs can update groups"
ON course_groups FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_approved = true
  )
);

-- Only approved CRs can delete groups
CREATE POLICY "Approved CRs can delete groups"
ON course_groups FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_approved = true
  )
);

-- =====================================================
-- GROUP_MEMBERS TABLE POLICIES
-- =====================================================

-- Users can view group members for their section
CREATE POLICY "Users can view section group members"
ON group_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM course_groups cg
    JOIN profiles p ON p.section = cg.section
    WHERE cg.id = group_members.group_id
    AND p.id = auth.uid()
    AND p.is_approved = true
  )
);

-- Only approved CRs can insert group members
CREATE POLICY "Approved CRs can insert group members"
ON group_members FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_approved = true
  )
);

-- Only approved CRs can update group members
CREATE POLICY "Approved CRs can update group members"
ON group_members FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_approved = true
  )
);

-- Only approved CRs can delete group members
CREATE POLICY "Approved CRs can delete group members"
ON group_members FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_approved = true
  )
);

-- =====================================================
-- ADDITIONAL SECURITY MEASURES
-- =====================================================

-- Create a function to check if user's email is verified
CREATE OR REPLACE FUNCTION is_email_verified()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT email_confirmed_at IS NOT NULL
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VERIFICATION CHECKLIST
-- =====================================================
--
-- After running these policies, verify:
-- 
-- 1. Test with a regular user account:
--    - Can view their own profile
--    - Can view records for their section
--    - Cannot insert/update/delete records
--    - Cannot manage courses or groups
--
-- 2. Test with an approved CR account:
--    - Can view their own profile
--    - Can view records for their section
--    - Can insert/update/delete records
--    - Can manage courses and groups
--
-- 3. Test cross-section access:
--    - Users from Section A cannot see Section B records
--    - Groups are properly isolated by section
--
-- 4. Monitor Supabase logs for:
--    - Unauthorized access attempts
--    - Policy violations
--    - Unusual activity patterns
--
-- =====================================================
