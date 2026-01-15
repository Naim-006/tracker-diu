import { supabase } from './supabaseService';

/**
 * Input validation utilities for security
 */

export const validators = {
    /**
     * Validate email format and domain
     */
    email: (email: string): { valid: boolean; error?: string } => {
        if (!email || typeof email !== 'string') {
            return { valid: false, error: 'Email is required' };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { valid: false, error: 'Invalid email format' };
        }

        if (!email.endsWith('@diu.edu.bd')) {
            return { valid: false, error: 'Only @diu.edu.bd emails are allowed' };
        }

        return { valid: true };
    },

    /**
     * Validate student ID format (221-35-XXX)
     */
    studentId: (id: string): { valid: boolean; error?: string } => {
        if (!id || typeof id !== 'string') {
            return { valid: false, error: 'Student ID is required' };
        }

        const idRegex = /^\d{3}-\d{2}-\d{3}$/;
        if (!idRegex.test(id)) {
            return { valid: false, error: 'Invalid Student ID format (expected: XXX-XX-XXX)' };
        }

        return { valid: true };
    },

    /**
     * Validate password strength
     */
    password: (password: string): { valid: boolean; error?: string } => {
        if (!password || typeof password !== 'string') {
            return { valid: false, error: 'Password is required' };
        }

        if (password.length < 6) {
            return { valid: false, error: 'Password must be at least 6 characters' };
        }

        return { valid: true };
    },

    /**
     * Sanitize string input to prevent XSS
     */
    sanitizeString: (input: string): string => {
        if (!input || typeof input !== 'string') return '';

        return input
            .trim()
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .substring(0, 500); // Limit length
    },

    /**
     * Validate URL format
     */
    url: (url: string): { valid: boolean; error?: string } => {
        if (!url) return { valid: true }; // URLs are optional

        try {
            new URL(url);
            return { valid: true };
        } catch {
            return { valid: false, error: 'Invalid URL format' };
        }
    }
};

/**
 * Rate limiting helper using local storage
 */
export const rateLimiter = {
    /**
     * Check if action is rate limited
     * @param key - Unique key for the action
     * @param maxAttempts - Maximum attempts allowed
     * @param windowMs - Time window in milliseconds
     */
    check: (key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean => {
        const now = Date.now();
        const storageKey = `ratelimit_${key}`;

        try {
            const data = localStorage.getItem(storageKey);
            const attempts: number[] = data ? JSON.parse(data) : [];

            // Filter out old attempts outside the window
            const recentAttempts = attempts.filter(timestamp => now - timestamp < windowMs);

            if (recentAttempts.length >= maxAttempts) {
                return false; // Rate limited
            }

            // Add current attempt
            recentAttempts.push(now);
            localStorage.setItem(storageKey, JSON.stringify(recentAttempts));

            return true; // Not rate limited
        } catch {
            return true; // If localStorage fails, allow the action
        }
    },

    /**
     * Clear rate limit for a key
     */
    clear: (key: string): void => {
        try {
            localStorage.removeItem(`ratelimit_${key}`);
        } catch {
            // Ignore errors
        }
    }
};

/**
 * Debounce function for API calls
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if user has required permissions
 */
export const checkPermissions = async (requiredRole: 'admin' | 'user' = 'user'): Promise<boolean> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        if (requiredRole === 'admin') {
            const { data: profile } = await supabase
                .from('profiles')
                .select('is_approved')
                .eq('id', user.id)
                .single();

            return profile?.is_approved === true;
        }

        return true; // All authenticated users have 'user' role
    } catch {
        return false;
    }
};
