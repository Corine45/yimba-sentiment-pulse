
import { Badge } from "@/components/ui/badge";
import { EngagementData } from "@/services/apifyService";

interface EngagementDetailsProps {
  engagementData: EngagementData[];
}

export const EngagementDetails = ({ engagementData }: EngagementDetailsProps) => {
  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {engagementData.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{item.platform}</Badge>
              <span className="text-sm font-medium">{item.author}</span>
            </div>
            <div className="text-xs text-gray-500">
              {new Date(item.timestamp).toLocaleDateString()}
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
            {item.content}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-4 text-sm text-gray-500">
              <span>❤️ {item.likes}</span>
              <span>💬 {item.comments}</span>
              <span>🔄 {item.shares}</span>
            </div>
            {item.url && (
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 text-xs hover:underline"
              >
                Voir le post
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
