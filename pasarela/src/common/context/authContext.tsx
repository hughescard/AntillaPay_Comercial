/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import API from "@/lib/api";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { User } from "../types/userTypes";
import { normalizeAppPathname } from "@/lib/rbac/normalizePathname";

export const TOKEN_KEY = "authToken";


interface AuthContextType {
  client: User | null;
  clientToken: string | null;
  loading: boolean;
  getMyInfo: () => Promise<void>;
  logout: () => void;
  setRefresh: (value: boolean) => void;
  refresh: boolean;
}

const AuthContext = createContext<AuthContextType>({
  client: null,
  clientToken: null,
  loading: true,
  getMyInfo: async () => {},
  logout: () => {},
  setRefresh: () => {},
  refresh: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [client, setClientInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const normalizedPathname = normalizeAppPathname(pathname);
  const isPublicRoute =
    normalizedPathname === "/signin" ||
    normalizedPathname === "/register" ||
    normalizedPathname === "/forgot_password";

  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setClientInfo(null);
    setClientToken(null);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    if (!isPublicRoute) {
      router.replace("/signin");
    }
  }, [clearAuth, isPublicRoute, router]);

  const getMyInfo = useCallback(async () => {
    setLoading(true);
    try {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem(TOKEN_KEY);
      setClientToken(token);
      if (token) {
        try {
          const { data } = await API.get<User>("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setClientInfo(data);
        } catch (err: any) {
          const status = err?.response?.status;
          if (status === 401 || status === 403 || status === 404) {
            clearAuth();
            if (!isPublicRoute) {
              router.replace("/signin");
            }
          }
        }
      } else {
        setClientInfo(null);
        setClientToken(null);
        if (!isPublicRoute) {
          router.replace("/signin");
        }
      }
    } catch (error) {
      console.log("[AuthProvider] Error getting my info:", error);
      clearAuth();
      if (!isPublicRoute) {
        router.replace("/signin");
      }
    } finally {
      setLoading(false);
    }
  }, [clearAuth, isPublicRoute, router]); 

  useEffect(() => {
    getMyInfo();
  }, [getMyInfo, refresh]); 

  return (
    <AuthContext.Provider value={{ client, clientToken, loading, getMyInfo, logout, setRefresh, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
