
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Heart, MessageCircle, Share2, Eye } from "lucide-react";

interface EngagementStatsProps {
  data: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
    likesChange: number;
    commentsChange: number;
    sharesChange: number;
    viewsChange: number;
  };
}

export const EngagementStats = ({ data }: EngagementStatsProps) => {
  const getTrendIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-l-4 border-l-pink-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-600 flex items-center justify-between">
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-2 text-pink-500" />
              J'aime
            </div>
            {getTrendIcon(data.likesChange)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {data.likes.toLocaleString()}
          </div>
          <p className={`text-sm mt-1 ${getChangeColor(data.likesChange)}`}>
            {data.likesChange >= 0 ? '+' : ''}{data.likesChange}% cette semaine
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-600 flex items-center justify-between">
            <div className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-2 text-blue-500" />
              Commentaires
            </div>
            {getTrendIcon(data.commentsChange)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {data.comments.toLocaleString()}
          </div>
          <p className={`text-sm mt-1 ${getChangeColor(data.commentsChange)}`}>
            {data.commentsChange >= 0 ? '+' : ''}{data.commentsChange}% cette semaine
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-600 flex items-center justify-between">
            <div className="flex items-center">
              <Share2 className="w-4 h-4 mr-2 text-purple-500" />
              Partages
            </div>
            {getTrendIcon(data.sharesChange)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {data.shares.toLocaleString()}
          </div>
          <p className={`text-sm mt-1 ${getChangeColor(data.sharesChange)}`}>
            {data.sharesChange >= 0 ? '+' : ''}{data.sharesChange}% cette semaine
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-600 flex items-center justify-between">
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-2 text-orange-500" />
              Vues
            </div>
            {getTrendIcon(data.viewsChange)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {data.views.toLocaleString()}
          </div>
          <p className={`text-sm mt-1 ${getChangeColor(data.viewsChange)}`}>
            {data.viewsChange >= 0 ? '+' : ''}{data.viewsChange}% cette semaine
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
