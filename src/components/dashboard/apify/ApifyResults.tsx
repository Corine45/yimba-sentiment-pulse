
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import { EngagementData } from "@/services/apifyService";
import { EngagementSummary } from "./EngagementSummary";
import { EngagementDetails } from "./EngagementDetails";

interface ApifyResultsProps {
  engagementData: EngagementData[];
  selectedPlatform: string;
  permissions: {
    canSearch: boolean;
    canExportData: boolean;
  };
}

export const ApifyResults = ({ engagementData, selectedPlatform, permissions }: ApifyResultsProps) => {
  const getTotalEngagement = () => {
    return engagementData.reduce((total, item) => {
      return {
        likes: total.likes + item.likes,
        comments: total.comments + item.comments,
        shares: total.shares + item.shares,
      };
    }, { likes: 0, comments: 0, shares: 0 });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(engagementData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `apify_engagement_${selectedPlatform}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (engagementData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Données d'engagement récupérées</CardTitle>
          {permissions.canExportData && (
            <Button variant="outline" onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList>
            <TabsTrigger value="summary">Résumé</TabsTrigger>
            <TabsTrigger value="details">Détails</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            <EngagementSummary 
              totalPosts={engagementData.length}
              totalEngagement={getTotalEngagement()}
            />
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            <EngagementDetails engagementData={engagementData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
