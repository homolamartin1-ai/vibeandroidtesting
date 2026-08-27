import React, { createContext, useContext, useState } from 'react';

// Hardcoded demo credentials (Sprint 1 — no backend).
const VALID_EMAIL = 'demo@techshop.com';
const VALID_PASSWORD = 'password123';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  // Returns true if login "succeeded" (per current app behaviour).
  function login(email, password) {
    // ─────────────────────────────────────────────────────────────
    // BUG-002: empty fields are accepted — there is no validation.
    // BUG-003: wrong credentials still navigate to the catalog.
    // The real requirement: reject empties AND wrong credentials.
    // Here we always authenticate, whatever the input.
    // ─────────────────────────────────────────────────────────────
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
