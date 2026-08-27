import React, { createContext, useContext, useState } from 'react';

// Hardcoded demo credentials (Sprint 1 — no backend).
const VALID_EMAIL = 'demo@techshop.com';
const VALID_PASSWORD = 'password123';

const AuthContext = createContext(null);

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  // Returns true only on a genuinely valid login.
  function login(email, password) {
    // FIXED (BUG-002): reject empty fields.
    if (!email || !password) {
      setError('Email and password are required');
      setIsAuthenticated(false);
      return false;
    }
    if (!isValidEmail(email)) {
      setError('Enter a valid email address');
      setIsAuthenticated(false);
      return false;
    }
    // FIXED (BUG-003): reject wrong credentials instead of navigating anyway.
    if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
      setError('Invalid email or password');
      setIsAuthenticated(false);
      return false;
    }
    setError('');
    setIsAuthenticated(true);
    return true;
  }

  function logout() {
    setIsAuthenticated(false);
    setError('');
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, error, login, logout, VALID_EMAIL, VALID_PASSWORD }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
