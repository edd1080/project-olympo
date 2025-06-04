
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import React from "react";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
// import Prospects from "./pages/Prospects";
import Applications from "./pages/Applications";
import Settings from "./pages/Settings";
// Alerts route commented out but preserved for future use
// import Alerts from "./pages/Alerts";
import NotFound from "./pages/NotFound";
// import ProspectDetails from "./pages/ProspectDetails";
import RequestForm from "./pages/RequestForm";
import ApplicationDetails from "./pages/ApplicationDetails";
import Prequalifications from "./pages/Prequalifications";
import PersonalInfo from "./pages/PersonalInfo";
import ChangePassword from "./pages/ChangePassword";
import ReportProblem from "./pages/ReportProblem";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              {/* <Route path="/prospects" element={<Prospects />} />
              <Route path="/prospect/:id" element={<ProspectDetails />} /> */}
              <Route path="/applications" element={<Applications />} />
              <Route path="/applications/new" element={<RequestForm />} />
              <Route path="/applications/:id" element={<ApplicationDetails />} />
              <Route path="/applications/:id/edit" element={<RequestForm />} />
              <Route path="/applications/:id/guarantors/new" element={<RequestForm />} />
              <Route path="/applications/:id/guarantors/:guarantorId" element={<ApplicationDetails />} />
              <Route path="/applications/:id/guarantors/:guarantorId/edit" element={<RequestForm />} />
              <Route path="/prequalifications" element={<Prequalifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/personal-info" element={<PersonalInfo />} />
              <Route path="/settings/change-password" element={<ChangePassword />} />
              <Route path="/settings/report-problem" element={<ReportProblem />} />
              {/* Alerts route commented out but preserved for future use
              <Route path="/alerts" element={<Alerts />} />
              */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
