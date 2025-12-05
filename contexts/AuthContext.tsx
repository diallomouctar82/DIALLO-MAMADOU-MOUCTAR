
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User, UserRole, UserStatus } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  socialLogin: (provider: 'google' | 'facebook') => Promise<void>;
  logout: () => void;
  verify2FA: (code: string) => Promise<boolean>;
  updateCredits: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Users Database
const MOCK_ADMIN: User = {
  id: 'admin_001',
  name: 'Super Administrateur',
  email: 'admin@lemondeavous.com',
  role: UserRole.SUPER_ADMIN,
  status: UserStatus.ACTIVE,
  credits: 999999,
  isVerified: true,
  twoFactorEnabled: true,
  referralCode: 'ADMIN_GOD_MODE',
  hasLifetimeAccess: true
};

const MOCK_USER: User = {
  id: 'user_001',
  name: 'Mamadou Diallo',
  email: 'mamadou@example.com',
  role: UserRole.USER,
  status: UserStatus.ACTIVE,
  credits: 320,
  isVerified: true,
  twoFactorEnabled: false,
  trialEndsAt: new Date(new Date().setDate(new Date().getDate() + 24)),
  referralCode: 'MAMADOU2025'
};

const MOCK_BANNED_USER: User = {
    id: 'banned_001',
    name: 'Utilisateur Banni',
    email: 'banned@example.com',
    role: UserRole.USER,
    status: UserStatus.BANNED,
    credits: 0,
    isVerified: false,
    twoFactorEnabled: false,
    referralCode: 'BAN'
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    securityLevel: 'Fortress' as any
  });

  useEffect(() => {
    // Simulate session check on mount
    const storedUser = localStorage.getItem('lmav_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Security Check: If locally stored user is banned (in a real app, this check happens on backend token validation)
      if (parsedUser.status === UserStatus.BANNED) {
          localStorage.removeItem('lmav_user');
          setState(prev => ({ ...prev, isLoading: false }));
          return;
      }

      setState(prev => ({
        ...prev,
        user: parsedUser,
        isAuthenticated: true,
        isLoading: false
      }));
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API Latency & Encryption
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (email === 'admin@lemondeavous.com' && pass === 'admin') {
      const user = MOCK_ADMIN;
      localStorage.setItem('lmav_user', JSON.stringify(user));
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        securityLevel: 'FORTRESS'
      });
      return true;
    }

    if (email === 'mamadou@example.com' && pass === 'user') {
      const user = MOCK_USER;
      localStorage.setItem('lmav_user', JSON.stringify(user));
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        securityLevel: 'HIGH'
      });
      return true;
    }

    if (email === 'banned@example.com') {
        // Simulation d'une tentative de connexion d'un utilisateur banni
        setState(prev => ({ ...prev, isLoading: false }));
        return false; // Ou retourner un code d'erreur spécifique 'USER_BANNED'
    }

    setState(prev => ({ ...prev, isLoading: false }));
    return false;
  };

  const socialLogin = async (provider: 'google' | 'facebook') => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate OAuth Redirect & Token Exchange
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create a mock user based on the provider
    const socialUser: User = {
      id: `user_${provider}_${Date.now()}`,
      name: provider === 'google' ? 'Utilisateur Google' : 'Utilisateur Facebook',
      email: provider === 'google' ? 'google.user@gmail.com' : 'fb.user@facebook.com',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      credits: 100, // Welcome bonus for social login
      isVerified: true, // Social accounts are trusted
      twoFactorEnabled: false,
      trialEndsAt: new Date(new Date().setDate(new Date().getDate() + 30)),
      referralCode: `SOCIAL${Date.now().toString().slice(-4)}`
    };

    localStorage.setItem('lmav_user', JSON.stringify(socialUser));
    
    setState({
      user: socialUser,
      isAuthenticated: true,
      isLoading: false,
      securityLevel: 'HIGH'
    });
  };

  const verify2FA = async (code: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return code === '123456';
  };

  const logout = () => {
    localStorage.removeItem('lmav_user');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      securityLevel: 'HIGH'
    });
  };

  const updateCredits = (amount: number) => {
    if (state.user) {
      const updatedUser = { ...state.user, credits: state.user.credits + amount };
      setState(prev => ({ ...prev, user: updatedUser }));
      localStorage.setItem('lmav_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, socialLogin, logout, verify2FA, updateCredits }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
