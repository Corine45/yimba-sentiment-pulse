
interface ApifyTokenConfigProps {
  apifyToken: string;
  onTokenChange: (token: string) => void;
  userRole: string;
}

export const ApifyTokenConfig = ({ apifyToken, onTokenChange, userRole }: ApifyTokenConfigProps) => {
  // Les observateurs ne peuvent pas configurer le token Apify
  if (userRole === "observateur") {
    return null;
  }

  // Masquer la clé API pour la sécurité
  const maskedToken = apifyToken ? `${apifyToken.substring(0, 8)}...${apifyToken.substring(apifyToken.length - 4)}` : '';

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Token Apify</label>
      <input
        type="password"
        placeholder="Entrez votre token Apify"
        value={apifyToken}
        onChange={(e) => onTokenChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="text-xs text-gray-500">
        Token Apify sécurisé pour accéder aux APIs de scraping
      </p>
      {apifyToken && (
        <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
          ✅ Token configuré : {maskedToken}
        </div>
      )}
    </div>
  );
};
