
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Search, AlertTriangle, FileText, Activity } from "lucide-react";

interface ActivityIndicatorProps {
  type: 'search' | 'alert' | 'report' | 'activity';
  count: number;
  variant?: 'default' | 'minimal';
  className?: string;
}

const indicatorConfig = {
  search: {
    icon: Search,
    color: 'bg-blue-500 text-white',
    bgColor: 'bg-blue-50 text-blue-700 border-blue-200',
    label: 'Recherches'
  },
  alert: {
    icon: AlertTriangle,
    color: 'bg-red-500 text-white',
    bgColor: 'bg-red-50 text-red-700 border-red-200',
    label: 'Alertes'
  },
  report: {
    icon: FileText,
    color: 'bg-green-500 text-white',
    bgColor: 'bg-green-50 text-green-700 border-green-200',
    label: 'Rapports'
  },
  activity: {
    icon: Activity,
    color: 'bg-purple-500 text-white',
    bgColor: 'bg-purple-50 text-purple-700 border-purple-200',
    label: 'Activité'
  }
};

export const ActivityIndicator = ({ 
  type, 
  count, 
  variant = 'default',
  className 
}: ActivityIndicatorProps) => {
  const config = indicatorConfig[type];
  const Icon = config.icon;

  if (count === 0 && variant === 'minimal') return null;

  if (variant === 'minimal') {
    return (
      <div className={cn(
        "relative inline-flex",
        className
      )}>
        <Icon className="w-4 h-4 text-gray-600" />
        {count > 0 && (
          <Badge 
            className={cn(
              "absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs",
              config.color
            )}
          >
            {count > 99 ? '99+' : count}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Badge 
      variant="outline"
      className={cn(
        "flex items-center space-x-1 px-2 py-1",
        config.bgColor,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      <span className="text-xs font-medium">
        {count > 99 ? '99+' : count}
      </span>
    </Badge>
  );
};
