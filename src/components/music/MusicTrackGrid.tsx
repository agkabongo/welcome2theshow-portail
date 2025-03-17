
import { MusicTrack } from "@/types";
import { MusicTrackCard } from "./MusicTrackCard";
import { EmptyMusicState } from "./EmptyMusicState";

interface MusicTrackGridProps {
  tracks: MusicTrack[];
  onDeleteTrack: (id: string) => void;
}

export const MusicTrackGrid = ({ tracks, onDeleteTrack }: MusicTrackGridProps) => {
  if (tracks.length === 0) {
    return <EmptyMusicState />;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {tracks.map((track) => (
        <MusicTrackCard 
          key={track.id} 
          track={track} 
          onDelete={onDeleteTrack} 
        />
      ))}
    </div>
  );
};
