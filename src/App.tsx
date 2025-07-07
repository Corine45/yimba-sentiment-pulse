
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SimpleAuthProvider } from "@/hooks/useSimpleAuth";
import Home from "./pages/Home";
import About from "./pages/About";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import AnalystWorkspace from "./pages/AnalystWorkspace";
import Profile from "./pages/Profile";
import StatusOverview from "./pages/StatusOverview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SimpleAuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Routes principales - gestion d'auth dans Index */}
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/status" element={<StatusOverview />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/analyst" element={<AnalystWorkspace />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SimpleAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
