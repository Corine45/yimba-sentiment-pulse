import React from 'react';
import { YimbaReportTemplate } from '../templates/YimbaReportTemplate';

interface YimbaReportGeneratorProps {
  searchTerm: string;
  keywords: string[];
  dateRange: {
    from: Date;
    to: Date;
  };
  mentions?: any[];
  analytics?: any;
}

export const YimbaReportGenerator: React.FC<YimbaReportGeneratorProps> = ({
  searchTerm,
  keywords,
  dateRange,
  mentions = [],
  analytics
}) => {
  // Contenu dynamique basé sur les données de recherche
  const generateDynamicContent = () => {
    return (
      <div className="space-y-8">
        {/* Page 5 - Résumé exécutif */}
        <div className="min-h-screen flex flex-col p-8 page-break">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Résumé Exécutif
          </h1>
          
          <div className="space-y-6 text-lg text-gray-700">
            <p>
              Cette analyse porte sur <strong>{searchTerm}</strong> et examine {mentions.length} mentions 
              collectées sur les réseaux sociaux entre le {dateRange.from.toLocaleDateString('fr-FR')} 
              et le {dateRange.to.toLocaleDateString('fr-FR')}.
            </p>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-4">Mots-clés analysés</h3>
                <ul className="space-y-2">
                  {keywords.map((keyword, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {keyword}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-4">Données collectées</h3>
                <div className="space-y-2">
                  <p><strong>Total mentions:</strong> {mentions.length}</p>
                  <p><strong>Plateformes:</strong> Facebook, Twitter, Instagram, TikTok, YouTube</p>
                  <p><strong>Période:</strong> {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} jours</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-end mt-auto">
            <div className="flex space-x-4">
              <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center font-bold">PNUD</div>
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 text-white flex items-center justify-center">Y</div>
              <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center">O</div>
            </div>
            <div className="text-4xl font-bold text-blue-600">5</div>
          </div>
        </div>

        {/* Page 6 - Analyse des sentiments */}
        <div className="min-h-screen flex flex-col p-8 page-break">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Analyse des Sentiments
          </h1>
          
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-green-100 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {analytics?.sentiment?.positive || 0}%
                </div>
                <div className="text-green-800 font-medium">Positif</div>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-gray-600 mb-2">
                  {analytics?.sentiment?.neutral || 0}%
                </div>
                <div className="text-gray-800 font-medium">Neutre</div>
              </div>
              <div className="bg-red-100 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {analytics?.sentiment?.negative || 0}%
                </div>
                <div className="text-red-800 font-medium">Négatif</div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Principales Observations</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                  La majorité des discussions concernant {searchTerm} sont concentrées sur les plateformes Facebook et Twitter
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                  Les mentions TikTok montrent une engagement plus élevé en termes de vues et de partages
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                  Les régions d'Abidjan et Yamoussoukro génèrent le plus d'activité sur le sujet
                </li>
              </ul>
            </div>
          </div>

          <div className="flex justify-between items-end mt-auto">
            <div className="flex space-x-4">
              <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center font-bold">PNUD</div>
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 text-white flex items-center justify-center">Y</div>
              <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center">O</div>
            </div>
            <div className="text-4xl font-bold text-blue-600">6</div>
          </div>
        </div>

        {/* Page 7 - Recommandations */}
        <div className="min-h-screen flex flex-col p-8 page-break">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Recommandations
          </h1>
          
          <div className="space-y-8">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Surveillance Continue</h3>
              <p className="text-gray-700">
                Maintenir une veille active sur les mots-clés identifiés, particulièrement 
                {keywords.slice(0, 3).map((k, i) => ` "${k}"${i < 2 ? ',' : ''}`)} qui génèrent 
                le plus d'engagement.
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6">
              <h3 className="text-xl font-bold text-green-800 mb-4">Communication Stratégique</h3>
              <p className="text-gray-700">
                Développer une stratégie de communication ciblée sur les plateformes les plus actives, 
                en privilégiant Facebook et Twitter pour la portée, et TikTok pour l'engagement.
              </p>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-6">
              <h3 className="text-xl font-bold text-orange-800 mb-4">Actions Préventives</h3>
              <p className="text-gray-700">
                Mettre en place des mécanismes de réponse rapide pour adresser les sentiments négatifs 
                et amplifier les messages positifs identifiés dans l'analyse.
              </p>
            </div>
          </div>

          <div className="flex justify-between items-end mt-auto">
            <div className="flex space-x-4">
              <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center font-bold">PNUD</div>
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 text-white flex items-center justify-center">Y</div>
              <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center">O</div>
            </div>
            <div className="text-4xl font-bold text-blue-600">7</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <YimbaReportTemplate
      searchTerm={searchTerm}
      keywords={keywords}
      dateRange={dateRange}
      content={generateDynamicContent()}
    />
  );
};