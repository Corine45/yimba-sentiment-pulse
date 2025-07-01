
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlatformDistributionProps {
  platformCounts: Record<string, number>;
}

export const PlatformDistribution = ({ platformCounts }: PlatformDistributionProps) => {
  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return 'bg-pink-500';
      case 'twitter':
        return 'bg-blue-500';
      case 'facebook':
        return 'bg-indigo-500';
      case 'tiktok':
        return 'bg-purple-500';
      case 'youtube':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (Object.keys(platformCounts).length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition par plateforme</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(platformCounts).map(([platform, count]) => (
            <div key={platform} className="text-center p-4 border rounded-lg">
              <div className={`w-4 h-4 ${getPlatformColor(platform)} rounded mx-auto mb-2`}></div>
              <div className="font-medium">{platform}</div>
              <div className="text-lg font-bold text-gray-700">{count.toLocaleString()}</div>
              <div className="text-xs text-gray-500">mentions</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
