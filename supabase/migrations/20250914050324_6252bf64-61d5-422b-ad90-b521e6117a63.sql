-- Fix profiles SELECT RLS to prevent exposure while preserving committee/ULB access
-- Drop overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Helper function to check a user's role without RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Restrictive SELECT policy: users can view their own profile only
CREATE POLICY IF NOT EXISTS "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Allow committee and ULB roles to view profiles (needed for assignments/ops)
CREATE POLICY IF NOT EXISTS "Committee and ULB can view profiles"
ON public.profiles
FOR SELECT
USING (
  public.has_role(auth.uid(), 'committee'::user_role)
  OR public.has_role(auth.uid(), 'ulb'::user_role)
);
