'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

// Tipe data user yang disimpan di context
type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  student?: {
    id: string; // hanya untuk user role mahasiswa
  };
};

// Tipe untuk context auth (login/logout dan user info)
type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

// Membuat context untuk user
const UserContext = createContext<AuthContextType | undefined>(undefined);

// Provider yang membungkus aplikasi dan menyediakan state user
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // menyimpan data user
  const [loading, setLoading] = useState<boolean>(true); // status loading
  const [error, setError] = useState<string>(''); // pesan error login
  const router = useRouter(); // untuk redirect halaman

  useEffect(() => {
    checkAuth(); // cek login saat pertama kali render
  }, []);

  // Fungsi untuk memverifikasi apakah user sudah login atau belum
  const checkAuth = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3002/auth/me', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Belum login');

      const data = await res.json();
      setUser(data.user); // set user ke context
      localStorage.setItem('userId', data.user.id); // simpan ID ke localStorage
    } catch (err) {
      setUser(null); // jika gagal login, kosongkan user
      localStorage.removeItem('userId'); // hapus dari localStorage
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk login
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

      setUser(data.user); // simpan user yang berhasil login
      localStorage.setItem('userId', data.user.id); // simpan ID

      router.push('/'); // redirect ke halaman utama
      return true;
    } catch (err: any) {
      setError(err.message); // simpan pesan error
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fungsi logout
  const logout = async () => {
    try {
      const res = await fetch('http://localhost:3002/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        setUser(null); // kosongkan context
        localStorage.removeItem('userId'); // hapus dari localStorage
        router.push('/login'); // redirect ke login
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

// Hook custom untuk mengakses context user
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
