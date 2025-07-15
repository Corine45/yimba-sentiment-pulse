import React from 'react';

interface YimbaReportTemplateProps {
  searchTerm: string;
  keywords: string[];
  dateRange: {
    from: Date;
    to: Date;
  };
  content?: React.ReactNode;
}

export const YimbaReportTemplate: React.FC<YimbaReportTemplateProps> = ({
  searchTerm,
  keywords,
  dateRange,
  content
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white">
      {/* Page 1 - Couverture */}
      <div className="min-h-screen flex flex-col p-8 relative">
        {/* Header avec logos */}
        <div className="flex justify-between items-start mb-16">
          <div className="flex items-center space-x-4">
            <div className="w-48 h-32 bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
              ONUSIDA
            </div>
            <div className="text-sm font-medium">
              <div className="text-red-600">■ EXPERTISE</div>
              <div className="text-black">■ FRANCE</div>
            </div>
          </div>
          <div className="w-24 h-24 bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            PNUD
          </div>
        </div>

        {/* Logo Yimba central */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
              <div className="w-6 h-6 bg-gray-800 rounded-full"></div>
            </div>
            <span className="text-4xl font-light text-gray-800">Yimba</span>
          </div>
        </div>

        {/* Titre principal */}
        <div className="text-center mb-16 flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 leading-tight">
            {searchTerm}: analyse des perceptions sur les réseaux sociaux en Côte d'Ivoire
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
          </p>
        </div>

        {/* Icônes des réseaux sociaux */}
        <div className="flex justify-center space-x-8">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">f</div>
          <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center text-white text-2xl">𝕏</div>
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-400 rounded-lg flex items-center justify-center text-white">📷</div>
          <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center text-white font-bold">TikTok</div>
          <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center text-white">▶</div>
        </div>
      </div>

      {/* Page 2 - Description Yimba */}
      <div className="min-h-screen flex flex-col p-8 page-break">
        <h1 className="text-3xl font-bold text-gray-800 mb-12">
          YIMBA – Comprendre les émotions pour mieux agir
        </h1>
        
        <div className="text-lg text-gray-700 leading-relaxed space-y-6">
          <p>
            YIMBA est une plateforme digitale d'analyse émotionnelle développée en 2023 par le Laboratoire d'Innovation du 
            PNUD Côte d'Ivoire, en partenariat avecdes start-ups locales. Créée comme un outil de « sense making » et 
            d'intelligence collective, elle capte et analyse en temps réel les opinions et émotions collectives sur les réseaux 
            sociaux, blogs, forums et sites d'actualité.Toutes les données analysées par Yimba sont publiquement 
            accessibles : commentaires, publications et interactions visibles par tous sur les plateformes enligne.Les 
            utilisateurs peuvent effectuer des recherches ciblées en saisissant des mots-clés sur la plateforme. L'application 
            analyse alors automatiquement lesrésultats associés, en identifiant les sentiments (positif, neutre, négatif), les 
            tendances émergentes, les hashtags, les régions concernées, et ladémographie de l'audience.
          </p>
        </div>

        <div className="flex justify-between items-end mt-auto">
          <div className="flex space-x-4">
            <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center font-bold">PNUD</div>
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 text-white flex items-center justify-center">Y</div>
            <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center">O</div>
          </div>
          <div className="text-4xl font-bold text-blue-600">2</div>
        </div>
      </div>

      {/* Page 3 - Signification YIMBA */}
      <div className="min-h-screen flex flex-col p-8 page-break">
        <h1 className="text-3xl font-bold text-gray-800 mb-12">
          YIMBA – Comprendre les émotions pour mieux agir
        </h1>
        
        <div className="text-lg text-gray-700 leading-relaxed space-y-8">
          <p>
            Le nom <strong>YIMBA</strong>, mot d'origine baoulé signifiant <strong>"yeux"</strong>, symbolise une vision claire, vigilante et stratégique sur 
            l'information. Le nom incarne une mission ambitieuse :
          </p>

          <div className="space-y-4 ml-8">
            <p><strong>Y</strong> – Yeux qui observent et analysent |</p>
            <p><strong>I</strong> – Intelligents pour une lecture critique et lucide des données |</p>
            <p><strong>M</strong> – Multiples sources soulignant la diversité et la fiabilité des points d'entrée |</p>
            <p><strong>B</strong> – Bouger les lignes en dénonçant, en influençant ou en innovant grâce aux données |</p>
            <p><strong>A</strong> – Accélération du changement social, institutionnel ou culturel.</p>
          </div>

          <p className="mt-12">
            <strong>Yimba</strong> est accessible sur www.yimba-ci.net, avec des rapports personnalisables transmis en formats HTML, PPT 
            ou PDF.
          </p>
        </div>

        <div className="flex justify-between items-end mt-auto">
          <div className="flex space-x-4">
            <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center font-bold">PNUD</div>
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 text-white flex items-center justify-center">Y</div>
            <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center">O</div>
          </div>
          <div className="text-4xl font-bold text-blue-600">3</div>
        </div>
      </div>

      {/* Page 4 - Disclaimer */}
      <div className="min-h-screen flex flex-col p-8 page-break">
        <div className="bg-blue-600 text-white p-4 mb-8 flex items-center">
          <div className="w-8 h-8 bg-white rounded-full text-blue-600 flex items-center justify-center font-bold mr-4">!</div>
          <h1 className="text-2xl font-bold">DISCLAIMER</h1>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-400 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 p-3 text-left font-bold">Plateforme</th>
                <th className="border border-gray-400 p-3 text-left font-bold">Niveau d'accès API</th>
                <th className="border border-gray-400 p-3 text-left font-bold">Limitations légales (RGPD, consentement)</th>
                <th className="border border-gray-400 p-3 text-left font-bold">Couverture & possibilités d'extraction</th>
                <th className="border border-gray-400 p-3 text-left font-bold">Présence des données (types)</th>
                <th className="border border-gray-400 p-3 text-left font-bold">Contraintes techniques (coût, API, etc.)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-400 p-3 font-medium">Twitter</td>
                <td className="border border-gray-400 p-3">Accès partiel</td>
                <td className="border border-gray-400 p-3">Profilage interdit, RGPD strict, anonymisation requise</td>
                <td className="border border-gray-400 p-3">Bonne couverture via mots-clés, hashtags, comptes suivis</td>
                <td className="border border-gray-400 p-3">Tweets, likes, retweets, mentions</td>
                <td className="border border-gray-400 p-3">Coût élevé, quotas, nécessite traitement des données</td>
              </tr>
              <tr>
                <td className="border border-gray-400 p-3 font-medium">Facebook</td>
                <td className="border border-gray-400 p-3">Très restreint (API Graph)</td>
                <td className="border border-gray-400 p-3">Données privées interdites, consentement obligatoire</td>
                <td className="border border-gray-400 p-3">Faible couverture, uniquement pages publiques</td>
                <td className="border border-gray-400 p-3">Publications, réactions, commentaires (pages publiques)</td>
                <td className="border border-gray-400 p-3">Vérification d'accès complexe, API instable</td>
              </tr>
              <tr>
                <td className="border border-gray-400 p-3 font-medium">Instagram</td>
                <td className="border border-gray-400 p-3">Limité (API via Facebook)</td>
                <td className="border border-gray-400 p-3">Données publiques seulement, RGPD applicable</td>
                <td className="border border-gray-400 p-3">Limitée aux comptes professionnels publics</td>
                <td className="border border-gray-400 p-3">Captions, likes, commentaires</td>
                <td className="border border-gray-400 p-3">Accès restreint, authentification obligatoire, pas de scraping</td>
              </tr>
              <tr>
                <td className="border border-gray-400 p-3 font-medium">TikTok</td>
                <td className="border border-gray-400 p-3">Très limité (API officielle)</td>
                <td className="border border-gray-400 p-3">Profilage interdit, RGPD applicable</td>
                <td className="border border-gray-400 p-3">Couverture restreinte, extension difficile</td>
                <td className="border border-gray-400 p-3">Vidéos publiques, captions, commentaires</td>
                <td className="border border-gray-400 p-3">API incomplète, scraping risqué et interdit</td>
              </tr>
              <tr>
                <td className="border border-gray-400 p-3 font-medium">YouTube</td>
                <td className="border border-gray-400 p-3">API stable (YouTube Data)</td>
                <td className="border border-gray-400 p-3">Usage des données publiques uniquement</td>
                <td className="border border-gray-400 p-3">Bonne couverture des vidéos, chaînes, playlists</td>
                <td className="border border-gray-400 p-3">Titres, descriptions, vues, commentaires</td>
                <td className="border border-gray-400 p-3">Quotas journaliers, besoin de filtrage pour les commentaires</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-end mt-auto">
          <div className="flex space-x-4">
            <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center font-bold">PNUD</div>
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 text-white flex items-center justify-center">Y</div>
            <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center">O</div>
          </div>
          <div className="text-4xl font-bold text-blue-600">4</div>
        </div>
      </div>

      {/* Contenu dynamique */}
      {content && (
        <div className="page-break">
          {content}
        </div>
      )}
    </div>
  );
};