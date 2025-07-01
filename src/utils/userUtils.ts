
import type { User, UserStats } from '@/types/user';

export const calculateUserStats = (users: User[]): UserStats => {
  const total = users.length;
  const active = users.filter(u => u.status === 'active').length;
  const admins = users.filter(u => u.role === 'admin').length;
  const analysts = users.filter(u => u.role === 'analyste').length;

  console.log('📈 Statistiques calculées:', { total, active, admins, analysts });
  return { total, active, admins, analysts };
};
