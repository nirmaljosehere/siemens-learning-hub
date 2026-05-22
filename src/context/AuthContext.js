import React, { createContext, useContext, useState, useCallback } from 'react';

const AUTH_KEY = 'slh_auth';
const VALID_PASS = process.env.REACT_APP_LOGIN_PASS || 'siemens123';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === 'true');

  const login = useCallback((password) => {
    if (password === VALID_PASS) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      setAuthed(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  }, []);

  return (
    <AuthContext.Provider value={{ authed, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
