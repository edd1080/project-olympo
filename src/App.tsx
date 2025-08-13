
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AppStateProvider } from "@/context/AppStateContext";
import { UserProvider } from "@/context/UserContext";
import { InvestigationProvider } from "@/context/InvestigationContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import React, { useState } from "react";

// PWA Components
import SplashScreen from "@/components/pwa/SplashScreen";
import UpdatePrompt from "@/components/pwa/UpdatePrompt";
import { usePWA } from "@/hooks/usePWA";

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
import InvestigationFlow from "./pages/invc/InvestigationFlow";

// Manager Pages
import INVC from "./pages/manager/INVC";
import Authorizations from "./pages/manager/Authorizations";
import ManagerAlerts from "./pages/manager/ManagerAlerts";
import ManagerSettings from "./pages/manager/ManagerSettings";

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
        <UserProvider>
          <InvestigationProvider>
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
              <BrowserRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  
                  {/* Agent Routes */}
                  <Route path="/" element={
                    <ProtectedRoute requiredRole="agent">
                      <Index />
                    </ProtectedRoute>
                  } />
                  <Route path="/applications" element={
                    <ProtectedRoute requiredRole="agent">
                      <Applications />
                    </ProtectedRoute>
                  } />
                  <Route path="/applications/new" element={
                    <ProtectedRoute requiredRole="agent">
                      <RequestForm />
                    </ProtectedRoute>
                  } />
                  <Route path="/applications/oficial/new" element={
                    <ProtectedRoute requiredRole="agent">
                      <RequestFormOficial />
                    </ProtectedRoute>
                  } />
                  <Route path="/applications/exceptions" element={
                    <ProtectedRoute requiredRole="agent">
                      <ApplicationExceptions />
                    </ProtectedRoute>
                  } />
                  <Route path="/identity-verification" element={
                    <ProtectedRoute requiredRole="agent">
                      <IdentityVerification />
                    </ProtectedRoute>
                  } />
                  <Route path="/applications/:id" element={
                    <ProtectedRoute>
                      <ApplicationDetails />
                    </ProtectedRoute>
                  } />
                  <Route path="/applications/:id/invc" element={
                    <ProtectedRoute>
                      <InvestigationFlow />
                    </ProtectedRoute>
                  } />
                  <Route path="/applications/:id/edit" element={
                    <ProtectedRoute requiredRole="agent">
                      <RequestFormOficial />
                    </ProtectedRoute>
                  } />
                  <Route path="/applications/:id/guarantors/new" element={
                    <ProtectedRoute requiredRole="agent">
                      <RequestForm />
                    </ProtectedRoute>
                  } />
                  <Route path="/applications/:id/guarantors/:guarantorId" element={
                    <ProtectedRoute>
                      <ApplicationDetails />
                    </ProtectedRoute>
                  } />
                  <Route path="/applications/:id/guarantors/:guarantorId/edit" element={
                    <ProtectedRoute requiredRole="agent">
                      <RequestForm />
                    </ProtectedRoute>
                  } />
                  <Route path="/alerts" element={
                    <ProtectedRoute requiredRole="agent">
                      <Alerts />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute requiredRole="agent">
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings/personal-info" element={
                    <ProtectedRoute requiredRole="agent">
                      <PersonalInfo />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings/change-password" element={
                    <ProtectedRoute requiredRole="agent">
                      <ChangePassword />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings/report-problem" element={
                    <ProtectedRoute requiredRole="agent">
                      <ReportProblem />
                    </ProtectedRoute>
                  } />

                  {/* Manager Routes */}
                  <Route path="/manager/invc" element={
                    <ProtectedRoute requiredRole="manager">
                      <INVC />
                    </ProtectedRoute>
                  } />
                  <Route path="/manager/authorizations" element={
                    <ProtectedRoute requiredRole="manager">
                      <Authorizations />
                    </ProtectedRoute>
                  } />
                  <Route path="/manager/alerts" element={
                    <ProtectedRoute requiredRole="manager">
                      <ManagerAlerts />
                    </ProtectedRoute>
                  } />
                  <Route path="/manager/settings" element={
                    <ProtectedRoute requiredRole="manager">
                      <ManagerSettings />
                    </ProtectedRoute>
                  } />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            )}
            </TooltipProvider>
            </AppStateProvider>
          </InvestigationProvider>
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
