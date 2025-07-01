
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
      <label className="text-sm font-medium">Token Apify (optionnel)</label>
      <input
        type="password"
        placeholder="Votre token Apify pour les vraies données"
        value={apifyToken}
        onChange={(e) => onTokenChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="text-xs text-gray-500">
        Sans token, des données simulées seront utilisées
      </p>
    </div>
  );
};
