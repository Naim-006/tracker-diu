import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, supabaseService } from './supabaseService';
import { UserProfile } from './types';

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    isLoading: boolean;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadProfile = async (userId: string) => {
        try {
            console.log('[AuthProvider] Loading profile for:', userId);
            const data = await supabaseService.getProfile(userId);
            console.log('[AuthProvider] Profile loaded:', data);
            setProfile(data);
        } catch (error) {
            console.error('[AuthProvider] Failed to load profile:', error);
        }
    };

    useEffect(() => {
        console.log('[AuthProvider] Initializing...');

        // Safety timeout: stop loading after 10 seconds no matter what
        const timeout = setTimeout(() => {
            console.warn('[AuthProvider] Loading timeout reached.');
            setIsLoading(false);
        }, 10000);

        // Check active sessions
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log('[AuthProvider] Initial session:', session?.user?.email);
            setUser(session?.user ?? null);
            if (session?.user) {
                loadProfile(session.user.id).finally(() => {
                    clearTimeout(timeout);
                    setIsLoading(false);
                });
            } else {
                clearTimeout(timeout);
                setIsLoading(false);
            }
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('[AuthProvider] Auth Event:', event, session?.user?.email);
            setUser(session?.user ?? null);

            if (session?.user) {
                setIsLoading(true);
                await loadProfile(session.user.id);
                setIsLoading(false);
            } else {
                setProfile(null);
                setIsLoading(false);
            }
        });

        return () => {
            clearTimeout(timeout);
            subscription.unsubscribe();
        };
    }, []);

    const refreshProfile = async () => {
        if (user) {
            await loadProfile(user.id);
        }
    };

    return (
        <AuthContext.Provider value={{ user, profile, isLoading, refreshProfile }}>
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
