
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types';
import { toast } from 'sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: 'artist' | 'manager', fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

  // Fonction pour récupérer le profil d'un utilisateur
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

  useEffect(() => {
    // Cette fonction ne s'exécute qu'une seule fois
    const initializeAuth = async () => {
      if (initialized) return; // Éviter les appels multiples
      
      setIsLoading(true);
      try {
        // Récupère la session actuelle
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Si un utilisateur est connecté, récupérer son profil
          if (currentSession.user) {
            const userProfile = await fetchUserProfile(currentSession.user.id);
            setProfile(userProfile);
          }
        } else {
          // Aucune session active
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Réinitialiser l'état en cas d'erreur
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        setIsLoading(false);
        setInitialized(true);
      }
    };

    // Initialisation: récupérer la session actuelle
    initializeAuth();

    // S'abonner aux changements d'état d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state change:', event, currentSession?.user?.id);
      
      // Ne pas mettre isLoading à true ici pour éviter de bloquer l'interface
      // pendant les transitions d'authentification
      
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        
        // Récupérer le profil uniquement si l'utilisateur est connecté
        if (currentSession.user) {
          const userProfile = await fetchUserProfile(currentSession.user.id);
          setProfile(userProfile);
        }
      } else {
        // L'utilisateur s'est déconnecté ou la session a expiré
        setSession(null);
        setUser(null);
        setProfile(null);
      }
    });

    // Nettoyage: se désabonner à la désinscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [initialized]); // Dépendance à initialized pour éviter des appels multiples

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

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      // Réinitialiser l'état après la déconnexion
      setProfile(null);
      setUser(null);
      setSession(null);
      
      navigate('/');
      toast.success('Déconnexion réussie!');
    } catch (error: any) {
      toast.error(error.message || "Une erreur s'est produite lors de la déconnexion");
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
