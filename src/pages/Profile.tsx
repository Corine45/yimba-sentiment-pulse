
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PersonalInfoCard } from "@/components/profile/PersonalInfoCard";
import { SecurityCard } from "@/components/profile/SecurityCard";
import { RolePermissionsCard } from "@/components/profile/RolePermissionsCard";

const Profile = () => {
  const { user } = useAuth();
  const { profile, loading, refetch } = useProfile();

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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <ProfileHeader />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PersonalInfoCard 
                profile={profile} 
                user={user} 
                onRefetch={refetch} 
              />
              <SecurityCard />
            </div>

            <div>
              <RolePermissionsCard role={profile.role} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
