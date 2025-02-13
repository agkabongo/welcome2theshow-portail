
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Music, Image, Users } from "lucide-react";

export const Navigation = () => {
  const location = useLocation();
  const isManagerPortal = location.pathname.startsWith("/manager");
  const isArtistPortal = location.pathname.startsWith("/artist");
  
  if (!isManagerPortal && !isArtistPortal) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-semibold text-primary hover:opacity-80 transition-opacity">
            {isManagerPortal ? "Manager Portal" : "Artist Journey"}
          </Link>
          <div className="flex gap-6">
            {isArtistPortal ? (
              <>
                <Link
                  to="/artist/moodboard"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                    "hover:bg-secondary/80",
                    location.pathname === "/artist/moodboard" && "bg-secondary"
                  )}
                >
                  <Image size={18} />
                  <span>Mood Board</span>
                </Link>
                <Link
                  to="/artist/milestones"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                    "hover:bg-secondary/80",
                    location.pathname === "/artist/milestones" && "bg-secondary"
                  )}
                >
                  <Music size={18} />
                  <span>Milestones</span>
                </Link>
              </>
            ) : (
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:bg-secondary/80"
              >
                <Users size={18} />
                <span>Switch Portal</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
