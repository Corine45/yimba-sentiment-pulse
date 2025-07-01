
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyste' | 'observateur';
  created_at: string;
  updated_at: string;
  last_login?: string;
  status: 'active' | 'inactive';
}

export interface NewUser {
  name: string;
  email: string;
  role: 'admin' | 'analyste' | 'observateur';
}

export interface UserStats {
  total: number;
  active: number;
  admins: number;
  analysts: number;
}
