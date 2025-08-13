-- Insert sample services data
INSERT INTO public.services (slug, title, description, hero_image, background_image) VALUES
('mgd-expansion', 'Mgd.expansión', 'Servicios de expansión y crecimiento empresarial. Ayudamos a tu negocio a alcanzar nuevos mercados y maximizar su potencial.', '/placeholder.svg?height=400&width=400', '/placeholder.svg?height=800&width=1200')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample service features
INSERT INTO public.service_features (service_id, title, description, icon, order_index) VALUES
((SELECT id FROM public.services WHERE slug = 'mgd-expansion'), 'Consultoría Estratégica', 'Análisis profundo de tu negocio y desarrollo de estrategias personalizadas para el crecimiento.', 'strategy', 1),
((SELECT id FROM public.services WHERE slug = 'mgd-expansion'), 'Expansión de Mercado', 'Te ayudamos a identificar y penetrar nuevos mercados de manera efectiva.', 'market', 2),
((SELECT id FROM public.services WHERE slug = 'mgd-expansion'), 'Optimización de Procesos', 'Mejoramos tus procesos internos para aumentar la eficiencia y reducir costos.', 'process', 3),
((SELECT id FROM public.services WHERE slug = 'mgd-expansion'), 'Newsletter Exclusivo', 'Suscríbete gratis a nuestro newsletter y entérate primero de todos nuestros anuncios y estrategias.', 'newsletter', 4);
