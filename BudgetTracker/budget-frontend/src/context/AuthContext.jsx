


import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import api from "../api/axiosClient";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertCount, setAlertCount] = useState(0);

  const normalizeUser = useCallback((data) => {
    if (!data) return null;

    // Fallback: get id from previously stored user in localStorage
    const storedUser = localStorage.getItem("user");
    let storedId = null;
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Only use storedId if it's a real value (not null/undefined)
        if (parsed?.id != null) storedId = parsed.id;
      } catch(e) {}
    }

    // Use != null to skip both null and undefined, fall through to storedId
    const resolvedId =
      (data.id != null ? data.id : undefined) ||
      (data.userId != null ? data.userId : undefined) ||
      (data.subject != null ? data.subject : undefined) ||
      (data._id != null ? data._id : undefined) ||
      storedId;

    return {
      ...data,
      id: resolvedId
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
      if (err.response?.status === 401) {
          // Don't logout — just keep using the localStorage user
          // Only logout if there's no saved user at all
          const savedUser = localStorage.getItem("user");
          if (!savedUser) logout();
        }
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