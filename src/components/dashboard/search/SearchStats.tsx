
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share, Eye, Save } from "lucide-react";

interface SearchStatsProps {
  totalMentions: number;
  sentimentStats: { positive: number; neutral: number; negative: number };
  totalEngagement: number;
  mentions: any[];
  onSaveMentions: (format: 'json' | 'pdf' | 'csv') => void;
}

export const SearchStats = ({ 
  totalMentions, 
  sentimentStats, 
  totalEngagement, 
  mentions,
  onSaveMentions 
}: SearchStatsProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalMentions}</div>
            <div className="text-sm text-gray-600">Total mentions</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{sentimentStats.positive}</div>
            <div className="text-sm text-gray-600">Positives</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{sentimentStats.neutral}</div>
            <div className="text-sm text-gray-600">Neutres</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{sentimentStats.negative}</div>
            <div className="text-sm text-gray-600">Négatives</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{formatNumber(totalEngagement)}</div>
            <div className="text-sm text-gray-600">Engagement total</div>
          </div>
          
          <div className="text-center">
            <div className="flex space-x-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onSaveMentions('json')}
                className="text-blue-600"
              >
                <Save className="w-4 h-4 mr-1" />
                JSON
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onSaveMentions('pdf')}
                className="text-red-600"
              >
                PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onSaveMentions('csv')}
                className="text-green-600"
              >
                CSV
              </Button>
            </div>
          </div>
        </div>
        
        {totalEngagement > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700 mb-3">Engagement détaillé</div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="font-medium">
                  {formatNumber(mentions.reduce((sum, m) => sum + m.engagement.likes, 0))}
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <span className="font-medium">
                  {formatNumber(mentions.reduce((sum, m) => sum + m.engagement.comments, 0))}
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Share className="w-4 h-4 text-green-500" />
                <span className="font-medium">
                  {formatNumber(mentions.reduce((sum, m) => sum + m.engagement.shares, 0))}
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Eye className="w-4 h-4 text-purple-500" />
                <span className="font-medium">
                  {formatNumber(mentions.reduce((sum, m) => sum + (m.engagement.views || 0), 0))}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
