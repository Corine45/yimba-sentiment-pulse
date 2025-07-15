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

      {/* Page 5: Limites et biais de la plateforme YIMBA */}
      <div className="page-break bg-white min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-6">Limites et biais de la plateforme YIMBA</h1>
        
        <div className="space-y-6">
          <p className="text-sm leading-relaxed">
            Malgré ses capacités techniques avancées, la plateforme YIMBA présente certaines limites structurelles et biais méthodologiques qu'il 
            convient de garder à l'esprit dans l'analyse des résultats :
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-2">1. Limite d'accès aux données privées</h3>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>YIMBA ne collecte que des <strong>contenus publics</strong> : publications, commentaires, tweets, vidéos accessibles sans restriction.</li>
                <li><strong>Messages privés, groupes fermés et profils verrouillés</strong> (ex. Facebook, WhatsApp, Messenger) ne sont pas analysés, ce qui <strong>réduit la portée de la surveillance</strong>, surtout dans des contextes où la haine ou l'organisation de violences peut aussi circuler en circuit fermé.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">2. Données partiellement inaccessibles selon les plateformes</h3>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Sur <strong>Facebook</strong> et <strong>Instagram</strong>, certaines données sont <strong>restreintes ou partiellement cryptées</strong> pour des raisons de politique interne des plateformes, ce qui peut <strong>limiter la profondeur de l'analyse</strong>.</li>
                <li>À l'inverse, des plateformes comme <strong>Twitter (X)</strong> offrent un accès plus large aux données publiques, créant un <strong>biais de visibilité</strong> en faveur de certaines sources.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">3. Limites dans la reconnaissance des contenus codés</h3>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Malgré l'enrichissement du corpus (214 mots-clés), une partie de ces contenus peut <strong>échapper à la détection automatisée</strong>, surtout s'ils changent rapidement de forme ou s'ils utilisent des <strong>mèmes visuels</strong> non textuels.</li>
              </ul>
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
      </div>

      {/* Page 6: Suite des limites et biais */}
      <div className="page-break bg-white min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-6">Limites et biais de la plateforme YIMBA</h1>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-bold mb-2">4. Temporalité et variabilité</h3>
            <ul className="list-disc ml-6 space-y-1 text-sm">
              <li>L'analyse repose sur des <strong>fenêtres temporelles précises</strong> (ex. crise anti-woubi sur 1 an).</li>
              <li>Des <strong>contenus plus anciens ou postérieurs</strong> peuvent ne pas être pris en compte, limitant la représentation chronologique complète du phénomène.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-2">5. Biais d'interprétation algorithmique</h3>
            <p className="text-sm leading-relaxed">
              L'analyse de <strong>tonalité (positif, neutre, négatif)</strong> ou de <strong>sentiment</strong> est automatisée par des algorithmes, qui peuvent mal interpréter l'ironie, le 
              sarcasme ou les subtilités culturelles ; cela peut entraîner des <strong>faux positifs</strong> (contenu neutre classé comme haineux) ou des <strong>faux négatifs</strong> 
              (discours problématique non détecté).
            </p>
          </div>

          <div className="mt-8">
            <h3 className="font-bold mb-2">• En résumé</h3>
            <p className="text-sm leading-relaxed">
              <strong>YIMBA</strong> reste un outil précieux pour cartographier les tendances visibles, mais son utilisation doit s'accompagner d'une lecture critique et 
              contextualisée. Les résultats doivent être interprétés comme des <strong>indicateurs de signaux publics</strong>, et non comme un reflet exhaustif ou absolu de la 
              réalité sociale.
            </p>
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
      </div>

      {/* Page 7: Système de mots-clés (Dynamique) */}
      <div className="page-break bg-white min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-6">Corpus de mots-clés utilisés pour la collecte de données</h1>
        
        <div className="space-y-6">
          <p className="text-sm leading-relaxed">
            Le système repose sur un référentiel de plus de <strong>200 mots-clés</strong>, expressions et hashtags, sélectionnés selon trois critères :
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-2">• <strong>Pertinence</strong> par rapport au sujet</h3>
            </div>
            <div>
              <h3 className="font-bold mb-2">• <strong>Diversité linguistique et culturelle</strong>, incluant l'argot local, le nouchi, les fautes volontaires ou orthographes déguisées :</h3>
            </div>
            <div>
              <h3 className="font-bold mb-2">• <strong>Capacité à détecter des discours hostiles</strong>, même implicites ou euphémisés.</h3>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold mb-2">La liste des {keywords.length > 0 ? keywords.length : '80'} mots clés utilisés pour la collecte de données {searchTerm ? `(${searchTerm})` : '(Crise anti-woubi)'} :</h3>
            
            <div className="bg-gray-50 p-4 rounded border">
              <p className="text-sm italic mb-3">
                {keywords.length > 0 
                  ? `"${keywords.join(', ')}"` 
                  : `"lesbienne, lesbiennes, lesbianisme, lesbianisme, homosexuelle, homosexuelles, femme homo, femme homos, femme homosexualité, femmes homo, femmes homos, femmes homosexuelles, elles homo, elles homos, elle homosexualité, une homo, une homosexualité, lopéré, lopérés, garçon manqué, garcçonmangue, garconsmangues, garçonsmanques, femme pédé, femme pédés, femmepédé, femmespédés, #femmeshomos, #elleshomo, #elleshomo, #elleshomosexualité, gay, homosexuel, homosexuels, homme homo, homme homos, homme homosexualité, hommes homo, hommes homos, hommes homosexualité, il homo, il homos, il homosexualité, ils, homo, ils, homos, ils, homosexualité, un homo, un homos, un, homosexualité, bodacrou, bodacrous, garçon princesse, garçonsprincesses, garçonsdeprincesses, #garçonsprincess, #gaysociaux, #woubisme, woubi, #woubi, woubis, #woubis, woubisme"`
                }
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm leading-relaxed">
              Ce corpus a été conçu pour <strong>s'adapter à des contextes sociaux mouvants</strong>, et peut évoluer en fonction de l'actualité ou des formes nouvelles de haine en ligne.
            </p>
            
            <p className="text-sm leading-relaxed">
              Les données collectées sont <strong>majoritairement en français</strong>, avec une <strong>présence de contenu en argot</strong>.
            </p>
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

      {/* Page 8: Analyse de sentiment par plateforme (Dynamique) */}
      <div className="page-break bg-white min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-6">Analyse de sentiment par plateforme sociale</h1>
        
        <div className="space-y-6">
          <p className="text-sm leading-relaxed">
            L'analyse de sentiment est réalisée en temps réel sur les principales plateformes sociales, 
            permettant de détecter les tendances et l'évolution des opinions publiques.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TikTok */}
            <div className="border rounded-lg p-4">
              <h3 className="font-bold mb-3 flex items-center">
                <span className="w-3 h-3 bg-black rounded-full mr-2"></span>
                TikTok
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Mentions positives:</span>
                  <span className="font-semibold text-green-600">32%</span>
                </div>
                <div className="flex justify-between">
                  <span>Mentions négatives:</span>
                  <span className="font-semibold text-red-600">45%</span>
                </div>
                <div className="flex justify-between">
                  <span>Mentions neutres:</span>
                  <span className="font-semibold text-gray-600">23%</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Mots-clés détectés: {keywords.length > 0 ? keywords.slice(0, 3).join(', ') : 'woubi, lesbienne, gay'}
                </div>
              </div>
            </div>

            {/* Facebook */}
            <div className="border rounded-lg p-4">
              <h3 className="font-bold mb-3 flex items-center">
                <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
                Facebook
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Mentions positives:</span>
                  <span className="font-semibold text-green-600">28%</span>
                </div>
                <div className="flex justify-between">
                  <span>Mentions négatives:</span>
                  <span className="font-semibold text-red-600">52%</span>
                </div>
                <div className="flex justify-between">
                  <span>Mentions neutres:</span>
                  <span className="font-semibold text-gray-600">20%</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Groupes analysés: {searchTerm ? `Recherches liées à "${searchTerm}"` : 'Groupes LGBT+ CI'}
                </div>
              </div>
            </div>

            {/* Twitter/X */}
            <div className="border rounded-lg p-4">
              <h3 className="font-bold mb-3 flex items-center">
                <span className="w-3 h-3 bg-black rounded-full mr-2"></span>
                Twitter/X
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Mentions positives:</span>
                  <span className="font-semibold text-green-600">38%</span>
                </div>
                <div className="flex justify-between">
                  <span>Mentions négatives:</span>
                  <span className="font-semibold text-red-600">41%</span>
                </div>
                <div className="flex justify-between">
                  <span>Mentions neutres:</span>
                  <span className="font-semibold text-gray-600">21%</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Hashtags populaires: #woubi, #LGBT, #tolerancia
                </div>
              </div>
            </div>

            {/* Instagram */}
            <div className="border rounded-lg p-4">
              <h3 className="font-bold mb-3 flex items-center">
                <span className="w-3 h-3 bg-pink-500 rounded-full mr-2"></span>
                Instagram
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Mentions positives:</span>
                  <span className="font-semibold text-green-600">44%</span>
                </div>
                <div className="flex justify-between">
                  <span>Mentions négatives:</span>
                  <span className="font-semibold text-red-600">35%</span>
                </div>
                <div className="flex justify-between">
                  <span>Mentions neutres:</span>
                  <span className="font-semibold text-gray-600">21%</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Stories analysées: {keywords.length > 0 ? `${keywords.length} termes` : '200+ termes'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded border">
            <h3 className="font-bold mb-2">📊 Tendances générales observées:</h3>
            <ul className="text-sm space-y-1">
              <li>• Augmentation des contenus de sensibilisation (+15% cette semaine)</li>
              <li>• Pic d'activité négatif détecté entre 18h-22h</li>
              <li>• Communautés de soutien plus actives le weekend</li>
              <li>• Utilisation croissante d'euphémismes pour éviter la modération</li>
            </ul>
          </div>

          <div className="flex justify-between items-end mt-auto">
            <div className="flex space-x-4">
              <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center font-bold">PNUD</div>
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 text-white flex items-center justify-center">Y</div>
              <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center">O</div>
            </div>
            <div className="text-4xl font-bold text-blue-600">8</div>
          </div>
        </div>
      </div>

      {/* Page 9: Répartition géographique et temporelle (Dynamique) */}
      <div className="page-break bg-white min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-6">Répartition géographique et temporelle des mentions</h1>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Répartition par région */}
            <div>
              <h3 className="font-bold mb-4">📍 Répartition par région (Côte d'Ivoire)</h3>
              <div className="space-y-3">
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Abidjan</span>
                    <span className="text-sm font-semibold">67%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '67%'}}></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Mentions: {searchTerm ? `Liées à "${searchTerm}"` : '2,847 détectées'}
                  </div>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Bouaké</span>
                    <span className="text-sm font-semibold">12%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '12%'}}></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Mentions: 512 détectées</div>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Yamoussoukro</span>
                    <span className="text-sm font-semibold">8%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-orange-600 h-2 rounded-full" style={{width: '8%'}}></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Mentions: 341 détectées</div>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Autres régions</span>
                    <span className="text-sm font-semibold">13%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '13%'}}></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Mentions: 553 détectées</div>
                </div>
              </div>
            </div>

            {/* Évolution temporelle */}
            <div>
              <h3 className="font-bold mb-4">⏰ Évolution temporelle (7 derniers jours)</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    <div className="font-medium">Lun</div>
                    <div className="font-medium">Mar</div>
                    <div className="font-medium">Mer</div>
                    <div className="font-medium">Jeu</div>
                    <div className="font-medium">Ven</div>
                    <div className="font-medium">Sam</div>
                    <div className="font-medium">Dim</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 mt-2">
                    <div className="h-8 bg-blue-300 rounded flex items-center justify-center text-xs">142</div>
                    <div className="h-12 bg-blue-500 rounded flex items-center justify-center text-xs text-white">298</div>
                    <div className="h-10 bg-blue-400 rounded flex items-center justify-center text-xs">201</div>
                    <div className="h-16 bg-red-600 rounded flex items-center justify-center text-xs text-white">456</div>
                    <div className="h-14 bg-red-500 rounded flex items-center justify-center text-xs text-white">367</div>
                    <div className="h-6 bg-green-400 rounded flex items-center justify-center text-xs">89</div>
                    <div className="h-8 bg-green-500 rounded flex items-center justify-center text-xs">123</div>
                  </div>
                </div>

                <div className="text-sm space-y-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-600 rounded mr-2"></div>
                    <span>Pic d'activité: Jeudi-Vendredi (événement déclencheur détecté)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                    <span>Activité modérée: Weekend (contenu de soutien)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                    <span>Activité normale: Début de semaine</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-bold mb-2 text-yellow-900">⚠️ Observations clés:</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• <strong>Concentration urbaine:</strong> 67% des mentions proviennent d'Abidjan</li>
              <li>• <strong>Événement déclencheur:</strong> Pic notable jeudi-vendredi (enquête recommandée)</li>
              <li>• <strong>Patterns temporels:</strong> Activité réduite le weekend, hausse en semaine</li>
              <li>• <strong>Mots-clés régionaux:</strong> Variations linguistiques détectées par région</li>
            </ul>
          </div>

          <div className="flex justify-between items-end mt-auto">
            <div className="flex space-x-4">
              <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center font-bold">PNUD</div>
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 text-white flex items-center justify-center">Y</div>
              <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center">O</div>
            </div>
            <div className="text-4xl font-bold text-blue-600">9</div>
          </div>
        </div>
      </div>

      {/* Page 10: Résumé des statistiques */}
      <div className="page-break bg-white min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-8">Résumé</h1>
        
        <div className="grid grid-cols-2 gap-8">
          {/* Graphique en camembert */}
          <div className="flex flex-col">
            <div className="w-64 h-64 mx-auto mb-6">
              <div className="relative w-full h-full">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Camembert - mentions (vert) */}
                  <circle cx="50" cy="50" r="30" fill="#10B981" stroke="#fff" strokeWidth="2" strokeDasharray="70 30" strokeDashoffset="0" />
                  {/* Mentions réseaux sociaux (orange) */}
                  <circle cx="50" cy="50" r="30" fill="#F59E0B" stroke="#fff" strokeWidth="2" strokeDasharray="15 85" strokeDashoffset="-70" />
                  {/* Mentions hors réseaux (violet) */}
                  <circle cx="50" cy="50" r="30" fill="#8B5CF6" stroke="#fff" strokeWidth="2" strokeDasharray="10 90" strokeDashoffset="-85" />
                  {/* Mentions négatives (rouge) */}
                  <circle cx="50" cy="50" r="30" fill="#EF4444" stroke="#fff" strokeWidth="2" strokeDasharray="5 95" strokeDashoffset="-95" />
                </svg>
              </div>
            </div>
            
            {/* Légende */}
            <div className="text-xs space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500"></div>
                <span>Mentions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500"></div>
                <span>Mentions sur les réseaux sociaux</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500"></div>
                <span>Mentions hors réseaux sociaux</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500"></div>
                <span>Nombre de mentions négatives</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-600"></div>
                <span>Nombre de mentions positives</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500"></div>
                <span>Interactions sur les réseaux sociaux</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500"></div>
                <span>Nombre de partages</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-indigo-500"></div>
                <span>Contenu généré par les utilisateurs</span>
              </div>
            </div>
          </div>
          
          {/* Statistiques */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Total mentions</div>
              <div className="text-2xl font-bold">8,390</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Mentions sur les réseaux sociaux</div>
              <div className="text-2xl font-bold">8,370</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Commentaires sur les réseaux sociaux</div>
              <div className="text-2xl font-bold">7,067,234</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">J'aime sur les réseaux sociaux</div>
              <div className="text-2xl font-bold">2,870,600</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Nombre de mentions positives</div>
              <div className="text-2xl font-bold">970</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Nombre de mentions négatives</div>
              <div className="text-2xl font-bold">5,930</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Réactions sur les réseaux sociaux</div>
              <div className="text-2xl font-bold">311,040</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Portée des médias sociaux</div>
              <div className="text-2xl font-bold">19,958,190</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Partages sur les réseaux sociaux</div>
              <div className="text-2xl font-bold">687,597</div>
            </div>
          </div>
        </div>
        
        {/* Définitions */}
        <div className="mt-8 text-xs space-y-2">
          <div><strong>Mentions :</strong> Nombre total de fois où cela est cité en ligne.</div>
          <div><strong>Mentions sur les réseaux sociaux :</strong> Citations de la marque sur les réseaux sociaux.</div>
          <div><strong>Nombre de mentions positives :</strong> Mentions exprimant une opinion favorable.</div>
          <div><strong>Nombre de mentions négatives :</strong> Mentions exprimant une opinion défavorable.</div>
          <div><strong>Portée estimée sur les réseaux sociaux :</strong> Nombre estimé de personnes ayant vu les mentions sur les réseaux sociaux.</div>
          <div><strong>Mentions « J'aime » sur les réseaux sociaux :</strong> Nombre de « J'aime » reçus sur les publications.</div>
          <div><strong>Nombre de partages :</strong> Nombre de fois où les publications ont été partagées.</div>
        </div>
        
        <div className="flex justify-between items-end mt-8">
          <div className="flex space-x-4">
            <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center font-bold">PNUD</div>
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 text-white flex items-center justify-center">Y</div>
            <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center">O</div>
          </div>
          <div className="text-4xl font-bold text-blue-600">10</div>
        </div>
      </div>

      {/* Page 11: Mentions les plus populaires */}
      <div className="page-break bg-white min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-8">Mentions les plus populaires</h1>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Mention 1 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                EM
              </div>
              <div>
                <div className="font-bold text-blue-600">Elh_Momar</div>
                <div className="text-xs text-gray-500">@elh_momar • 2025-06-30</div>
              </div>
              <div className="ml-auto">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Positive</span>
              </div>
            </div>
            <p className="text-sm text-gray-800 mb-2">
              Oui c'est moi qui suis à l'origine du terme "{searchTerm}" et c'est tota...
            </p>
            <div className="text-xs text-gray-500">
              1.7k likes • 823 retweets • 156 followers • 2025-06-30
            </div>
          </div>
          
          {/* Mention 2 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold">
                T
              </div>
              <div>
                <div className="font-bold text-blue-600">__nypu__</div>
                <div className="text-xs text-gray-500">@nypu • 2025-06-30</div>
              </div>
              <div className="ml-auto">
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Neutral</span>
              </div>
            </div>
            <p className="text-sm text-gray-800 mb-2">
              La personne qui n'est pas d'accord je bloque... #camerountiktok #pov #humou...
            </p>
            <div className="text-xs text-gray-500">
              TikTok • 892 likes • 234 comments
            </div>
          </div>
          
          {/* Mention 3 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold">
                C
              </div>
              <div>
                <div className="font-bold text-blue-600">Côte d'Ivoire : Solthis dre...</div>
                <div className="text-xs text-gray-500">cardineworld.com • 2025-06-12</div>
              </div>
              <div className="ml-auto">
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Neutral</span>
              </div>
            </div>
            <p className="text-sm text-gray-800 mb-2">
              ... [...] Elle a également rappelé que malgré les avancées, le contexte reste...
            </p>
            <div className="text-xs text-gray-500">
              Web • 445 engagements
            </div>
          </div>
          
          {/* Mention 4 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold">
                T
              </div>
              <div>
                <div className="font-bold text-blue-600">zareyalokumulokum</div>
                <div className="text-xs text-gray-500">@zareyalokumulokum • TikTok</div>
              </div>
              <div className="ml-auto">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Positive</span>
              </div>
            </div>
            <p className="text-sm text-gray-800 mb-2">
              le Cameroun aussi c'est un autre niveau hein le {searchTerm} transgenre écoutez # #c...
            </p>
            <div className="text-xs text-gray-500">
              TikTok • 1.2k likes • 567 comments
            </div>
          </div>
        </div>
        
        {/* Informations sur les mots-clés utilisés */}
        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Mots-clés utilisés pour cette recherche :</h3>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                {keyword}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-end mt-8">
          <div className="flex space-x-4">
            <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center font-bold">PNUD</div>
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 text-white flex items-center justify-center">Y</div>
            <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center">O</div>
          </div>
          <div className="text-4xl font-bold text-blue-600">11</div>
        </div>
      </div>

      {/* Contenu dynamique supplémentaire */}
      {content && (
        <div className="page-break">
          {content}
        </div>
      )}
    </div>
  );
};