import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { AuthState, User } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => Promise<void>; // ✅ updated to support PATCH
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:3001/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          const res = await axios.get(`${API_URL}/users/me`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${state.token}`,
            },
          });

          setState((prevState) => ({
            ...prevState,
            isAuthenticated: true,
            isLoading: false,
            user: res.data,
          }));
        } catch (err) {
          localStorage.removeItem('token');
          setState((prevState) => ({
            ...prevState,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            user: null,
          }));
        }
      } else {
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      }
    };

    loadUser();
  }, [state.token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      setState((prevState) => ({
        ...prevState,
        token: res.data.token,
        isAuthenticated: true,
        user: res.data.user,
      }));
    } catch (err) {
      localStorage.removeItem('token');
      setState((prevState) => ({
        ...prevState,
        token: null,
        isAuthenticated: false,
        user: null,
      }));
      throw err;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { username, email, password });
      localStorage.setItem('token', res.data.token);
      setState((prevState) => ({
        ...prevState,
        token: res.data.token,
        isAuthenticated: true,
        user: res.data.user,
      }));
    } catch (err) {
      localStorage.removeItem('token');
      setState((prevState) => ({
        ...prevState,
        token: null,
        isAuthenticated: false,
        user: null,
      }));
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setState((prevState) => ({
      ...prevState,
      token: null,
      isAuthenticated: false,
      user: null,
    }));
  };

  // ✅ Full updateUser function with backend integration
  const updateUser = async (updatedUser: Partial<User>) => {
    if (!state.token) {
      throw new Error('Not authenticated');
    }

    try {
      const res = await axios.patch(
        `${API_URL}/users/me`,
        updatedUser,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state.token}`,
          },
        }
      );

      setState((prevState) => ({
        ...prevState,
        user: res.data, // Update with the fresh user data from backend
      }));
    } catch (err) {
      console.error('Failed to update user:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser, // ✅ added to context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
