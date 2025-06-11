
-- Disable Row Level Security on all tables since the app doesn't use authentication
ALTER TABLE quiz_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE question_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE feedback DISABLE ROW LEVEL SECURITY;

-- Drop any existing RLS policies if they exist
DROP POLICY IF EXISTS "Allow users to insert their own records" ON quiz_attempts;
DROP POLICY IF EXISTS "Allow users to update their own records" ON quiz_attempts;
DROP POLICY IF EXISTS "Allow users to delete their own records" ON quiz_attempts;

DROP POLICY IF EXISTS "Allow users to insert their own records" ON question_results;
DROP POLICY IF EXISTS "Allow users to update their own records" ON question_results;
DROP POLICY IF EXISTS "Allow users to delete their own records" ON question_results;

DROP POLICY IF EXISTS "Allow users to insert their own records" ON feedback;
DROP POLICY IF EXISTS "Allow users to update their own records" ON feedback;
DROP POLICY IF EXISTS "Allow users to delete their own records" ON feedback;
