
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { AuthProvider } from "./contexts/AuthContext";
import PortalSelection from "./pages/PortalSelection";
import MoodBoard from "./pages/MoodBoard";
import Milestones from "./pages/Milestones";
import ManagerDashboard from "./pages/manager/Dashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import PrivateRoute from "./components/PrivateRoute";
import MusicPage from "./pages/MusicPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Navigation />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<PortalSelection />} />
              
              <Route path="/auth">
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
              </Route>

              <Route path="/artist" element={<PrivateRoute role="artist" />}>
                <Route path="moodboard" element={<MoodBoard />} />
                <Route path="milestones" element={<Milestones />} />
                <Route path="music" element={<MusicPage />} />
                <Route index element={<Navigate to="/artist/milestones" replace />} />
              </Route>
              
              <Route path="/manager" element={<PrivateRoute role="manager" />}>
                <Route index element={<ManagerDashboard />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </AuthProvider>
      </BrowserRouter>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
