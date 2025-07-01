
-- Insérer les plateformes sociales principales
INSERT INTO public.social_platforms (name, is_active, apify_actor_id, configuration) VALUES
('Instagram', true, 'apify/instagram-scraper', '{"type": "social_network", "category": "visual"}'),
('Twitter', true, 'apify/twitter-scraper', '{"type": "social_network", "category": "microblogging"}'),
('Facebook', true, 'apify/facebook-scraper', '{"type": "social_network", "category": "general"}'),
('LinkedIn', true, 'apify/linkedin-scraper', '{"type": "professional_network", "category": "business"}'),
('TikTok', true, 'apify/tiktok-scraper', '{"type": "social_network", "category": "video"}'),
('YouTube', true, 'apify/youtube-scraper', '{"type": "video_platform", "category": "video"}')
ON CONFLICT (name) DO NOTHING;
