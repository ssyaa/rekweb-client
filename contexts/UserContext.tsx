'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  student?: {
    id: string;
  };
};


type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  // hapus submissionStatus dan setSubmissionStatus
};

const UserContext = createContext<AuthContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3002/auth/me', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Belum login');

      const data = await res.json();
      setUser(data.user);
      localStorage.setItem('userId', data.user.id);
    } catch (err) {
      setUser(null);
      localStorage.removeItem('userId');
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3002/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login gagal');

      setUser(data.user);
      localStorage.setItem('userId', data.user.id);

      router.push('/');
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const res = await fetch('http://localhost:3002/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        setUser(null);
        localStorage.removeItem('userId');
        router.push('/login');
      } else {
        console.error('Logout gagal:', await res.text());
      }
    } catch (err) {
      console.error('Error saat logout:', err);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
