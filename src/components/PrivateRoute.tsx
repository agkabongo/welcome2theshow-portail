
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

type PrivateRouteProps = {
  role?: 'artist' | 'manager';
};

const PrivateRoute = ({ role }: PrivateRouteProps) => {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();

  // Display loading state during initial load
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 space-y-4">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-40 mx-auto" />
          <div className="text-muted-foreground text-sm text-center mt-2">Chargement de votre profil...</div>
        </div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    // Show toast only once per session
    const toastId = "auth-required";
    if (location.pathname !== "/auth/login") {
      toast.error("Vous devez être connecté pour accéder à cette page", { id: toastId });
    }
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  // Special case: user is authenticated but profile is not loaded yet
  if (user && !profile) {
    console.log('User is authenticated but profile is not loaded');
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Chargement de votre profil</h2>
          <p className="text-muted-foreground mt-2">Veuillez patienter pendant le chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  // Check role if specified
  if (role && profile && profile.role !== role) {
    const toastId = "role-required";
    toast.error(`Accès réservé aux ${role === 'artist' ? 'artistes' : 'managers'}`, { id: toastId });
    
    // Redirect to the appropriate home page based on user role
    if (profile.role === 'artist') {
      return <Navigate to="/artist/milestones" replace />;
    } else if (profile.role === 'manager') {
      return <Navigate to="/manager" replace />;
    }
    
    // Fallback to homepage
    return <Navigate to="/" replace />;
  }

  // All checks passed, render the protected route
  return <Outlet />;
};

export default PrivateRoute;
