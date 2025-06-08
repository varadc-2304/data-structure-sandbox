
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Check if the session is still valid (optional: add expiration check)
          setUser({
            id: parsedUser.id,
            email: parsedUser.email
          });
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signOut = async () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const setUserData = (userData: User | null) => {
    if (userData) {
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify({
        id: userData.id,
        email: userData.email,
        timestamp: new Date().getTime()
      }));
    }
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut,
        setUser: setUserData,
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
