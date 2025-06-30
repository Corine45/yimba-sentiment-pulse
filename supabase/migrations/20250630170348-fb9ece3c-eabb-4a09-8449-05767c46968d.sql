
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'analyste', 'observateur');

-- Create profiles table for extended user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'observateur',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create search_history table for tracking user searches
CREATE TABLE public.search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  search_term TEXT NOT NULL,
  filters JSONB,
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create social_media_data table for storing search results
CREATE TABLE public.social_media_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  engagement JSONB,
  reach INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  search_term TEXT
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_media_data ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" 
  ON public.user_roles 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for search_history
CREATE POLICY "Users can view their own search history" 
  ON public.search_history 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own search history" 
  ON public.search_history 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for social_media_data
CREATE POLICY "Authenticated users can view social media data" 
  ON public.social_media_data 
  FOR SELECT 
  TO authenticated;

CREATE POLICY "Analysts and admins can insert social media data" 
  ON public.social_media_data 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'analyste')
  );

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data ->> 'name', 'Nouvel utilisateur'),
    new.email,
    'observateur'
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'observateur');
  
  RETURN new;
END;
$$;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample social media data for "woubi" searches
INSERT INTO public.social_media_data (platform, content, author, sentiment, engagement, reach, search_term) VALUES
('Instagram', 'Le woubi est une danse traditionnelle ivoirienne magnifique ! 💃 #woubi #tradition #cotedivoire', '@danse_ivoirienne', 'positive', '{"likes": 245, "shares": 56, "comments": 23}', 3450, 'woubi'),
('Twitter', 'Spectacle de woubi ce soir à Abidjan ! Venez nombreux découvrir cette danse ancestrale #woubi #abidjan', '@culture_ci', 'positive', '{"likes": 89, "shares": 34, "comments": 12}', 1890, 'woubi'),
('Facebook', 'Cours de woubi pour débutants tous les samedis ! Une belle façon de découvrir notre patrimoine culturel', 'Centre Culturel Ivoirien', 'positive', '{"likes": 156, "shares": 78, "comments": 45}', 2340, 'woubi'),
('TikTok', 'Tutoriel woubi - Apprendre les pas de base 🎵 #woubi #dance #tutorial #africa', '@danse_afrique', 'positive', '{"likes": 892, "shares": 234, "comments": 67}', 12500, 'woubi'),
('YouTube', 'Documentaire : L''histoire du woubi en Côte d''Ivoire - Patrimoine culturel africain', 'Documentaires Afrique', 'neutral', '{"likes": 345, "shares": 89, "comments": 78}', 5670, 'woubi');
