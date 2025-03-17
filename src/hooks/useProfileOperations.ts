
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
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as Profile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  return {
    fetchUserProfile
  };
};
