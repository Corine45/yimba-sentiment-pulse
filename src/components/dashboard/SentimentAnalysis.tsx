
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye } from "lucide-react";
import { AIContextGenerator } from "./widgets/AIContextGenerator";
import { InfluencerAnalysis } from "./widgets/InfluencerAnalysis";
import { MediaDistribution } from "./widgets/MediaDistribution";
import { SourceDiversity } from "./widgets/SourceDiversity";
import { GeographicDistribution } from "./widgets/GeographicDistribution";
import { PotentialReach } from "./widgets/PotentialReach";
import { RealTimeDashboard } from "./widgets/RealTimeDashboard";
import { SentimentOverview } from "./widgets/SentimentOverview";
import { SentimentCharts } from "./widgets/SentimentCharts";
import { TrendingTopics } from "./widgets/TrendingTopics";

interface SentimentAnalysisProps {
  userRole: string;
  permissions: {
    canAnalyze: boolean;
    canExportData: boolean;
  };
}

export const SentimentAnalysis = ({ userRole, permissions }: SentimentAnalysisProps) => {
  return (
    <div className="space-y-6">
      {userRole === "observateur" && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <Eye className="w-4 h-4 inline mr-1" />
            Mode consultation - Vous consultez les analyses en lecture seule
          </p>
        </div>
      )}

      <AIContextGenerator />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="influencers">Influenceurs</TabsTrigger>
          <TabsTrigger value="media">Médias</TabsTrigger>
          <TabsTrigger value="geographic">Géographie</TabsTrigger>
          <TabsTrigger value="reach">Impact</TabsTrigger>
          <TabsTrigger value="realtime">Temps réel</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <SentimentOverview />
          <SourceDiversity />
          <SentimentCharts />
          <TrendingTopics />
        </TabsContent>

        <TabsContent value="influencers" className="space-y-6">
          <InfluencerAnalysis />
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <MediaDistribution />
        </TabsContent>

        <TabsContent value="geographic" className="space-y-6">
          <GeographicDistribution />
        </TabsContent>

        <TabsContent value="reach" className="space-y-6">
          <PotentialReach />
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <RealTimeDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};
