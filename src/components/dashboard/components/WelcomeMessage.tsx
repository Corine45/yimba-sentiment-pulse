
interface WelcomeMessageProps {
  user: any;
}

export const WelcomeMessage = ({ user }: WelcomeMessageProps) => {
  const getWelcomeText = (role: string) => {
    switch (role) {
      case "admin":
        return "Vous avez accès à toutes les fonctionnalités de la plateforme, y compris la gestion des utilisateurs et la configuration.";
      case "analyste":
        return "Vous pouvez créer des recherches avancées, générer des rapports et analyser les sentiments.";
      case "observateur":
        return "Vous pouvez consulter les rapports, effectuer des recherches simples et recevoir des alertes.";
      default:
        return "";
    }
  };

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
      <h2 className="text-lg font-semibold text-blue-900 mb-2">
        Bienvenue, {user.name}
      </h2>
      <p className="text-blue-700 text-sm">
        {getWelcomeText(user.role)}
      </p>
    </div>
  );
};
