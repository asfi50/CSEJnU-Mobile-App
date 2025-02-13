import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { AUTH_URL } from "@/config";
import { isTokenExpired } from '@/utils/jwt';
import { authService } from '@/services/auth.service';

interface AuthContextProps {
  isLoggedIn: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  login: (username: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
  user: UserData | null;
  token: string | null;
  checkTokenExpiration: () => boolean;
}

interface UserData {
  name: string;
  email: string;
}

const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  isLoading: false,
  isInitializing: true,
  login: async () => false,
  logout: () => {},
  user: null,
  token: null,
  checkTokenExpiration: () => false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    checkLoginStatus();
  }, [token]);

  const checkLoginStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        if (isTokenExpired(storedToken)) {
          await logout();
          Toast.show({
            type: 'info',
            text1: 'Session Expired',
            text2: 'Please login again',
          });
        } else {
          setToken(storedToken);
          const userData = await AsyncStorage.getItem('userData');
          if (userData) {
            setUser(JSON.parse(userData));
            setIsLoggedIn(true);
          }
        }
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const login = async (username: string, password: string, rememberMe: boolean) => {
    setIsLoading(true);
    try {
      const data = await authService.login(username, password, rememberMe);

      if (data.success && data.token) {
        setToken(data.token);
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        setUser(data.user);
        setIsLoggedIn(true);
        
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: `Welcome back, ${data.user.name}!`,
          position: 'top',
          visibilityTime: 2000,
        });
        
        return true;
      }
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: 'Invalid credentials',
      });
      return false;
    } catch (error) {
      console.error('Login error:', error);
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: 'Network or server error occurred',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      setIsLoggedIn(false);
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userData');
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'See you again!',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkTokenExpiration = () => {
    if (!token || (token && isTokenExpired(token))) {
      logout();
      Toast.show({
        type: 'info',
        text1: 'Session Expired',
        text2: 'Please login again',
      });
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      isLoading, 
      isInitializing, 
      login, 
      logout, 
      user, 
      token,
      checkTokenExpiration 
    }}>
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