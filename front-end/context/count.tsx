"use client"
import React, { createContext, useContext, useState } from 'react';


const CountContext = createContext<any>(null);

export const CountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [count, setCount] = useState<any>(0)
  const value = {
    count,
    setCount
  }
  return <CountContext.Provider value={value}>{children}</CountContext.Provider>;
};

export const useCount = () => {
  const context = useContext(CountContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
