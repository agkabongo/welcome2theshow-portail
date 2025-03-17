
import { useState } from "react";
import { toast } from "sonner";
import { MusicTrack } from "@/types";
import { MusicHeader } from "@/components/music/MusicHeader";
import { AddTrackDialog } from "@/components/music/AddTrackDialog";
import { MusicTrackGrid } from "@/components/music/MusicTrackGrid";

const MusicPage = () => {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);

  const handleAddTrack = (track: MusicTrack) => {
    setTracks([...tracks, track]);
    toast.success("Morceau ajouté avec succès");
  };

  const handleDeleteTrack = (id: string) => {
    setTracks(tracks.filter((track) => track.id !== id));
    toast.success("Morceau supprimé avec succès");
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <MusicHeader 
          action={<AddTrackDialog onAddTrack={handleAddTrack} />} 
        />
        <MusicTrackGrid 
          tracks={tracks} 
          onDeleteTrack={handleDeleteTrack} 
        />
      </div>
    </div>
  );
};

export default MusicPage;
