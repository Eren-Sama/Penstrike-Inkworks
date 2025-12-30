'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

// User roles (matches DB enum)
export type UserRole = 'reader' | 'author' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  pen_name: string | null;
  username: string | null;
  avatar_url: string | null;
  account_type: 'reader' | 'author';
  role: UserRole; // New: governance role
  bio: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  twitter: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  goodreads: string | null;
  created_at: string | null;
  // Verification fields
  is_verified: boolean;
  verification_requested: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  authUser: User | null;
  loading: boolean;
  isAdmin: boolean; // New: convenience check
  isAuthor: boolean; // New: convenience check
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create default profile helper
function createDefaultProfile(userId: string, email: string): UserProfile {
  return {
    id: userId,
    email: email,
    full_name: null,
    pen_name: null,
    username: null,
    avatar_url: null,
    account_type: 'reader',
    role: 'reader',
    bio: null,
    phone: null,
    location: null,
    website: null,
    twitter: null,
    instagram: null,
    facebook: null,
    linkedin: null,
    goodreads: null,
    created_at: null,
    is_verified: false,
    verification_requested: false,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);
  const initialized = useRef(false);

  // Fetch user profile from database
  const fetchProfile = useCallback(async (userId: string, email: string): Promise<UserProfile> => {
    try {
      const supabase = createClient();
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        console.warn('[AuthContext] Profile fetch error or not found:', error);
        return createDefaultProfile(userId, email);
      }

      // Debug: Log the fetched profile role
      console.log('[AuthContext] Fetched profile:', {
        id: userId,
        email: email,
        role: profile.role,
        account_type: profile.account_type,
      });

      return {
        id: userId,
        email: email,
        full_name: profile.full_name,
        pen_name: profile.pen_name,
        username: profile.username,
        avatar_url: profile.avatar_url,
        account_type: profile.account_type || 'reader',
        role: profile.role || profile.account_type || 'reader', // Fallback to account_type if role not set
        bio: profile.bio,
        phone: profile.phone,
        location: profile.location,
        website: profile.website,
        twitter: profile.twitter,
        instagram: profile.instagram,
        facebook: profile.facebook,
        linkedin: profile.linkedin,
        goodreads: profile.goodreads,
        created_at: profile.created_at,
        is_verified: profile.is_verified || false,
        verification_requested: profile.verification_requested || false,
      };
    } catch {
      return createDefaultProfile(userId, email);
    }
  }, []);

  // Refresh profile
  const refreshProfile = useCallback(async () => {
    if (!authUser) return;
    const profile = await fetchProfile(authUser.id, authUser.email || '');
    if (mounted.current) setUser(profile);
  }, [authUser, fetchProfile]);

  // Sign out
  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    if (mounted.current) {
      setUser(null);
      setAuthUser(null);
    }
  }, []);

  // Derived state for convenience
  const isAdmin = user?.role === 'admin';
  const isAuthor = user?.role === 'author' || user?.account_type === 'author';

  // Debug: Log when role changes
  useEffect(() => {
    if (user) {
      console.log('[AuthContext] User state:', {
        email: user.email,
        role: user.role,
        account_type: user.account_type,
        isAdmin,
        isAuthor,
      });
    }
  }, [user, isAdmin, isAuthor]);

  // Main auth effect - runs once on mount
  useEffect(() => {
    mounted.current = true;
    
    // Prevent double initialization in strict mode
    if (initialized.current) return;
    initialized.current = true;

    const supabase = createClient();

    // Immediately check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted.current) {
          setAuthUser(session.user);
          const profile = await fetchProfile(session.user.id, session.user.email || '');
          if (mounted.current) {
            setUser(profile);
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted.current) return;

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          setAuthUser(session.user);
          const profile = await fetchProfile(session.user.id, session.user.email || '');
          if (mounted.current) {
            setUser(profile);
            setLoading(false);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setAuthUser(null);
        setLoading(false);
      }
    });

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Visibility change handler - refetch on tab focus
  useEffect(() => {
    const supabase = createClient();

    const onVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && mounted.current) {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setAuthUser(session.user);
          const profile = await fetchProfile(session.user.id, session.user.email || '');
          if (mounted.current) {
            setUser(profile);
          }
        } else if (mounted.current) {
          setUser(null);
          setAuthUser(null);
        }
      }
    };

    window.addEventListener('visibilitychange', onVisibilityChange);
    return () => window.removeEventListener('visibilitychange', onVisibilityChange);
  }, [fetchProfile]);

  // Focus handler - refetch on window focus
  useEffect(() => {
    const supabase = createClient();

    const onFocus = async () => {
      if (mounted.current) {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setAuthUser(session.user);
          const profile = await fetchProfile(session.user.id, session.user.email || '');
          if (mounted.current) {
            setUser(profile);
          }
        } else if (mounted.current) {
          setUser(null);
          setAuthUser(null);
        }
      }
    };

    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchProfile]);

  return (
    <AuthContext.Provider value={{ user, authUser, loading, isAdmin, isAuthor, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
