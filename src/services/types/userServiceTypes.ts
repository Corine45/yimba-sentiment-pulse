
// Types spécifiques au service utilisateur
export interface AuthUser {
  id: string;
  email?: string;
  email_confirmed_at?: string | null;
  last_sign_in_at?: string | null;
  user_metadata?: any;
  app_metadata?: any;
}

export interface UserWithEmailStatus {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive';
  last_login?: string;
  email_confirmed: boolean;
  email_confirmed_at?: string | null;
}
