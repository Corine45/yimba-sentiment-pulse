
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

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Token Apify</label>
      <input
        type="password"
        placeholder="Token configuré par défaut"
        value={apifyToken}
        onChange={(e) => onTokenChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="text-xs text-gray-500">
        Token Apify configuré pour accéder à l'API TikTok (clockworks/tiktok-scraper)
      </p>
      <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
        ✅ Token configuré : apify_api_JP5bjoQMQYYZ36blKD7yfm2gDRYNng3W7h69
      </div>
    </div>
  );
};
