import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email, password) => {
    const trimmedEmail = (email || '').trim();
    if (!trimmedEmail || !password) {
      return { success: false, error: 'Please enter your email address and password.' };
    }
    if (trimmedEmail !== 'guest@booknow.com' || password !== 'stay2026') {
      return { success: false, error: 'Incorrect email or password. Please try again.' };
    }
    setIsAuthenticated(true);
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
