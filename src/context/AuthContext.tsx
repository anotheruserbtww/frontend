import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { storage, STORAGE_KEY } from "../api/axios";

type LoginResponse = {
  token: string;
  username: string;
  roles: string[];
};

type AuthState = {
  token: string | null;
  username: string | null;
  roles: string[];
};

type AuthContextType = {
  auth: AuthState;
  isAuthenticated: boolean;
  hasRole: (r: string) => boolean;
  login: (username: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({ token: null, username: null, roles: [] });

  // Carga inicial desde storage
  useEffect(() => {
    const token = storage.get();
    const username = sessionStorage.getItem("auth.username") || localStorage.getItem("auth.username");
    const rolesRaw = sessionStorage.getItem("auth.roles") || localStorage.getItem("auth.roles");
    const roles = rolesRaw ? JSON.parse(rolesRaw) : [];
    if (token) setAuth({ token, username, roles });
  }, []);

  const login = async (username: string, password: string, remember = false) => {
    const { data } = await api.post<LoginResponse>("/api/Auth/login", { username, password });
    // guarda token y metadatos
    storage.set(data.token, !!remember);
    const save = remember ? localStorage : sessionStorage;
    save.setItem("auth.username", data.username);
    save.setItem("auth.roles", JSON.stringify(data.roles));
    setAuth({ token: data.token, username: data.username, roles: data.roles });
  };

  const logout = () => {
    storage.clear();
    sessionStorage.removeItem("auth.username");
    sessionStorage.removeItem("auth.roles");
    localStorage.removeItem("auth.username");
    localStorage.removeItem("auth.roles");
    setAuth({ token: null, username: null, roles: [] });
  };

  const value = useMemo<AuthContextType>(() => ({
    auth,
    isAuthenticated: !!auth.token,
    hasRole: (r) => auth.roles.includes(r),
    login,
    logout,
  }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
