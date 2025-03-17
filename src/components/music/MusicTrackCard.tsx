
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash } from "lucide-react";
import { MusicTrack } from "@/types";

interface MusicTrackCardProps {
  track: MusicTrack;
  onDelete: (id: string) => void;
}

export const MusicTrackCard = ({ track, onDelete }: MusicTrackCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl">{track.title}</CardTitle>
        <CardDescription>
          {track.release_date ? new Date(track.release_date).toLocaleDateString() : "Date non définie"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {track.cover_art_url && (
          <div className="aspect-square mb-4 bg-muted rounded-md overflow-hidden">
            <img
              src={track.cover_art_url}
              alt={`Cover art for ${track.title}`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {track.audio_url && (
          <audio controls className="w-full mt-2">
            <source src={track.audio_url} />
            Votre navigateur ne supporte pas la lecture audio
          </audio>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(track.id)}
        >
          <Trash size={16} className="mr-2" />
          Supprimer
        </Button>
      </CardFooter>
    </Card>
  );
};
