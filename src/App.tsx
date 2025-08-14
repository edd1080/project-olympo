
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AppStateProvider } from "@/context/AppStateContext";
import React, { useState } from "react";

// PWA Components
import SplashScreen from "@/components/pwa/SplashScreen";
import UpdatePrompt from "@/components/pwa/UpdatePrompt";
import { usePWA } from "@/hooks/usePWA";

// Auth Components
import { AuthProvider } from "@/context/AuthContext";
import { ManagerOnlyGuard } from "@/components/auth/RoleGuard";

// Manager Pages
import ManagerIndex from "./pages/manager/ManagerIndex";
import INVCList from "./pages/manager/INVCList";
import INVCDetails from "./pages/manager/INVCDetails";
import Authorizations from "./pages/manager/Authorizations";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Applications from "./pages/Applications";
import Prospects from "./pages/Prospects";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import RequestForm from "./pages/RequestForm";
import RequestFormOficial from "./pages/RequestFormOficial";
import ApplicationExceptions from "./pages/ApplicationExceptions";
import IdentityVerification from "./pages/IdentityVerification";
import ApplicationDetails from "./pages/ApplicationDetails";
import Prequalifications from "./pages/Prequalifications";
import PersonalInfo from "./pages/PersonalInfo";
import ChangePassword from "./pages/ChangePassword";
import ReportProblem from "./pages/ReportProblem";
import ProspectDetails from "./pages/ProspectDetails";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  const { isLoading, updateAvailable, updateApp } = usePWA();
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  React.useEffect(() => {
    if (updateAvailable) {
      setShowUpdatePrompt(true);
    }
  }, [updateAvailable]);

  const handleUpdate = () => {
    updateApp();
    setShowUpdatePrompt(false);
  };

  const handleDismissUpdate = () => {
    setShowUpdatePrompt(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppStateProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                
                {/* PWA Splash Screen */}
                <SplashScreen isVisible={isLoading} />
                
                {/* PWA Update Prompt */}
                <UpdatePrompt 
                  isVisible={showUpdatePrompt}
                  onUpdate={handleUpdate}
                  onDismiss={handleDismissUpdate}
                />
                
                {/* Main App Content */}
                {!isLoading && (
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/applications" element={<Applications />} />
                    <Route path="/applications/new" element={<RequestForm />} />
                    <Route path="/applications/oficial/new" element={<RequestFormOficial />} />
                    <Route path="/applications/exceptions" element={<ApplicationExceptions />} />
                    <Route path="/identity-verification" element={<IdentityVerification />} />
                    <Route path="/applications/:id" element={<ApplicationDetails />} />
                    <Route path="/applications/:id/edit" element={<RequestFormOficial />} />
                    <Route path="/applications/:id/guarantors/new" element={<RequestForm />} />
                    <Route path="/applications/:id/guarantors/:guarantorId" element={<ApplicationDetails />} />
                    <Route path="/applications/:id/guarantors/:guarantorId/edit" element={<RequestForm />} />
                    <Route path="/alerts" element={<Alerts />} />
                    
                    {/* Manager Routes */}
                    <Route path="/manager" element={<ManagerOnlyGuard><ManagerIndex /></ManagerOnlyGuard>} />
                    <Route path="/manager/invc" element={<ManagerOnlyGuard><INVCList /></ManagerOnlyGuard>} />
                    <Route path="/manager/invc/:id" element={<ManagerOnlyGuard><INVCDetails /></ManagerOnlyGuard>} />
                    <Route path="/manager/authorizations" element={<ManagerOnlyGuard><Authorizations /></ManagerOnlyGuard>} />
                    
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/settings/personal-info" element={<PersonalInfo />} />
                    <Route path="/settings/change-password" element={<ChangePassword />} />
                    <Route path="/settings/report-problem" element={<ReportProblem />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                )}
              </TooltipProvider>
            </AppStateProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
