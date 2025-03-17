
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

  useEffect(() => {
    // Initialize auth state only once
    const initializeAuth = async () => {
      if (initialized.current) return;
      initialized.current = true;
      
      setIsLoading(true);
      try {
        // Get current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Fetch profile if user is logged in
          if (currentSession.user) {
            const userProfile = await fetchUserProfile(currentSession.user.id);
            setProfile(userProfile);
          }
        } else {
          // No active session
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Reset state on error
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
          const userProfile = await fetchUserProfile(currentSession.user.id);
          setProfile(userProfile);
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
  }, []); // Empty dependency array ensures this runs once

  return {
    session,
    user,
    profile,
    isLoading
  };
};
