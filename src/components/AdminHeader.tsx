import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';

interface HeaderProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
}

/** Konversi tanggal ISO ke label waktu relatif */
function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;
  return `${Math.floor(diffHours / 24)} hari lalu`;
}

/** Icon mapping berdasarkan kata kunci judul notifikasi */
function getNotifIcon(title: string): string {
  if (title.includes('Reservasi') || title.includes('Pemesanan')) return 'shopping_cart';
  if (title.includes('Check-In') || title.includes('check-in')) return 'key';
  if (title.includes('Selesai') || title.includes('selesai')) return 'check_circle';
  return 'notifications';
}

function getNotifColor(title: string): string {
  if (title.includes('Reservasi') || title.includes('Pemesanan')) return 'bg-green-100 dark:bg-green-900/40 text-green-600';
  if (title.includes('Check-In') || title.includes('check-in')) return 'bg-blue-100 dark:bg-blue-900/40 text-blue-600';
  if (title.includes('Selesai')) return 'bg-purple-100 dark:bg-purple-900/40 text-purple-600';
  return 'bg-slate-100 dark:bg-slate-700 text-slate-500';
}

export default function AdminHeader({
  onToggleSidebar,
  searchQuery,
  setSearchQuery,
  placeholder = 'Search...'
}: HeaderProps) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Admin selalu login (hanya ditampilkan jika user.role === 'admin')
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications(true);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center flex-1">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden mr-4"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="relative w-full max-w-md hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all text-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* ===== NOTIFICATION BELL ===== */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotifOpen((v) => !v)}
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 relative focus:outline-none transition-colors"
            title="Notifikasi"
          >
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 rounded-full flex items-center justify-center px-1 text-[9px] font-black text-white leading-none border-2 border-white dark:border-slate-900 animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {isNotifOpen && (
            <div className="absolute top-[calc(100%+8px)] right-0 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
              {/* Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Notifikasi</h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
                      {unreadCount} Baru
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] font-bold text-primary-600 hover:text-primary-700 hover:underline cursor-pointer"
                  >
                    Tandai semua dibaca
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center">
                    <span className="material-symbols-outlined text-3xl text-slate-300 block mb-2">notifications_off</span>
                    <p className="text-xs text-slate-400 font-medium">Belum ada notifikasi</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markRead(notif.id)}
                      className={`p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors flex gap-3 ${!notif.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getNotifColor(notif.title)}`}>
                        <span className="material-symbols-outlined text-sm">{getNotifIcon(notif.title)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold leading-snug ${notif.isRead ? 'text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">{timeAgo(notif.createdAt)}</p>
                      </div>
                      {!notif.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 text-center">
                  <p className="text-[10px] text-slate-400">
                    Menampilkan {notifications.length} notifikasi terbaru
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        {/* ===== END NOTIFICATION BELL ===== */}

        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-sm cursor-pointer border-2 border-white dark:border-slate-800">
          A
        </div>
      </div>
    </header>
  );
}
