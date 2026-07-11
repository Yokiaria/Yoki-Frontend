import { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { apiClient } from '../api/apiClient';

export function useAuth(triggerToast: (msg: string, type: 'success' | 'error') => void) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    // Initial fetch user
    useEffect(() => {
        const fetchUser = async () => {
            if (localStorage.getItem('gsi_token')) {
                try {
                    const userData: any = await apiClient.get('/auth/profile');
                    setUser({
                        ...userData,
                        balance: userData.balance ? Number(userData.balance) : 0,
                    });
                } catch (err) {
                    console.error("Session expired atau invalid");
                    localStorage.removeItem('gsi_token');
                    localStorage.removeItem('gsi_user');
                }
            }
            setIsAuthLoading(false);
        };
        fetchUser();
    }, []);

    // Global 401 Unauthorized Listener
    useEffect(() => {
        const handleUnauthorized = () => {
            localStorage.removeItem('gsi_token');
            localStorage.removeItem('gsi_user');
            sessionStorage.clear();
            setUser(null);
            triggerToast('Sesi Anda telah berakhir. Silakan login kembali.', 'error');
            window.location.href = '/login';
        };

        window.addEventListener('auth-unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
    }, [triggerToast]);

    return { user, setUser, isAuthLoading };
}
