import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'owner' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: any) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock users for demo
  const mockUsers = [
    { id: '1', email: 'user@demo.com', password: 'password', name: 'John Doe', role: 'user' as const },
    { id: '2', email: 'owner@demo.com', password: 'password', name: 'Jane Smith', role: 'owner' as const },
    { id: '3', email: 'admin@demo.com', password: 'password', name: 'Admin User', role: 'admin' as const },
  ];

  useEffect(() => {
    // Check if user is already logged in (in real app, validate JWT)
    const storedUser = localStorage.getItem('quickcourt_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in real app, call API
    const mockUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (mockUser) {
      const { password: _, ...userWithoutPassword } = mockUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('quickcourt_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const signup = async (userData: any): Promise<boolean> => {
    // Mock signup - in real app, call API
    const newUser = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      role: userData.role,
      avatar: userData.avatar,
    };

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('quickcourt_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('quickcourt_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('quickcourt_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      signup,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};