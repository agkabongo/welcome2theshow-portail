
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types';
import { useProfileOperations } from './useProfileOperations';

/**
 * Hook managing authentication state
 */
export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchUserProfile } = useProfileOperations();

  useEffect(() => {
    let mounted = true;
    
    async function getInitialSession() {
      setIsLoading(true);

      try {
        console.log('Getting initial session');
        const { data } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (data.session) {
          console.log('Session found:', data.session.user.id);
          setSession(data.session);
          setUser(data.session.user);
          
          // Load profile
          if (data.session.user) {
            const userProfile = await fetchUserProfile(data.session.user.id);
            if (mounted) {
              setProfile(userProfile);
            }
          }
        } else {
          console.log('No initial session found');
        }
      } catch (error) {
        console.error('Error fetching initial session:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    getInitialSession();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event);

      if (!mounted) return;
      
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setProfile(null);
        setIsLoading(false);
        return;
      }
      
      if (newSession) {
        console.log('New session detected:', newSession.user.id);
        setSession(newSession);
        setUser(newSession.user);
        
        if (newSession.user) {
          console.log('Fetching profile for new session');
          const userProfile = await fetchUserProfile(newSession.user.id);
          if (mounted) {
            setProfile(userProfile);
          }
        }
      }
      
      if (mounted) {
        setIsLoading(false);
      }
    });
    
    return () => {
      console.log('Cleaning up auth listeners');
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []); // Empty dependency array - only run once

  return {
    session,
    user,
    profile,
    isLoading
  };
};
