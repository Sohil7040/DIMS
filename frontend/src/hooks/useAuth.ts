import { useState, useEffect, createContext, useContext } from 'react';
import { User, AccessLevel } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: Record<string, User> = {
  'admin': {
    id: '1',
    username: 'admin',
    role: 'Admin',
    fullName: 'System Administrator',
    email: 'admin@company.com',
    lastLogin: new Date().toISOString()
  },
  'hr_manager': {
    id: '2',
    username: 'hr_manager',
    role: 'HR',
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    lastLogin: new Date().toISOString()
  },
  'finance_lead': {
    id: '3',
    username: 'finance_lead',
    role: 'Finance',
    fullName: 'Michael Chen',
    email: 'michael.chen@company.com',
    lastLogin: new Date().toISOString()
  },
  'legal_counsel': {
    id: '4',
    username: 'legal_counsel',
    role: 'Legal',
    fullName: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    lastLogin: new Date().toISOString()
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth
    const storedUser = localStorage.getItem('docai_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = MOCK_USERS[username];
    if (mockUser && password === 'password') {
      const updatedUser = { ...mockUser, lastLogin: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem('docai_user', JSON.stringify(updatedUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('docai_user');
  };

  return { user, login, logout, isLoading };
};

export { AuthContext };