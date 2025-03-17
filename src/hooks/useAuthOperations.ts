
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useProfileOperations } from './useProfileOperations';

/**
 * Hook providing authentication operations
 */
export const useAuthOperations = () => {
  const navigate = useNavigate();
  const { fetchUserProfile } = useProfileOperations();

  /**
   * Handles user sign in
   */
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        const userProfile = await fetchUserProfile(data.user.id);
        
        if (userProfile) {
          if (userProfile.role === 'artist') {
            navigate('/artist/milestones');
          } else {
            navigate('/manager');
          }
          toast.success('Connexion réussie!');
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Une erreur s'est produite lors de la connexion");
    }
  };

  /**
   * Handles user sign up
   */
  const signUp = async (email: string, password: string, role: 'artist' | 'manager', fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            full_name: fullName,
          }
        }
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Inscription réussie! Vous pouvez maintenant vous connecter.');
      navigate('/auth/login');
    } catch (error: any) {
      toast.error(error.message || "Une erreur s'est produite lors de l'inscription");
    }
  };

  /**
   * Handles user sign out
   */
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      navigate('/');
      toast.success('Déconnexion réussie!');
    } catch (error: any) {
      toast.error(error.message || "Une erreur s'est produite lors de la déconnexion");
    }
  };

  return {
    signIn,
    signUp,
    signOut
  };
};
