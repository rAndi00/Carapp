import React, { createContext, useState, ReactNode, useContext } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Dummy login function
  const login = async (email: string, password: string): Promise<boolean> => {
    if (email && password.length >= 6) {
      setUser({
        id: 1,
        name: "Demo User",
        email,
      });
      return true;
    }
    return false;
  };

  // Dummy register function
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    if (name && email && password.length >= 6) {
      setUser({
        id: 2,
        name,
        email,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
