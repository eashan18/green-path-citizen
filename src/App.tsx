import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import CitizenDashboard from "./pages/CitizenDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import CommitteeDashboard from "./pages/CommitteeDashboard";
import ULBDashboard from "./pages/ULBDashboard";
import ReportWaste from "./pages/ReportWaste";
import Training from "./pages/Training";
import VoiceChat from "./pages/VoiceChat";
import NotFound from "./pages/NotFound";
import ManageWorkers from "./pages/ManageWorkers";
import Tasks from "./pages/Tasks";
import RoutesPage from "./pages/Routes";
import Vehicle from "./pages/Vehicle";
import Rewards from "./pages/Rewards";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
            <Route path="/worker-dashboard" element={<WorkerDashboard />} />
            <Route path="/committee-dashboard" element={<CommitteeDashboard />} />
            <Route path="/ulb-dashboard" element={<ULBDashboard />} />
            <Route path="/report-waste" element={<ReportWaste />} />
            <Route path="/training" element={<Training />} />
            <Route path="/voice-chat" element={<VoiceChat />} />
            <Route path="/manage-workers" element={<ManageWorkers />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/vehicle" element={<Vehicle />} />
            <Route path="/rewards" element={<Rewards />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
