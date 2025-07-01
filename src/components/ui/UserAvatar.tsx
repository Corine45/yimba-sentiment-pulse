
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user: {
    name?: string;
    email?: string;
    avatar_url?: string;
  };
  status?: 'online' | 'busy' | 'away' | 'offline';
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  className?: string;
}

const statusConfig = {
  online: { color: 'bg-green-500', label: 'En ligne' },
  busy: { color: 'bg-yellow-500', label: 'Occupé' },
  away: { color: 'bg-orange-500', label: 'Absent' },
  offline: { color: 'bg-gray-400', label: 'Hors ligne' }
};

const sizeConfig = {
  sm: { avatar: 'h-8 w-8', status: 'h-2 w-2', text: 'text-xs' },
  md: { avatar: 'h-10 w-10', status: 'h-3 w-3', text: 'text-sm' },
  lg: { avatar: 'h-12 w-12', status: 'h-4 w-4', text: 'text-base' }
};

export const UserAvatar = ({ 
  user, 
  status = 'offline', 
  size = 'md', 
  showStatus = true,
  className 
}: UserAvatarProps) => {
  const getInitials = () => {
    if (user.name) {
      return user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getGradientFromName = () => {
    const name = user.name || user.email || 'User';
    const colors = [
      'from-blue-400 to-blue-600',
      'from-green-400 to-green-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-indigo-400 to-indigo-600',
      'from-yellow-400 to-yellow-600',
      'from-red-400 to-red-600',
      'from-teal-400 to-teal-600'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className={cn("relative", className)}>
      <Avatar className={cn(sizeConfig[size].avatar)}>
        {user.avatar_url && (
          <AvatarImage src={user.avatar_url} alt={user.name || user.email} />
        )}
        <AvatarFallback 
          className={cn(
            `bg-gradient-to-br ${getGradientFromName()} text-white font-semibold`,
            sizeConfig[size].text
          )}
        >
          {getInitials()}
        </AvatarFallback>
      </Avatar>
      
      {showStatus && (
        <div 
          className={cn(
            "absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-white",
            statusConfig[status].color,
            sizeConfig[size].status
          )}
          title={statusConfig[status].label}
        />
      )}
    </div>
  );
};
