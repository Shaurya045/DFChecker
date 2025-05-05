import React from 'react';
import { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
    isLoggedIn: boolean;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            setIsLoggedIn(!!token);
        } catch (error) {
            // Handle error appropriately, e.g., show a message to the user
            console.error("Failed to check login status:", error);
            setIsLoggedIn(false); // important to set isLoggedIn to false on error
        }
    };

    const login = async (token: string) => {
        try {
            await AsyncStorage.setItem('token', token);
            setIsLoggedIn(true);
        } catch (error) {
            console.error("Login failed:", error); // Log the error
            throw error; // Re-throw the error so the caller can handle it
        }

    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            setIsLoggedIn(false);
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
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
