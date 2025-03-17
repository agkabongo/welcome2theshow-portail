
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

  // Afficher un spinner pendant le chargement
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 space-y-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-4 w-48" />
        <div className="text-muted-foreground text-sm">Chargement en cours...</div>
      </div>
    );
  }

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  if (!user) {
    // Enregistrer la route actuelle pour rediriger l'utilisateur après la connexion
    toast.error("Vous devez être connecté pour accéder à cette page");
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  // Vérifier le rôle si nécessaire
  if (role && profile?.role !== role) {
    toast.error(`Accès réservé aux ${role === 'artist' ? 'artistes' : 'managers'}`);
    
    // Rediriger vers la page d'accueil du rôle correspondant
    if (profile?.role === 'artist') {
      return <Navigate to="/artist" replace />;
    } else if (profile?.role === 'manager') {
      return <Navigate to="/manager" replace />;
    }
    
    return <Navigate to="/" replace />;
  }

  // Afficher le contenu de la route si tout est OK
  return <Outlet />;
};

export default PrivateRoute;
