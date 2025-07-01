
-- Create table for social media platforms (dynamic for Apify integration)
CREATE TABLE public.social_platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  api_key TEXT,
  is_active BOOLEAN DEFAULT true,
  apify_actor_id TEXT,
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for saved searches
CREATE TABLE public.saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  keywords TEXT[] NOT NULL,
  platforms TEXT[] NOT NULL,
  language TEXT DEFAULT 'fr',
  period TEXT DEFAULT '7d',
  filters JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_executed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for search results
CREATE TABLE public.search_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_id UUID REFERENCES public.saved_searches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  search_term TEXT NOT NULL,
  platform TEXT NOT NULL,
  total_mentions INTEGER DEFAULT 0,
  positive_sentiment INTEGER DEFAULT 0,
  negative_sentiment INTEGER DEFAULT 0,
  neutral_sentiment INTEGER DEFAULT 0,
  total_reach BIGINT DEFAULT 0,
  total_engagement INTEGER DEFAULT 0,
  results_data JSONB DEFAULT '[]',
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.social_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for social_platforms (all authenticated users can read, only admins can modify)
CREATE POLICY "Authenticated users can view platforms" 
  ON public.social_platforms 
  FOR SELECT 
  TO authenticated;

CREATE POLICY "Admins can manage platforms" 
  ON public.social_platforms 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for saved_searches
CREATE POLICY "Users can view their own saved searches" 
  ON public.saved_searches 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved searches" 
  ON public.saved_searches 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved searches" 
  ON public.saved_searches 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved searches" 
  ON public.saved_searches 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for search_results
CREATE POLICY "Users can view their own search results" 
  ON public.search_results 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own search results" 
  ON public.search_results 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Insert default social media platforms
INSERT INTO public.social_platforms (name, is_active) VALUES
('Instagram', true),
('Twitter', true),
('Facebook', true),
('TikTok', true),
('YouTube', true),
('LinkedIn', false),
('Snapchat', false);

-- Create function to execute saved search
CREATE OR REPLACE FUNCTION public.execute_saved_search(search_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  search_record public.saved_searches;
  result JSONB;
BEGIN
  -- Get the search record
  SELECT * INTO search_record 
  FROM public.saved_searches 
  WHERE id = search_id AND user_id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN '{"error": "Search not found"}'::jsonb;
  END IF;
  
  -- Update last executed timestamp
  UPDATE public.saved_searches 
  SET last_executed_at = now(), updated_at = now()
  WHERE id = search_id;
  
  -- Here you would integrate with Apify or other APIs
  -- For now, return the search configuration
  result := jsonb_build_object(
    'search_id', search_id,
    'keywords', search_record.keywords,
    'platforms', search_record.platforms,
    'status', 'queued'
  );
  
  RETURN result;
END;
$$;
