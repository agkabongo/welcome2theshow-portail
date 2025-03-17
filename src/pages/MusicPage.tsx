
import { useEffect } from "react";
import { MusicHeader } from "@/components/music/MusicHeader";
import { AddTrackDialog } from "@/components/music/AddTrackDialog";
import { MusicTrackGrid } from "@/components/music/MusicTrackGrid";
import { useMusicTracks } from "@/hooks/useMusicTracks";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const MusicPage = () => {
  const { tracks, isLoading, fetchTracks, addTrack, deleteTrack } = useMusicTracks();
  const { user, profile } = useAuth();

  // Refetch tracks when the component mounts
  useEffect(() => {
    if (user) {
      console.log('Fetching tracks for user:', user.id);
      console.log('User role:', profile?.role);
      fetchTracks();
    }
  }, [user, fetchTracks]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
            <p className="text-amber-700">Vous devez être connecté pour accéder à cette page.</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is an artist
  if (profile && profile.role !== 'artist') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
            <p className="text-amber-700">Cette section est réservée aux artistes.</p>
          </div>
        </div>
      </div>
    );
  }

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
