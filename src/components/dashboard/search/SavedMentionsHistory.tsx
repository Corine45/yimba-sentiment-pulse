
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Trash2, Search, FileText, Calendar, TrendingUp } from "lucide-react";
import { useSavedMentions } from "@/hooks/useSavedMentions";
import { useToast } from "@/hooks/use-toast";
import { FileGenerators } from '@/utils/fileGenerators';

export const SavedMentionsHistory = () => {
  const { savedMentions, loading, deleteSavedMention } = useSavedMentions();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredMentions = savedMentions.filter(mention =>
    mention.search_keywords.some(keyword => 
      keyword.toLowerCase().includes(searchTerm.toLowerCase())
    ) || mention.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedMentions = [...filteredMentions].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'mentions':
        return b.total_mentions - a.total_mentions;
      case 'engagement':
        return b.total_engagement - a.total_engagement;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedMentions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMentions = sortedMentions.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id: string, fileName: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${fileName}" ?`)) {
      return;
    }

    const result = await deleteSavedMention(id);
    if (result.success) {
      toast({
        title: "Suppression réussie",
        description: `"${fileName}" a été supprimé avec succès.`,
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la sauvegarde.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (mention: any) => {
    try {
      const stats = {
        total: mention.total_mentions,
        positive: mention.positive_mentions,
        neutral: mention.neutral_mentions,
        negative: mention.negative_mentions,
        engagement: mention.total_engagement
      };

      await FileGenerators.generateFile(
        mention.mentions_data,
        mention.search_keywords,
        mention.platforms,
        mention.export_format as 'json' | 'pdf' | 'csv',
        mention.file_name,
        stats
      );

      toast({
        title: "Téléchargement lancé",
        description: `Le fichier "${mention.file_name}.${mention.export_format}" a été généré.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le fichier.",
        variant: "destructive",
      });
    }
  };

  const getSentimentColor = (positive: number, neutral: number, negative: number) => {
    const total = positive + neutral + negative;
    if (total === 0) return 'text-gray-600';
    if (positive / total > 0.6) return 'text-green-600';
    if (negative / total > 0.6) return 'text-red-600';
    return 'text-yellow-600';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Historique des sauvegardes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Chargement des sauvegardes...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Historique des sauvegardes</span>
          <Badge variant="secondary">{savedMentions.length}</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Filtres et recherche */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par mots-clés ou nom de fichier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date (récent)</SelectItem>
              <SelectItem value="mentions">Nb. mentions</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {paginatedMentions.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm ? 'Aucune sauvegarde trouvée pour cette recherche.' : 'Aucune sauvegarde trouvée. Lancez une recherche pour commencer.'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom du fichier</TableHead>
                    <TableHead>Mots-clés</TableHead>
                    <TableHead>Plateformes</TableHead>
                    <TableHead>Mentions</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedMentions.map((mention) => (
                    <TableRow key={mention.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span>{mention.file_name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {mention.export_format.toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {mention.search_keywords.slice(0, 3).map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                          {mention.search_keywords.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{mention.search_keywords.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {mention.platforms.map((platform, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{mention.total_mentions}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className={`text-sm ${getSentimentColor(mention.positive_mentions, mention.neutral_mentions, mention.negative_mentions)}`}>
                          <div>✓ {mention.positive_mentions}</div>
                          <div>○ {mention.neutral_mentions}</div>
                          <div>✗ {mention.negative_mentions}</div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <span className="font-medium text-orange-600">
                          {mention.total_engagement.toLocaleString()}
                        </span>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(mention.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(mention)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(mention.id, mention.file_name)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, sortedMentions.length)} sur {sortedMentions.length} sauvegardes
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
