import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextProps {
  isLoggedIn: boolean;
  login: (username: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
  user: UserData | null;
}

interface UserData {
  name: string;
  email: string;
}

const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  login: async () => false,
  logout: () => {},
  user: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          setUser(JSON.parse(userData));
          setIsLoggedIn(true);
        }
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const login = async (username: string, password: string, rememberMe: boolean) => {
    try {
      const response = await fetch('https://auth.itrrc.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, remember_me: rememberMe }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        setUser(data.user);
        setIsLoggedIn(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    setIsLoggedIn(false);
    setUser(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userData');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Test credentials for development
export const TEST_CREDENTIALS = {
  username: 'testuser',
  password: '123456',
};