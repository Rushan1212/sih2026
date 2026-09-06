import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  SupabaseUser,
  SupabaseSession,
  UserRole,
  SupabaseUserMetadata,
  StoredUserAccount,
  CreateUserParams,
  UserLoginRecord,
} from '../types/auth';
import { authService, AUTH_CHANGE_EVENT, USERS_CHANGE_EVENT } from '../services/auth';
import { isSupabaseConfigured } from '../services/supabase';
import { soundManager } from '../utils/sound';

interface AuthContextType {
  user: SupabaseUser | null;
  session: SupabaseSession | null;
  role: UserRole | null;
  isAuthority: boolean;
  isEmployee: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSupabaseLive: boolean;
  registeredUsers: StoredUserAccount[];
  loginRecords: UserLoginRecord[];
  login: (params: {
    email: string;
    password?: string;
    role?: UserRole;
  }) => Promise<void>;
  loginAsDemo: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  createUser: (params: CreateUserParams) => Promise<StoredUserAccount>;
  deleteUser: (targetUserId: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
  fetchLoginRecords: () => Promise<UserLoginRecord[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<SupabaseSession | null>(() => authService.getSession());
  const [user, setUser] = useState<SupabaseUser | null>(() => authService.getUser());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(() => isSupabaseConfigured());
  const [registeredUsers, setRegisteredUsers] = useState<StoredUserAccount[]>(() =>
    authService.getRegisteredUsers()
  );
  const [loginRecords, setLoginRecords] = useState<UserLoginRecord[]>([]);

  const refreshUsers = useCallback(async () => {
    setIsSupabaseLive(isSupabaseConfigured());
    try {
      const fresh = await authService.fetchRegisteredUsers();
      setRegisteredUsers(fresh);
    } catch (e) {
      setRegisteredUsers(authService.getRegisteredUsers());
    }
  }, []);

  const fetchLoginRecords = useCallback(async (): Promise<UserLoginRecord[]> => {
    try {
      const logs = await authService.fetchLoginRecords();
      setLoginRecords(logs);
      return logs;
    } catch (err) {
      console.warn('Failed to load login audit logs:', err);
      return [];
    }
  }, []);

  useEffect(() => {
    // Initial fetch from Supabase
    refreshUsers();
    fetchLoginRecords();

    const { unsubscribe } = authService.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession ? currentSession.user : null);
      fetchLoginRecords();
    });

    const handleUsersChange = () => {
      setRegisteredUsers(authService.getRegisteredUsers());
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(USERS_CHANGE_EVENT, handleUsersChange);
      window.addEventListener('storage', handleUsersChange);
    }

    return () => {
      unsubscribe();
      if (typeof window !== 'undefined') {
        window.removeEventListener(USERS_CHANGE_EVENT, handleUsersChange);
        window.removeEventListener('storage', handleUsersChange);
      }
    };
  }, [refreshUsers, fetchLoginRecords]);

  const login = useCallback(
    async (params: {
      email: string;
      password?: string;
      role?: UserRole;
    }) => {
      setIsLoading(true);
      try {
        const { session: newSession, user: newUser } = await authService.signInWithPassword(params);
        setSession(newSession);
        setUser(newUser);
        soundManager.playSuccess();
        fetchLoginRecords();
      } finally {
        setIsLoading(false);
      }
    },
    [fetchLoginRecords]
  );

  const loginAsDemo = useCallback(
    async (role: UserRole) => {
      setIsLoading(true);
      try {
        const { session: newSession, user: newUser } = await authService.signInWithDemo(role);
        setSession(newSession);
        setUser(newUser);
        soundManager.playSuccess();
        fetchLoginRecords();
      } finally {
        setIsLoading(false);
      }
    },
    [fetchLoginRecords]
  );

  const logout = useCallback(async () => {
    soundManager.playClick();
    await authService.signOut();
    setSession(null);
    setUser(null);
  }, []);

  const createUser = useCallback(
    async (params: CreateUserParams) => {
      if (!user || user.role !== 'authority') {
        throw new Error('Unauthorized: Only an active DGMS Authority can provision accounts.');
      }
      setIsLoading(true);
      try {
        const created = await authService.createUserAccount(user.id, params);
        await refreshUsers();
        soundManager.playSuccess();
        return created;
      } finally {
        setIsLoading(false);
      }
    },
    [user, refreshUsers]
  );

  const deleteUser = useCallback(
    async (targetUserId: string) => {
      if (!user || user.role !== 'authority') {
        throw new Error('Unauthorized: Only an active DGMS Authority can delete accounts.');
      }
      setIsLoading(true);
      try {
        await authService.deleteUserAccount(user.id, targetUserId);
        await refreshUsers();
        soundManager.playClick();
      } finally {
        setIsLoading(false);
      }
    },
    [user, refreshUsers]
  );

  const role = user ? user.role : null;
  const isAuthority = role === 'authority';
  const isEmployee = role === 'employee';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        isAuthority,
        isEmployee,
        isAuthenticated,
        isLoading,
        isSupabaseLive,
        registeredUsers,
        loginRecords,
        login,
        loginAsDemo,
        logout,
        createUser,
        deleteUser,
        refreshUsers,
        fetchLoginRecords,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
