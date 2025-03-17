
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MusicTrack } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook for managing music tracks with Supabase integration
 */
export const useMusicTracks = () => {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch tracks on component mount
  useEffect(() => {
    if (user) {
      fetchTracks();
    } else {
      setTracks([]);
      setIsLoading(false);
    }
  }, [user]);

  /**
   * Fetch all tracks for the current user
   */
  const fetchTracks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching tracks for user:', user?.id);
      
      const { data, error } = await supabase
        .from('music_tracks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching tracks:', error);
        setError(error.message);
        toast.error('Erreur lors du chargement des morceaux');
        return;
      }
      
      console.log('Tracks fetched:', data);
      setTracks(data as MusicTrack[]);
    } catch (err) {
      console.error('Unexpected error in fetchTracks:', err);
      setError('Une erreur est survenue');
      toast.error('Erreur lors du chargement des morceaux');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Add a new track
   */
  const addTrack = async (trackData: Omit<MusicTrack, 'id' | 'artist_id' | 'created_at'>) => {
    try {
      if (!user) {
        toast.error('Vous devez être connecté pour ajouter un morceau');
        return null;
      }

      const newTrack = {
        ...trackData,
        artist_id: user.id,
      };
      
      const { data, error } = await supabase
        .from('music_tracks')
        .insert(newTrack)
        .select()
        .single();
      
      if (error) {
        console.error('Error adding track:', error);
        toast.error('Erreur lors de l\'ajout du morceau');
        return null;
      }
      
      console.log('Track added:', data);
      setTracks(current => [data as MusicTrack, ...current]);
      toast.success('Morceau ajouté avec succès');
      return data as MusicTrack;
    } catch (err) {
      console.error('Unexpected error in addTrack:', err);
      toast.error('Erreur lors de l\'ajout du morceau');
      return null;
    }
  };

  /**
   * Delete a track by ID
   */
  const deleteTrack = async (id: string) => {
    try {
      if (!user) {
        toast.error('Vous devez être connecté pour supprimer un morceau');
        return false;
      }
      
      const { error } = await supabase
        .from('music_tracks')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting track:', error);
        toast.error('Erreur lors de la suppression du morceau');
        return false;
      }
      
      setTracks(current => current.filter(track => track.id !== id));
      toast.success('Morceau supprimé avec succès');
      return true;
    } catch (err) {
      console.error('Unexpected error in deleteTrack:', err);
      toast.error('Erreur lors de la suppression du morceau');
      return false;
    }
  };

  /**
   * Update an existing track
   */
  const updateTrack = async (id: string, trackData: Partial<MusicTrack>) => {
    try {
      if (!user) {
        toast.error('Vous devez être connecté pour modifier un morceau');
        return null;
      }

      // Remove id and artist_id from the update data if present
      const { id: _, artist_id: __, created_at: ___, ...updateData } = trackData;
      
      const { data, error } = await supabase
        .from('music_tracks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating track:', error);
        toast.error('Erreur lors de la mise à jour du morceau');
        return null;
      }
      
      setTracks(current => 
        current.map(track => track.id === id ? (data as MusicTrack) : track)
      );
      
      toast.success('Morceau mis à jour avec succès');
      return data as MusicTrack;
    } catch (err) {
      console.error('Unexpected error in updateTrack:', err);
      toast.error('Erreur lors de la mise à jour du morceau');
      return null;
    }
  };

  return {
    tracks,
    isLoading,
    error,
    fetchTracks,
    addTrack,
    deleteTrack,
    updateTrack
  };
};
