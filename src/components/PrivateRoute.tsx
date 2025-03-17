
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

  // Afficher un spinner pendant le chargement initial seulement
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 space-y-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="text-muted-foreground text-sm mt-2">Chargement en cours...</div>
      </div>
    );
  }

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  if (!user) {
    // Éviter de montrer des toasts répétés lors des redirections
    if (location.pathname !== "/auth/login") {
      toast.error("Vous devez être connecté pour accéder à cette page", {
        id: "auth-required",
      });
    }
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  // Vérifier le rôle si nécessaire (seulement si le profil est chargé)
  if (role && profile && profile.role !== role) {
    toast.error(`Accès réservé aux ${role === 'artist' ? 'artistes' : 'managers'}`, {
      id: "role-required",
    });
    
    // Rediriger vers la page d'accueil du rôle correspondant
    if (profile.role === 'artist') {
      return <Navigate to="/artist/milestones" replace />;
    } else if (profile.role === 'manager') {
      return <Navigate to="/manager" replace />;
    }
    
    return <Navigate to="/" replace />;
  }

  // Si on a un utilisateur mais pas encore de profil (cas rare mais possible)
  if (user && !profile && role) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Initialisation du profil</h2>
          <p className="text-muted-foreground mt-2">Veuillez patienter pendant l'initialisation de votre profil...</p>
        </div>
      </div>
    );
  }

  // Afficher le contenu de la route si tout est OK
  return <Outlet />;
};

export default PrivateRoute;
