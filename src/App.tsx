
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import PortalSelection from "./pages/PortalSelection";
import MoodBoard from "./pages/MoodBoard";
import Milestones from "./pages/Milestones";
import ManagerDashboard from "./pages/manager/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Navigation />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<PortalSelection />} />
            <Route path="/artist">
              <Route path="moodboard" element={<MoodBoard />} />
              <Route path="milestones" element={<Milestones />} />
              <Route index element={<Navigate to="/artist/milestones" replace />} />
            </Route>
            <Route path="/manager" element={<ManagerDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
