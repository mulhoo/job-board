import React, { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        setUser(JSON.parse(raw));
      }
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
    }
    setReady(true);
  }, []);

  function login(data) {
    const normalizedUser = {
      is_admin: !!data.is_admin,
      email: data.email || null,
      first_name: data.first_name || null,
      last_name: data.last_name || null,
      id: data.id || null
    };

    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);
    }
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  }

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
  }

  const makeAuthenticatedRequest = async (url, options = {}) => {
    const token = localStorage.getItem('access_token');

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (response.status === 401) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/users/refresh`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          localStorage.setItem('access_token', data.access_token);

          return fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${data.access_token}`
            }
          });
        }
      } catch (e) {
        logout();
      }
    }

    return response;
  };

  const fetchJobs = async (params = {}) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, value);
      }
    });

    const url = `/jobs/${searchParams.toString() ? `?${searchParams}` : ''}`;
    const response = await makeAuthenticatedRequest(url);

    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }

    return response.json();
  };

  const isAuthenticated = () => {
    return !!(user && localStorage.getItem("access_token"));
  };

  const isAdmin = () => {
    return isAuthenticated() && user?.is_admin === true;
  };

  const value = {
    user,
    ready,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    makeAuthenticatedRequest,
    fetchJobs,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}