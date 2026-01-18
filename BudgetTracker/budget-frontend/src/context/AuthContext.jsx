import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import api from "../api/axiosClient";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertCount, setAlertCount] = useState(0);

  // 1. DYNAMIC NORMALIZER
  // Based on your log: {subject: '20'}, this maps 'subject' to 'id'
  const normalizeUser = useCallback((data) => {
    if (!data) return null;
    return {
      ...data,
      id: data.id || data.userId || data.subject || data._id
    };
  }, []);

  const loadAlertCount = async (userId) => {
    if (!userId) return;
    try {
      const res = await api.get("/budget/alerts/count", { params: { userId } });
      setAlertCount(res.data);
    } catch (err) {
      setAlertCount(0);
    }
  };

  const loadMe = useCallback(async () => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Try LocalStorage first
    if (savedUser) {
      try {
        const parsed = normalizeUser(JSON.parse(savedUser));
        setUser(parsed);
        if (parsed?.id) await loadAlertCount(parsed.id);
        setLoading(false);
      } catch (e) {
        localStorage.removeItem("user");
      }
    }

    // Always sync with Server
    try {
      const res = await api.get("/auth/me");
      const validatedUser = normalizeUser(res.data);

      setUser(validatedUser);
      localStorage.setItem("user", JSON.stringify(validatedUser));

      if (validatedUser?.id) await loadAlertCount(validatedUser.id);
    } catch (err) {
      if (err.response?.status === 401) logout();
    } finally {
      setLoading(false);
    }
  }, [normalizeUser]);

  const login = async (token, userData) => {
    const validatedUser = normalizeUser(userData);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(validatedUser));
    setUser(validatedUser);
    if (validatedUser?.id) await loadAlertCount(validatedUser.id);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setAlertCount(0);
    setLoading(false);
  };

  const refreshAlertCount = async () => {
    if (user?.id) await loadAlertCount(user.id);
  };

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        alertCount,
        refreshAlertCount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}