
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
  const [isInitialized, setIsInitialized] = useState(false);
  const { fetchUserProfile } = useProfileOperations();

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized) return;

    const initializeAuth = async () => {
      console.log('Initializing auth state...');
      try {
        // Get current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          console.log('Session found:', currentSession.user?.id);
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Fetch profile if user is logged in
          if (currentSession.user) {
            try {
              const userProfile = await fetchUserProfile(currentSession.user.id);
              setProfile(userProfile);
              console.log('User profile loaded:', userProfile?.role);
            } catch (error) {
              console.error('Error fetching user profile:', error);
            }
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
        setIsInitialized(true);
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
          try {
            const userProfile = await fetchUserProfile(currentSession.user.id);
            setProfile(userProfile);
          } catch (error) {
            console.error('Error fetching profile on auth change:', error);
          }
        }
      } else {
        // User signed out or session expired
        setSession(null);
        setUser(null);
        setProfile(null);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchUserProfile, isInitialized]); // Add dependencies

  return {
    session,
    user,
    profile,
    isLoading
  };
};
