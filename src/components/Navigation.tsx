import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Music, Image, Users, LogOut, User, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, isLoading, session } = useAuth();
  
  const isManagerPortal = location.pathname.startsWith("/manager");
  const isArtistPortal = location.pathname.startsWith("/artist");
  
  const getUserRole = () => {
    if (profile?.role) {
      return profile.role;
    }
    
    if (session?.user?.user_metadata?.role) {
      return session.user.user_metadata.role;
    }
    
    return null;
  };
  
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Vous devez être connecté pour accéder à cette page");
      navigate("/auth/login");
      return;
    }
    
    const userRole = getUserRole();
    
    if (path.startsWith("/artist/") && userRole !== "artist") {
      if (isLoading) {
        console.log("Profile still loading, checking session metadata");
      } else {
        toast.error("Cette section est réservée aux artistes");
        return;
      }
    }
    
    if (path.startsWith("/manager") && userRole !== "manager") {
      if (isLoading) {
        console.log("Profile still loading, checking session metadata");
      } else {
        toast.error("Cette section est réservée aux managers");
        return;
      }
    }
    
    navigate(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-semibold text-primary hover:opacity-80 transition-opacity">
            {isManagerPortal ? "Manager Portal" : isArtistPortal ? "Artist Journey" : "Music Platform"}
          </Link>
          
          <div className="flex gap-6 items-center">
            {isArtistPortal ? (
              <>
                <a
                  href="/artist/moodboard"
                  onClick={handleNavigation("/artist/moodboard")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                    "hover:bg-secondary/80",
                    location.pathname === "/artist/moodboard" && "bg-secondary"
                  )}
                >
                  <Image size={18} />
                  <span>Mood Board</span>
                </a>
                <a
                  href="/artist/milestones"
                  onClick={handleNavigation("/artist/milestones")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                    "hover:bg-secondary/80",
                    location.pathname === "/artist/milestones" && "bg-secondary"
                  )}
                >
                  <Music size={18} />
                  <span>Milestones</span>
                </a>
                <a
                  href="/artist/music"
                  onClick={handleNavigation("/artist/music")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                    "hover:bg-secondary/80",
                    location.pathname === "/artist/music" && "bg-secondary"
                  )}
                >
                  <Music size={18} />
                  <span>Ma Musique</span>
                </a>
              </>
            ) : isManagerPortal ? (
              <a
                href="/manager"
                onClick={handleNavigation("/manager")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                  "hover:bg-secondary/80",
                  location.pathname === "/manager" && "bg-secondary"
                )}
              >
                <Users size={18} />
                <span>Artistes</span>
              </a>
            ) : null}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || ""} />
                      <AvatarFallback>{getInitials(profile?.full_name || session?.user?.user_metadata?.full_name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="flex items-center gap-2 cursor-default">
                    <User size={14} />
                    <span>{profile?.full_name || session?.user?.user_metadata?.full_name || 'Utilisateur'}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()} className="flex items-center gap-2">
                    <LogOut size={14} />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/auth/login"
                className="flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:bg-secondary/80"
              >
                <LogIn size={18} />
                <span>Se connecter</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
