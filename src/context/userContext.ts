import { createContext, useState, ReactNode, SetStateAction } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  permissions: string[];
  token: string;
  setToken: React.Dispatch<SetStateAction<string>>;
  setIsAuthenticated: React.Dispatch<SetStateAction<boolean>>;
  typeOfUser: string;
  userId: string;
  userName: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);