'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    _id: string;
    name: string;
    mobile: string;
    role: 'farmer' | 'buyer';
    buyerType?: string;
    location?: {
        district: string;
        state: string;
    };
    trustScore: number;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Hydrate from localStorage
        const storedToken = localStorage.getItem('krishisetu_token');
        const storedUser = localStorage.getItem('krishisetu_user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('krishisetu_token', newToken);
        localStorage.setItem('krishisetu_user', JSON.stringify(newUser));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('krishisetu_token');
        localStorage.removeItem('krishisetu_user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
