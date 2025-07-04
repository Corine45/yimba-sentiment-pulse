
import { Eye, RefreshCw } from "lucide-react";
import { ReportGenerator } from "./reports/ReportGenerator";
import { WidgetPreviews } from "./reports/WidgetPreviews";
import { ReportTemplates } from "./reports/ReportTemplates";
import { DynamicDemographicAnalysis } from "./widgets/DynamicDemographicAnalysis";
import { DynamicReportsList } from "./widgets/DynamicReportsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSavedMentions } from "@/hooks/useSavedMentions";
import { useDynamicReportsData } from "@/hooks/useDynamicReportsData";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ReportsPanelProps {
  userRole: string;
  permissions: {
    canGenerateReports: boolean;
    canExportData: boolean;
  };
}

export const ReportsPanel = ({ userRole, permissions }: ReportsPanelProps) => {
  const { savedMentions, loading: savedMentionsLoading } = useSavedMentions();
  const { demographicData, reportsData, loading: reportsLoading, refetch } = useDynamicReportsData();
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const handleRefreshData = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Données actualisées",
        description: "Les rapports ont été mis à jour avec les dernières données.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'actualiser les données.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      {userRole === "observateur" && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <Eye className="w-4 h-4 inline mr-1" />
            Mode consultation - Vous consultez les rapports en lecture seule
          </p>
        </div>
      )}

      {/* En-tête avec statistiques de données dynamiques */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <span>Tableau de bord des rapports</span>
              <Badge variant="outline">
                Connecté à Supabase
              </Badge>
            </CardTitle>
            <Button 
              variant="outline" 
              onClick={handleRefreshData}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {savedMentions.length}
              </div>
              <div className="text-sm text-gray-600">Sauvegardes totales</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {reportsData.length}
              </div>
              <div className="text-sm text-gray-600">Rapports générés</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {demographicData.ageGroups.length + demographicData.genders.length}
              </div>
              <div className="text-sm text-gray-600">Analyses démographiques</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {demographicData.locations.length}
              </div>
              <div className="text-sm text-gray-600">Données géographiques</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analyses démographiques dynamiques basées sur Supabase */}
      <DynamicDemographicAnalysis />
      
      {/* Liste des rapports dynamique connectée à l'API */}
      <DynamicReportsList />

      {/* Rapports basés sur les mentions sauvegardées */}
      {savedMentions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Rapports basés sur vos sauvegardes</span>
              <Badge variant="secondary">{savedMentions.length} disponibles</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {savedMentions.slice(0, 5).map((mention) => (
                <div key={mention.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <h4 className="font-medium">{mention.file_name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span>Mots-clés: {mention.search_keywords.join(', ')}</span>
                      <span>Plateformes: {mention.platforms.join(', ')}</span>
                      <span>{mention.total_mentions} mentions</span>
                    </div>
                    
                    {/* Statistiques de sentiment */}
                    <div className="flex items-center space-x-4 mt-2 text-xs">
                      <span className="text-green-600">
                        Positif: {mention.positive_mentions}
                      </span>
                      <span className="text-red-600">
                        Négatif: {mention.negative_mentions}
                      </span>
                      <span className="text-gray-600">
                        Neutre: {mention.neutral_mentions}
                      </span>
                      <span className="text-blue-600">
                        Engagement: {mention.total_engagement.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {mention.export_format.toUpperCase()}
                    </Badge>
                    {permissions.canExportData && (
                      <Button variant="outline" size="sm">
                        Télécharger
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Outils de génération de rapports pour les utilisateurs autorisés */}
      {permissions.canGenerateReports && (
        <>
          <ReportGenerator canGenerateReports={permissions.canGenerateReports} />
          <WidgetPreviews canGenerateReports={permissions.canGenerateReports} />
          <ReportTemplates canGenerateReports={permissions.canGenerateReports} />
        </>
      )}

      {/* Indicateur de chargement */}
      {(savedMentionsLoading || reportsLoading) && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            <span>Chargement des données...</span>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
