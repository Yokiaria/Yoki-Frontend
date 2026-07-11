import { useState, useEffect, useCallback, useRef } from 'react';
import { AppNotification } from '../types';
import { apiClient } from '../api/apiClient';

const POLL_INTERVAL_MS = 30_000; // polling setiap 30 detik

export function useNotifications(isLoggedIn: boolean) {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchNotifications = useCallback(async () => {
        if (!isLoggedIn) return;
        try {
            const data = await apiClient.get<AppNotification[]>('/notifications');
            setNotifications(Array.isArray(data) ? data : []);
        } catch {
            // Diam jika gagal (misalnya token kadaluarsa sudah ditangani global)
        }
    }, [isLoggedIn]);

    // Fetch awal + polling berkala
    useEffect(() => {
        if (!isLoggedIn) {
            setNotifications([]);
            return;
        }

        setIsLoading(true);
        fetchNotifications().finally(() => setIsLoading(false));

        intervalRef.current = setInterval(fetchNotifications, POLL_INTERVAL_MS);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isLoggedIn, fetchNotifications]);

    /** Jumlah notifikasi yang belum dibaca */
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    /** Tandai satu notifikasi sebagai dibaca (optimistic update) */
    const markRead = useCallback(async (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        );
        try {
            await apiClient.patch(`/notifications/${id}/read`);
        } catch {
            // Kembalikan jika gagal
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: false } : n)),
            );
        }
    }, []);

    /** Tandai semua notifikasi sebagai dibaca (optimistic update) */
    const markAllRead = useCallback(async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        try {
            await apiClient.patch('/notifications/read-all');
        } catch {
            // Re-fetch untuk sinkronisasi jika gagal
            fetchNotifications();
        }
    }, [fetchNotifications]);

    return {
        notifications,
        unreadCount,
        isLoading,
        markRead,
        markAllRead,
        refetch: fetchNotifications,
    };
}
