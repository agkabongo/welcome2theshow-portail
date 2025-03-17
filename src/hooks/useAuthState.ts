
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
  const initialized = useRef(false);
  const { fetchUserProfile } = useProfileOperations();

  // Function to fetch and set the user profile
  const loadUserProfile = async (userId: string) => {
    try {
      const userProfile = await fetchUserProfile(userId);
      console.log('User profile loaded:', userProfile?.role);
      setProfile(userProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    // Prevent multiple initializations
    if (initialized.current) return;
    
    initialized.current = true;
    console.log('Initializing auth state...');

    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          console.log('Session found:', currentSession.user?.id);
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Fetch profile if user is logged in
          if (currentSession.user) {
            await loadUserProfile(currentSession.user.id);
          }
        } else {
          console.log('No active session');
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Initialize auth
    initializeAuth();

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state change:', event, currentSession?.user?.id);
      
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        
        // Fetch profile if user is logged in
        if (currentSession.user) {
          await loadUserProfile(currentSession.user.id);
        }
      } else {
        // User signed out or session expired
        setSession(null);
        setUser(null);
        setProfile(null);
      }
      
      // Ensure loading state is updated regardless of outcome
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []); // Empty dependency array

  return {
    session,
    user,
    profile,
    isLoading
  };
};
