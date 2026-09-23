import { createContext, useEffect, useState, type ReactNode } from "react";
import {
  loginApi,
  logoutApi,
  getMeApi,
} from "../api/auth";

type Role = {
  role_id: number;
  role_name: string;
};

type UserStatus = {
  u_stat_id: number;
  u_status_name: string;
};

type User = {
  user_id: number;
  full_name: string;
  email: string;
  nim_nip: string;
  role: Role;
  user_status: UserStatus;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await getMeApi();
        setUser(response.user ?? response);
      } catch (error) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginApi(email, password);

    const newToken = response.token;
    const loggedInUser = response.user;

    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(loggedInUser);

    return loggedInUser;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Logout API gagal:", error);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};