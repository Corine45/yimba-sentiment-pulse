
-- Table pour l'historique des sauvegardes de mentions
CREATE TABLE public.mention_saves (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  search_keywords TEXT[] NOT NULL,
  platforms TEXT[] NOT NULL,
  total_mentions INTEGER NOT NULL DEFAULT 0,
  positive_mentions INTEGER NOT NULL DEFAULT 0,
  neutral_mentions INTEGER NOT NULL DEFAULT 0,
  negative_mentions INTEGER NOT NULL DEFAULT 0,
  total_engagement BIGINT NOT NULL DEFAULT 0,
  mentions_data JSONB NOT NULL DEFAULT '[]'::jsonb,
  filters_applied JSONB NOT NULL DEFAULT '{}'::jsonb,
  export_format TEXT NOT NULL DEFAULT 'json',
  file_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les filtres géographiques
CREATE TABLE public.geographic_filters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  country_code TEXT,
  region TEXT,
  city TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  radius INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS pour mention_saves
ALTER TABLE public.mention_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mention saves" 
  ON public.mention_saves 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mention saves" 
  ON public.mention_saves 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mention saves" 
  ON public.mention_saves 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mention saves" 
  ON public.mention_saves 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS pour geographic_filters
ALTER TABLE public.geographic_filters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own geographic filters" 
  ON public.geographic_filters 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own geographic filters" 
  ON public.geographic_filters 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own geographic filters" 
  ON public.geographic_filters 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own geographic filters" 
  ON public.geographic_filters 
  FOR DELETE 
  USING (auth.uid() = user_id);
