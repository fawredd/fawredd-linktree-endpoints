-- 1. Create the new schema using underscores
CREATE SCHEMA IF NOT EXISTS fawredd_linktree;

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS fawredd_linktree.profiles (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  title VARCHAR(255),
  profile_image_url TEXT,
  hero_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  clerk_id VARCHAR(255),
  background_color VARCHAR(7),
  border_color VARCHAR(7),
  font_color VARCHAR(7)
);

CREATE INDEX IF NOT EXISTS idx_profiles_slug ON fawredd_linktree.profiles(slug);
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id ON fawredd_linktree.profiles(clerk_id);

-- 3. Services Table
CREATE TABLE IF NOT EXISTS fawredd_linktree.services (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    hero_image TEXT,
    background_image TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    profile_id INTEGER REFERENCES fawredd_linktree.profiles(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_services_slug ON fawredd_linktree.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_profile_id ON fawredd_linktree.services(profile_id);

-- 4. Social Links Table
CREATE TABLE IF NOT EXISTS fawredd_linktree.social_links (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER REFERENCES fawredd_linktree.profiles(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  url VARCHAR(500) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(profile_id, platform)
);

-- 5. Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_services_updated_at 
    BEFORE UPDATE ON fawredd_linktree.services 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Profile Managers Table
CREATE TABLE IF NOT EXISTS fawredd_linktree.profile_managers (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER REFERENCES fawredd_linktree.profiles(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(profile_id, email)
);    