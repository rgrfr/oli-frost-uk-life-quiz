
-- Drop all unused policies from feedback, quiz_attempts, and question_results.
-- These are often created by default, but are NOT used since RLS is disabled.

-- For feedback table
DROP POLICY IF EXISTS "Allow public inserts to feedback" ON public.feedback;
DROP POLICY IF EXISTS "Allow anyone to view approved feedback" ON public.feedback;
DROP POLICY IF EXISTS "Allow users to insert their own records" ON public.feedback;
DROP POLICY IF EXISTS "Allow users to update their own records" ON public.feedback;
DROP POLICY IF EXISTS "Allow users to delete their own records" ON public.feedback;

-- For quiz_attempts table
DROP POLICY IF EXISTS "Allow public inserts to quiz_attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Allow public reads from quiz_attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Allow users to insert their own records" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Allow users to update their own records" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Allow users to delete their own records" ON public.quiz_attempts;

-- For question_results table
DROP POLICY IF EXISTS "Allow public inserts to question_results" ON public.question_results;
DROP POLICY IF EXISTS "Allow public reads from question_results" ON public.question_results;
DROP POLICY IF EXISTS "Allow users to insert their own records" ON public.question_results;
DROP POLICY IF EXISTS "Allow users to update their own records" ON public.question_results;
DROP POLICY IF EXISTS "Allow users to delete their own records" ON public.question_results;
