
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, BarChart3, Calendar, Filter, Search, TrendingUp, Users, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ReportsList } from "./reports/ReportsList";
import { NewReportGenerator } from "./reports/NewReportGenerator";
import { YimbaReportGenerator } from "./reports/YimbaReportGenerator";
import { ScheduledReports } from "./reports/ScheduledReports";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

interface Report {
  id: string;
  name: string;
  type: 'mentions' | 'sentiment' | 'engagement' | 'demographics' | 'geographic';
  status: 'completed' | 'processing' | 'failed';
  created_at: string;
  data_summary: {
    total_mentions: number;
    platforms: string[];
    keywords: string[];
    date_range: string;
  };
  file_url?: string;
  scheduled?: boolean;
}

interface ReportStats {
  total_reports: number;
  completed_reports: number;
  processing_reports: number;
  failed_reports: number;
  total_mentions_analyzed: number;
}

export const ReportsPanel = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ReportStats>({
    total_reports: 0,
    completed_reports: 0,
    processing_reports: 0,
    failed_reports: 0,
    total_mentions_analyzed: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Charger les statistiques depuis Supabase
      const { data: mentionSaves } = await supabase
        .from('mention_saves')
        .select('*');

      if (mentionSaves) {
        const totalMentions = mentionSaves.reduce((sum, save) => sum + save.total_mentions, 0);
        setStats({
          total_reports: mentionSaves.length,
          completed_reports: mentionSaves.length,
          processing_reports: 0,
          failed_reports: 0,
          total_mentions_analyzed: totalMentions
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  // Vérifier les permissions depuis le profil
  const { profile } = useProfile();
  const canGenerateReports = profile?.role === 'admin' || profile?.role === 'analyste';
  const canExportData = profile?.role === 'admin' || profile?.role === 'analyste';

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total rapports</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total_reports}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Terminés</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed_reports}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">En cours</p>
                <p className="text-2xl font-bold text-orange-600">{stats.processing_reports}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Échoués</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed_reports}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Mentions totales</p>
                <p className="text-2xl font-bold text-purple-600">{stats.total_mentions_analyzed.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="list">📋 Liste des rapports</TabsTrigger>
          <TabsTrigger value="generate">➕ Générer un rapport</TabsTrigger>
          <TabsTrigger value="yimba">📊 Rapport Yimba</TabsTrigger>
          <TabsTrigger value="scheduled">📅 Rapports programmés</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <ReportsList 
            canGenerateReports={canGenerateReports}
            canExportData={canExportData}
          />
        </TabsContent>

        <TabsContent value="generate">
          {canGenerateReports ? (
            <NewReportGenerator />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Accès non autorisé</h3>
                <p className="text-gray-600">
                  Vous n'avez pas les permissions nécessaires pour générer des rapports.
                  Contactez votre administrateur pour obtenir l'accès.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="yimba">
          {canGenerateReports ? (
            <YimbaReportGenerator />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Accès non autorisé</h3>
                <p className="text-gray-600">
                  Vous n'avez pas les permissions nécessaires pour générer des rapports Yimba.
                  Contactez votre administrateur pour obtenir l'accès.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="scheduled">
          {canGenerateReports ? (
            <ScheduledReports />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Accès non autorisé</h3>
                <p className="text-gray-600">
                  Vous n'avez pas les permissions nécessaires pour programmer des rapports.
                  Contactez votre administrateur pour obtenir l'accès.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Informations sur l'intégration */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <h3 className="font-medium mb-3 text-green-900">🔄 Rapports connectés Yimba Pulse + Supabase</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2 text-green-800">📊 Génération automatique</h4>
              <ul className="space-y-1 text-green-700">
                <li>• Données en temps réel via 30+ APIs</li>
                <li>• Exports PDF, HTML, Excel</li>
                <li>• Sauvegarde Supabase automatique</li>
                <li>• Historique complet accessible</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-green-800">🎯 Types de rapports disponibles</h4>
              <ul className="space-y-1 text-green-700">
                <li>• 📊 Mentions et veille média</li>
                <li>• 😊 Analyse de sentiment avancée</li>
                <li>• ❤️ Engagement et viralité</li>
                <li>• 👥 Démographie LGBT+ spécialisée</li>
                <li>• 🌍 Géolocalisation Afrique</li>
                <li>• 🔄 Rapports personnalisés</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-green-800">✨ Fonctionnalités avancées</h4>
              <ul className="space-y-1 text-green-700">
                <li>• 🤖 Analyse IA contexte LGBT+</li>
                <li>• 📈 Tendances Brand24 style</li>
                <li>• 🔔 Notifications en temps réel</li>
                <li>• 📧 Rapports programmés par email</li>
                <li>• 📱 Export mobile-friendly</li>
                <li>• 🔒 Sécurité RLS Supabase</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
