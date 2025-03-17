
import { ReactNode } from "react";

interface MusicHeaderProps {
  action: ReactNode;
}

export const MusicHeader = ({ action }: MusicHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Ma Musique</h1>
        <p className="text-muted-foreground">
          Gérez vos morceaux et partagez votre musique
        </p>
      </div>
      {action}
    </div>
  );
};
