
-- Supprimer toutes les contraintes de clé étrangère vers auth.users
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;
ALTER TABLE public.user_sessions DROP CONSTRAINT IF EXISTS user_sessions_user_id_fkey;

-- Insérer les profils utilisateurs
INSERT INTO public.profiles (id, name, email, role) VALUES
  (gen_random_uuid(), 'Admin Observateur 1', 'admin-observateur1@yimba.com', 'admin'),
  (gen_random_uuid(), 'Admin Test 1', 'admin-test1@yimba.com', 'admin'),
  (gen_random_uuid(), 'Admin Test Test', 'admin-testtest@yimba.com', 'admin'),
  (gen_random_uuid(), 'Admin Test', 'admin-test@yimba.com', 'admin'),
  (gen_random_uuid(), 'Admin Test User', 'admintest@yimba.com', 'admin'),
  (gen_random_uuid(), 'Test Admin', 'testadmin@yimba.com', 'admin');

-- Insérer les rôles correspondants dans user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::app_role 
FROM public.profiles 
WHERE email IN (
  'admin-observateur1@yimba.com',
  'admin-test1@yimba.com', 
  'admin-testtest@yimba.com',
  'admin-test@yimba.com',
  'admintest@yimba.com',
  'testadmin@yimba.com'
)
ON CONFLICT (user_id, role) DO NOTHING;

-- Créer des sessions actives pour ces utilisateurs
INSERT INTO public.user_sessions (user_id, session_start, is_active)
SELECT id, now(), true
FROM public.profiles 
WHERE email IN (
  'admin-observateur1@yimba.com',
  'admin-test1@yimba.com', 
  'admin-testtest@yimba.com',
  'admin-test@yimba.com',
  'admintest@yimba.com',
  'testadmin@yimba.com'
);

-- Afficher un récapitulatif des utilisateurs créés
SELECT 
  p.name, 
  p.email, 
  p.role,
  CASE WHEN us.is_active THEN 'Actif' ELSE 'Inactif' END as status
FROM public.profiles p
LEFT JOIN public.user_sessions us ON p.id = us.user_id
WHERE p.email IN (
  'admin-observateur1@yimba.com',
  'admin-test1@yimba.com', 
  'admin-testtest@yimba.com',
  'admin-test@yimba.com',
  'admintest@yimba.com',
  'testadmin@yimba.com'
);
