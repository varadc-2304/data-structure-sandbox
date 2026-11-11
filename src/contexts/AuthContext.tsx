
import React, { createContext, useContext, ReactNode } from 'react';

type AuthUser = {
  id: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // No authentication required - app is free for all
  const user: AuthUser | null = null;
  const loading = false;

  const signOut = async () => {
    // No-op since there's no authentication
  };

  const setUser = (_userData: AuthUser | null) => {
    // No-op since there's no authentication
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
