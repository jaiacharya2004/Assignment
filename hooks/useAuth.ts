import { useEffect, useState } from 'react';
import { AuthService, User } from '../services/authService';

export interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    initialized: false,
  });

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initializeAuth = () => {
      unsubscribe = AuthService.onAuthStateChanged((user) => {
        console.log("Auth state changed:", user); 
        setAuthState({
          user,
          loading: false,
          initialized: true,
        });
      });
    };

    initializeAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await AuthService.signIn(email, password);
      
      if (result.success) {
        setAuthState(prev => ({ ...prev, loading: false }));
        return { success: true, user: result.user };
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
        throw new Error(result.error);
      }
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await AuthService.signUp(email, password, displayName);
      
      if (result.success) {
        setAuthState(prev => ({ ...prev, loading: false }));
        return { success: true, user: result.user };
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
        throw new Error(result.error);
      }
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await AuthService.sendPasswordResetEmail(email);
      
      if (result.success) {
        setAuthState(prev => ({ ...prev, loading: false }));
        return { success: true };
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
        throw new Error(result.error);
      }
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await AuthService.signOut();
      
      if (result.success) {
        setAuthState(prev => ({ ...prev, loading: false, user: null }));
        return { success: true };
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
        throw new Error(result.error);
      }
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    initialized: authState.initialized,
    signIn,
    signUp,
    forgotPassword,
    signOut,
  };
}