-- Get the profile ID for 'mgd-expansion'
DO $$
DECLARE
    profile_id_var INTEGER;
BEGIN
    -- First, ensure the profile exists and get its ID
    -- This assumes 004_seed_sample_data.sql has been run or the profile exists
    SELECT id INTO profile_id_var FROM public.profiles WHERE slug = 'mgd-expansion';

    -- If the profile exists, insert the services linked to it
    IF profile_id_var IS NOT NULL THEN
        -- Insert sample services data, formerly service_features
        INSERT INTO public.services (slug, title, description, "profileId", "sortOrder") VALUES
        ('consultoria-estrategica', 'Consultoría Estratégica', 'Análisis profundo de tu negocio y desarrollo de estrategias personalizadas para el crecimiento.', profile_id_var, 1),
        ('expansion-de-mercado', 'Expansión de Mercado', 'Te ayudamos a identificar y penetrar nuevos mercados de manera efectiva.', profile_id_var, 2),
        ('optimizacion-de-procesos', 'Optimización de Procesos', 'Mejoramos tus procesos internos para aumentar la eficiencia y reducir costos.', profile_id_var, 3),
        ('newsletter-exclusivo', 'Newsletter Exclusivo', 'Suscríbete gratis a nuestro newsletter y entérate primero de todos nuestros anuncios y estrategias.', profile_id_var, 4)
        ON CONFLICT (slug) DO NOTHING;
    END IF;
END $$;