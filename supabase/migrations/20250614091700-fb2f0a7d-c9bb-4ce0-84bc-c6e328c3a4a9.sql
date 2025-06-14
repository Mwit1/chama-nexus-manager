
-- Enable RLS on profiles table (if not already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view all profiles (needed for searching existing members)
CREATE POLICY "Allow users to view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow users to insert new profiles (needed when adding members by name)
CREATE POLICY "Allow users to insert profiles" 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow users to update their own profiles
CREATE POLICY "Users can update their own profiles" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
