"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { verifyJwtToken } from '@/lib/auth';

interface AuthContextType {
  auth: any;
  setAuthWithToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<any>(null);

  const setAuthWithToken = async () => {
    const cookies = new Cookies();
    const token = cookies.get('token') ?? null;
    const verifiedToken = await verifyJwtToken(token);
    setAuth(verifiedToken);
  };

  useEffect(() => {
    setAuthWithToken();
  }, []); // Run only once when component mounts

  const contextValue = { auth, setAuthWithToken };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
