
import { useState, useEffect, useRef } from 'react';
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
  const initialized = useRef(false);

  useEffect(() => {
    // Set up auth state tracking
    const setupAuth = async () => {
      if (initialized.current) return;
      initialized.current = true;
      
      try {
        console.log('Initializing auth state...');
        setIsLoading(true);
        
        // Get initial session
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log('Initial session found:', data.session.user.id);
          setSession(data.session);
          setUser(data.session.user);
          
          // Load user profile
          if (data.session.user) {
            const userProfile = await fetchUserProfile(data.session.user.id);
            setProfile(userProfile);
          }
        } else {
          console.log('No initial session found');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Set up auth state listener
    const setupAuthListener = () => {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        console.log('Auth state change:', event, newSession?.user?.id);
        
        if (event === 'SIGNED_OUT') {
          // Handle sign out
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          return;
        }
        
        if (newSession) {
          setSession(newSession);
          setUser(newSession.user);
          
          if (newSession.user) {
            // Load user profile
            const userProfile = await fetchUserProfile(newSession.user.id);
            setProfile(userProfile);
          }
        }
        
        setIsLoading(false);
      });
      
      return authListener.subscription.unsubscribe;
    };
    
    setupAuth();
    const unsubscribe = setupAuthListener();
    
    return () => {
      unsubscribe();
    };
  }, []); // Empty dependency array - only run once

  return {
    session,
    user,
    profile,
    isLoading
  };
};
