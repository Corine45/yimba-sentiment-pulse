
import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { HeroSection } from "@/components/landing/HeroSection";
import { TestProfiles } from "@/components/landing/TestProfiles";
import { LandingFooter } from "@/components/landing/LandingFooter";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleQuickLogin = (profile: any) => {
    setUser(profile);
    setIsAuthenticated(true);
  };

  if (isAuthenticated) {
    return <Dashboard user={user} onLogout={() => setIsAuthenticated(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <HeroSection />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Hero Text (now empty since moved to HeroSection) */}
          <div className="space-y-8">
            {/* This space is intentionally left for future content */}
          </div>

          {/* Right Column - Login and Test Profiles */}
          <div className="lg:pl-8 space-y-6">
            {/* Login Form */}
            <LoginForm 
              onLogin={(userData) => {
                setUser(userData);
                setIsAuthenticated(true);
              }} 
            />

            {/* Test Profiles */}
            <TestProfiles onQuickLogin={handleQuickLogin} />
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
};

export default Index;
