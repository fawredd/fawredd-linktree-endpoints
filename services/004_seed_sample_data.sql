-- Insert sample profile data
INSERT INTO public.profiles (slug, name, title, description, profile_image_url, hero_image_url)
VALUES (
  'mgd-expansion',
  'Mgd.expansión',
  'Estrategias de Crecimiento',
  'Suscríbete gratis a mi Newsletter y entérate primero de todos mis anuncios',
  '/Logo-MGD-PNG-transparente.png',
  '/heroMgdBackground.jpg'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  profile_image_url = EXCLUDED.profile_image_url,
  hero_image_url = EXCLUDED.hero_image_url;

-- Get the profile ID for the sample data and insert social links
DO $$
DECLARE
    profile_id_var INTEGER;
BEGIN
    SELECT id INTO profile_id_var FROM public.profiles WHERE slug = 'mgd-expansion';

    -- Insert social links if the profile exists
    IF profile_id_var IS NOT NULL THEN
        INSERT INTO public.social_links (profile_id, platform, url, sort_order) VALUES
        (profile_id_var, 'instagram', 'https://instagram.com/mgd.expansion', 1),
        (profile_id_var, 'youtube', 'https://youtube.com/@mgd.expansion', 2),
        (profile_id_var, 'tiktok', 'https://tiktok.com/@mgd.expansion', 3)
        ON CONFLICT (profile_id, platform) DO UPDATE SET
          url = EXCLUDED.url,
          sort_order = EXCLUDED.sort_order;
    END IF;
END $$;