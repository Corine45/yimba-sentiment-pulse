
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getRoleBadgeColor, getRoleLabel } from "@/components/dashboard/utils/dashboardUtils";
import { User, Settings, Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const { profile, loading, refetch } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          email: formData.email,
        })
        .eq('id', user.id);

      if (error) throw error;

      await refetch();
      setIsEditing(false);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
      
      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été mis à jour avec succès.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de changer le mot de passe",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
              <p className="text-gray-600">Gérez vos informations personnelles et paramètres</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informations du profil */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Informations personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nom complet</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{profile.name}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{profile.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {isEditing ? (
                      <>
                        <Button onClick={handleSaveProfile} disabled={saving}>
                          {saving ? "Sauvegarde..." : "Sauvegarder"}
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Annuler
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => {
                        setIsEditing(true);
                        setFormData({
                          name: profile.name,
                          email: profile.email,
                        });
                      }}>
                        Modifier
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Changement de mot de passe */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!isChangingPassword ? (
                    <Button onClick={() => setIsChangingPassword(true)}>
                      Changer le mot de passe
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={handleChangePassword} disabled={saving}>
                          {saving ? "Modification..." : "Modifier le mot de passe"}
                        </Button>
                        <Button variant="outline" onClick={() => setIsChangingPassword(false)}>
                          Annuler
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Informations sur le rôle */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Rôle et permissions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Rôle actuel</Label>
                    <div className="mt-2">
                      <Badge className={getRoleBadgeColor(profile.role)}>
                        {getRoleLabel(profile.role)}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">Permissions :</p>
                    <ul className="space-y-1">
                      {profile.role === 'admin' && (
                        <>
                          <li>✓ Accès complet à toutes les fonctionnalités</li>
                          <li>✓ Gestion des utilisateurs</li>
                          <li>✓ Configuration de la plateforme</li>
                        </>
                      )}
                      {profile.role === 'analyste' && (
                        <>
                          <li>✓ Recherches avancées</li>
                          <li>✓ Analyse des sentiments</li>
                          <li>✓ Génération de rapports</li>
                          <li>✗ Gestion des utilisateurs</li>
                        </>
                      )}
                      {profile.role === 'observateur' && (
                        <>
                          <li>✓ Consultation des données</li>
                          <li>✓ Recherches simples</li>
                          <li>✗ Analyse avancée</li>
                          <li>✗ Génération de rapports</li>
                        </>
                      )}
                    </ul>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Note :</strong> Seuls les administrateurs peuvent modifier les rôles des utilisateurs.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
