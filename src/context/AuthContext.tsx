import React, { createContext, useContext, useEffect, useState } from 'react';
import { CropType, Language, UserProfile } from '../types';
import { localDB } from '../services/db';

interface AuthContextType {
  currentUser: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    state: string;
    district: string;
    preferredLanguage: Language;
    mainCrop: CropType;
  }) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: () => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'agriscan_active_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await localDB.seedInitialDemoData();
        const stored = localStorage.getItem(CURRENT_USER_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as UserProfile;
          setCurrentUser(parsed);
        }
      } catch (err) {
        console.error('Error restoring offline auth session:', err);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (
    email: string,
    password: string,
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const user = await localDB.getUserByEmail(email);
      if (!user) {
        return { success: false, error: 'No offline account found with this email. Please register.' };
      }

      const inputHash = await (localDB.constructor as any).hashPassword(password);
      if (user.passwordHash !== inputHash) {
        return { success: false, error: 'Incorrect password. Check your credentials.' };
      }

      setCurrentUser(user);
      if (rememberMe) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed in local storage.' };
    }
  };

  const register = async (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    state: string;
    district: string;
    preferredLanguage: Language;
    mainCrop: CropType;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const existing = await localDB.getUserByEmail(data.email);
      if (existing) {
        return { success: false, error: 'An offline account with this email already exists.' };
      }

      const passwordHash = await (localDB.constructor as any).hashPassword(data.password);
      const newUser: UserProfile = {
        id: 'usr_' + Date.now(),
        fullName: data.fullName,
        email: data.email.toLowerCase().trim(),
        phone: data.phone,
        passwordHash,
        state: data.state,
        district: data.district,
        preferredLanguage: data.preferredLanguage,
        mainCrop: data.mainCrop,
        createdAt: Date.now(),
      };

      await localDB.saveUser(newUser);
      setCurrentUser(newUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed.' };
    }
  };

  const loginAsDemo = async () => {
    const demoUser: UserProfile = {
      id: 'usr_demo_farmer',
      fullName: 'Ramesh Patel',
      email: 'ramesh.farmer@agriscan.local',
      phone: '+91 98765 43210',
      passwordHash: 'demo_offline_hash',
      state: 'Karnataka',
      district: 'Mandya',
      preferredLanguage: 'en',
      mainCrop: 'tomato',
      createdAt: Date.now(),
    };
    await localDB.saveUser(demoUser);
    setCurrentUser(demoUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(demoUser));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    await localDB.saveUser(updated);
    setCurrentUser(updated);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        login,
        register,
        loginAsDemo,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
