
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DemographicAnalysis } from "../widgets/DemographicAnalysis";
import { WordCloud } from "../widgets/WordCloud";
import { AIAnalysis } from "../widgets/AIAnalysis";
import { KeywordFrequency } from "../widgets/KeywordFrequency";

interface WidgetPreviewsProps {
  canGenerateReports: boolean;
}

export const WidgetPreviews = ({ canGenerateReports }: WidgetPreviewsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {canGenerateReports ? "Aperçu des widgets de rapport" : "Widgets disponibles"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="demographic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="demographic">Démographie</TabsTrigger>
            <TabsTrigger value="wordcloud">Nuage de mots</TabsTrigger>
            <TabsTrigger value="ai">Analyse IA</TabsTrigger>
            <TabsTrigger value="frequency">Fréquence</TabsTrigger>
          </TabsList>
          
          <TabsContent value="demographic" className="mt-6">
            <DemographicAnalysis />
          </TabsContent>
          
          <TabsContent value="wordcloud" className="mt-6">
            <WordCloud mentions={[]} />
          </TabsContent>
          
          <TabsContent value="ai" className="mt-6">
            <AIAnalysis />
          </TabsContent>
          
          <TabsContent value="frequency" className="mt-6">
            <KeywordFrequency mentions={[]} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
