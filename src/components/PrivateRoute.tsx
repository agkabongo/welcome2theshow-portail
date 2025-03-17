
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef } from "react";

type PrivateRouteProps = {
  role?: 'artist' | 'manager';
};

const PrivateRoute = ({ role }: PrivateRouteProps) => {
  const { user, profile, isLoading, session } = useAuth();
  const location = useLocation();
  const toastShown = useRef(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadingTimeRef = useRef<number | null>(null);

  // Get user role from profile or session metadata as fallback
  const getUserRole = () => {
    if (profile?.role) {
      return profile.role;
    }
    
    // Fallback to metadata from session if profile is not loaded yet
    if (session?.user?.user_metadata?.role) {
      return session.user.user_metadata.role;
    }
    
    return null;
  };

  // Reset toast flag when location changes
  useEffect(() => {
    toastShown.current = false;
    
    // Set a timestamp when we start loading
    if (isLoading && loadingTimeRef.current === null) {
      loadingTimeRef.current = Date.now();
    }
    
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [location.pathname, isLoading]);
  
  // Set a timeout to force-proceed if loading takes too long
  useEffect(() => {
    if (isLoading && !loadingTimeoutRef.current) {
      loadingTimeoutRef.current = setTimeout(() => {
        console.log('Loading timeout reached, force proceeding');
        
        if (!user && !toastShown.current) {
          toast.error("Impossible de charger votre profil. Veuillez vous reconnecter.", { id: "loading-timeout" });
          toastShown.current = true;
        }
      }, 5000); // 5 seconds timeout
    }
    
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, [isLoading, user]);

  // Log loading state for debugging
  console.log('PrivateRoute:', { 
    isLoading, 
    user: user?.id, 
    profile: profile?.role,
    sessionRole: session?.user?.user_metadata?.role,
    requiredRole: role,
    loadingTime: loadingTimeRef.current ? (Date.now() - loadingTimeRef.current) : 0
  });

  // Display loading state during initial load (for a reasonable time)
  if (isLoading && (loadingTimeRef.current === null || Date.now() - loadingTimeRef.current < 5000)) {
    console.log('PrivateRoute: Loading state');
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
    console.log('PrivateRoute: No user, redirecting to login');
    if (!toastShown.current) {
      toast.error("Vous devez être connecté pour accéder à cette page", { id: "auth-required" });
      toastShown.current = true;
    }
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  // Use user role from profile or session metadata
  const userRole = getUserRole();

  // Check role if specified
  if (role && userRole && userRole !== role) {
    console.log(`PrivateRoute: User has role ${userRole}, but ${role} is required`);
    if (!toastShown.current) {
      toast.error(`Accès réservé aux ${role === 'artist' ? 'artistes' : 'managers'}`, { id: "role-required" });
      toastShown.current = true;
    }
    
    // Redirect to the appropriate home page based on user role
    if (userRole === 'artist') {
      return <Navigate to="/artist/milestones" replace />;
    } else if (userRole === 'manager') {
      return <Navigate to="/manager" replace />;
    }
    
    // Fallback to homepage
    return <Navigate to="/" replace />;
  }

  console.log('PrivateRoute: Access granted');
  
  // All checks passed, render the protected route
  return <Outlet />;
};

export default PrivateRoute;
