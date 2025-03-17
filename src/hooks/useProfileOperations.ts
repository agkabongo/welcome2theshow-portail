
import { Profile } from '@/types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook providing functions to interact with user profiles
 */
export const useProfileOperations = () => {
  /**
   * Fetches a user profile by user ID
   */
  const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      console.log('Profile data found:', data);
      return data as Profile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  /**
   * Updates a user profile
   */
  const updateUserProfile = async (profile: Partial<Profile>): Promise<boolean> => {
    try {
      if (!profile.id) {
        console.error('Cannot update profile without an ID');
        return false;
      }

      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', profile.id);

      if (error) {
        console.error('Error updating profile:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      return false;
    }
  };

  return {
    fetchUserProfile,
    updateUserProfile
  };
};
