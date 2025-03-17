
import { useEffect } from "react";
import { MusicHeader } from "@/components/music/MusicHeader";
import { AddTrackDialog } from "@/components/music/AddTrackDialog";
import { MusicTrackGrid } from "@/components/music/MusicTrackGrid";
import { useMusicTracks } from "@/hooks/useMusicTracks";
import { Loader2 } from "lucide-react";

const MusicPage = () => {
  const { tracks, isLoading, fetchTracks, addTrack, deleteTrack } = useMusicTracks();

  // Refetch tracks when the component mounts
  useEffect(() => {
    fetchTracks();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <MusicHeader 
          action={<AddTrackDialog onAddTrack={addTrack} />} 
        />
        
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Chargement des morceaux...</span>
          </div>
        ) : (
          <MusicTrackGrid 
            tracks={tracks} 
            onDeleteTrack={deleteTrack} 
          />
        )}
      </div>
    </div>
  );
};

export default MusicPage;
