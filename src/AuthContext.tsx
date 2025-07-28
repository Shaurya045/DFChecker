import React from 'react';
import {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  isLoggedIn: boolean;
  isDoctor: boolean;
  login: (token: string, isDoctor: boolean) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('token');
    const doctorStatus = await AsyncStorage.getItem('isDoctor');
    setIsLoggedIn(!!token);
    setIsDoctor(doctorStatus === 'true');
  };

  const login = async (token: string, isDoctor: boolean) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('isDoctor', isDoctor.toString());
    setIsLoggedIn(true);
    setIsDoctor(isDoctor);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('isDoctor');
    setIsLoggedIn(false);
    setIsDoctor(false);
  };

  return (
    <AuthContext.Provider value={{isLoggedIn, isDoctor, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
