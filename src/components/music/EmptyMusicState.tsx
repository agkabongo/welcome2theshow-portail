
import { Music } from "lucide-react";

export const EmptyMusicState = () => {
  return (
    <div className="text-center py-12 border-2 border-dashed rounded-lg">
      <Music className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">Aucun morceau</h3>
      <p className="text-muted-foreground mt-2">
        Commencez par ajouter votre premier morceau
      </p>
    </div>
  );
};
