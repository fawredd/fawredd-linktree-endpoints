-- Insert sample profile data
INSERT INTO public.profiles (slug, name, description, profile_image_url, background_image_url) 
VALUES (
  'mgd-expansion',
  'Mgd.expansión',
  'Suscríbete gratis a mi Newsletter y entérate primero de todos mis anuncios',
  '/Logo-MGD-PNG-transparente.png',
  '/heroBackground.jpg'
) ON CONFLICT (slug) DO NOTHING;

-- Get the profile ID for the sample data
DO $$
DECLARE
    profile_id_var INTEGER;
BEGIN
    SELECT id INTO profile_id_var FROM public.profiles WHERE slug = 'mgd-expansion';
    -- Insert social links
    INSERT INTO public.social_links (profile_id, platform, url, sort_order) VALUES
    (profile_id_var, 'instagram', 'https://instagram.com/mgd.expansion', 1),
    ON CONFLICT DO NOTHING;
   
END $$;
