-- Add clerk_id column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS clerk_id VARCHAR(255);

-- Create index for faster lookups by clerk_id
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id ON public.profiles(clerk_id);

-- Update existing profiles to the specified user_id
-- As per requirement: clerk user_id DEFAULT_ID
UPDATE public.profiles SET clerk_id = 'DEFAULT_ID' WHERE clerk_id IS NULL;
