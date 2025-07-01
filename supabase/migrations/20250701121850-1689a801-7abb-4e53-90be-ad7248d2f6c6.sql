
-- Créer la table pour les métriques système réelles
CREATE TABLE public.system_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL, -- 'cpu', 'memory', 'storage', 'database', 'network'
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL, -- '%', 'MB', 'GB', 'ms', 'count'
  metadata JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table pour les événements de sécurité authentiques
CREATE TABLE public.security_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL, -- 'login', 'logout', 'failed_login', 'permission_change', 'data_access'
  event_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  severity TEXT NOT NULL DEFAULT 'info', -- 'low', 'medium', 'high', 'critical'
  status TEXT NOT NULL DEFAULT 'resolved', -- 'pending', 'investigating', 'resolved'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table pour les sessions utilisateurs réelles
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  session_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_end TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  pages_visited INTEGER DEFAULT 0,
  actions_performed INTEGER DEFAULT 0,
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajouter les politiques RLS pour system_metrics
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and analysts can view system metrics"
  ON public.system_metrics
  FOR SELECT
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'analyste'::app_role)
  );

CREATE POLICY "Only admins can insert system metrics"
  ON public.system_metrics
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Ajouter les politiques RLS pour security_events
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all security events"
  ON public.security_events
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own security events"
  ON public.security_events
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert security events"
  ON public.security_events
  FOR INSERT
  WITH CHECK (true);

-- Ajouter les politiques RLS pour user_sessions
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all user sessions"
  ON public.user_sessions
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own sessions"
  ON public.user_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions"
  ON public.user_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON public.user_sessions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Insérer quelques données de base pour éviter les tables vides
INSERT INTO public.system_metrics (metric_type, value, unit, metadata) VALUES
('cpu', 45.2, '%', '{"cores": 4, "load_avg": 1.2}'),
('memory', 68.5, '%', '{"total_gb": 16, "used_gb": 10.96}'),
('storage', 2048, 'MB', '{"total_gb": 10, "available_gb": 8}'),
('database', 12, 'count', '{"max_connections": 100, "type": "active_connections"}'),
('network', 120, 'ms', '{"endpoint": "api_response_time", "region": "eu-west-1"}');

-- Créer des événements de sécurité de base
INSERT INTO public.security_events (event_type, event_data, severity, status) VALUES
('system_check', '{"component": "authentication", "status": "healthy"}', 'info', 'resolved'),
('system_check', '{"component": "database", "status": "healthy"}', 'info', 'resolved'),
('system_check', '{"component": "api", "status": "healthy"}', 'info', 'resolved');
