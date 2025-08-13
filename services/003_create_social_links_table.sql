-- Create social links table for social media icons
CREATE TABLE IF NOT EXISTS public.social_links (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- instagram, youtube, tiktok, email, etc.
  url VARCHAR(500) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_social_links_profile_id ON public.social_links(profile_id);
CREATE INDEX IF NOT EXISTS idx_social_links_platform ON public.social_links(platform);
