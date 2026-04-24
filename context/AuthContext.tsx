"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  apiGet,
  apiPost,
  setAccessToken,
  refreshAccessToken,
  type ApiResponse,
} from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
}

interface AuthResponse {
  user: User;
  accessToken: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const res: ApiResponse<User> = await apiGet<User>("/auth/me");
    if (res.success && res.data) {
      setUser(res.data);
    } else {
      setUser(null);
    }
  }, []);

  // On mount: try to restore session via httpOnly refresh token cookie
  useEffect(() => {
    async function restoreSession() {
      const token = await refreshAccessToken();
      if (token) {
        await refreshUser();
      }
      setIsLoading(false);
    }
    restoreSession();
  }, [refreshUser]);

  // Listen for session-expired events dispatched by the API layer
  useEffect(() => {
    function handleSessionExpired() {
      setAccessToken(null);
      setUser(null);
      router.push("/login");
    }
    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () => window.removeEventListener("auth:session-expired", handleSessionExpired);
  }, [router]);

  const login = useCallback(async (email: string, password: string) => {
    const res: ApiResponse<AuthResponse> = await apiPost<AuthResponse>(
      "/auth/login",
      { email, password },
    );

    if (!res.success || !res.data) {
      throw new Error(res.error || "Đăng nhập thất bại.");
    }

    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res: ApiResponse<AuthResponse> = await apiPost<AuthResponse>(
        "/auth/register",
        { name, email, password },
      );

      if (!res.success || !res.data) {
        throw new Error(res.error || "Đăng ký thất bại.");
      }

      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await apiPost("/auth/logout");
    } catch {
      // Best-effort server logout
    }
    setAccessToken(null);
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
