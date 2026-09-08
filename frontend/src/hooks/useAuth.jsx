import { useState, useEffect, createContext, useContext } from 'react';
import { authApi } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('farmunity_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('farmunity_token'));

  const login = async (phone, password) => {
    const res = await authApi.login({ phone, password });
    const data = res.data;
    setToken(data.token);
    setUser(data);
    localStorage.setItem('farmunity_token', data.token);
    localStorage.setItem('farmunity_user', JSON.stringify(data));
    return data;
  };

  const registerFarmer = async (formData) => {
    const res = await authApi.registerFarmer(formData);
    const data = res.data;
    setToken(data.token);
    setUser(data);
    localStorage.setItem('farmunity_token', data.token);
    localStorage.setItem('farmunity_user', JSON.stringify(data));
    return data;
  };

  const registerBuyer = async (formData) => {
    const res = await authApi.registerBuyer(formData);
    const data = res.data;
    setToken(data.token);
    setUser(data);
    localStorage.setItem('farmunity_token', data.token);
    localStorage.setItem('farmunity_user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('farmunity_token');
    localStorage.removeItem('farmunity_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, registerFarmer, registerBuyer, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
