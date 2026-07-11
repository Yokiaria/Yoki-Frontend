import { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';
import { Wallet, Bell } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { AnimatedCounter } from './AnimatedUI';

interface HeaderProps {
    user: UserProfile | null;
    walletBalance: number;
}

/** Konversi tanggal ISO ke label waktu relatif (misal: "5 menit lalu") */
function timeAgo(dateStr: string): string {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60_000);
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} jam lalu`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} hari lalu`;
}

export default function Header({
    user,
    walletBalance,
}: HeaderProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const activeTab = location.pathname === '/' ? 'home' : location.pathname.split('/')[1];

    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    const { notifications, unreadCount, markRead, markAllRead } = useNotifications(!!user);

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

    const formatCurrency = (val: number) => {
        return 'Rp ' + val.toLocaleString('id-ID');
    };
    const FormatCurrencyAnimated = ({ val }: { val: number }) => (
        <>Rp <AnimatedCounter targetValue={val} /></>
    );

    return (
        <header className="w-full sticky top-0 z-50 bg-white/90 dark:bg-[#031636]/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 shadow-sm text-[#031636] dark:text-white transition-all">
            <div className="flex justify-between items-center w-full px-4 md:px-8 max-w-7xl mx-auto h-20">
                {/* Brand */}
                <div
                    onClick={() => navigate('/')}
                    className="text-2xl font-black tracking-tighter text-[#031636] dark:text-[#d8e2ff] cursor-pointer hover:opacity-90 select-none font-h1 uppercase transition-all duration-200 hover:scale-105 active:scale-95"
                    id="header-brand"
                >
                    GRANDSTARIND
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-8">
                    <button
                        onClick={() => { navigate('/'); }}
                        className={`font-h2 text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer active:scale-95 pb-1 ${activeTab === 'home' || activeTab === 'search'
                            ? 'text-[#031636] border-b-2 border-[#031636] dark:text-[#d8e2ff] dark:border-[#d8e2ff]'
                            : 'text-gray-500 hover:text-[#031636] dark:text-gray-300 dark:hover:text-white'
                            }`}
                        id="nav-home"
                    >
                        Hotels
                    </button>

                    <button
                        onClick={() => navigate('/promosi')}
                        className={`font-h2 text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer active:scale-95 pb-1 ${activeTab === 'promosi'
                            ? 'text-[#031636] border-b-2 border-[#031636] dark:text-[#d8e2ff] dark:border-[#d8e2ff]'
                            : 'text-gray-500 hover:text-[#031636] dark:text-gray-300 dark:hover:text-white'
                            }`}
                        id="nav-transfers"
                    >
                        Promosi
                    </button>
                    <button
                        onClick={() => user ? navigate('/loyalty') : navigate('/login')}
                        className={`font-h2 text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer active:scale-95 pb-1 ${activeTab === 'loyalty'
                            ? 'text-[#031636] border-b-2 border-[#031636] dark:text-[#d8e2ff] dark:border-[#d8e2ff]'
                            : 'text-gray-500 hover:text-[#031636] dark:text-gray-300 dark:hover:text-white'
                            }`}
                        id="nav-loyalty"
                    >
                        Loyalty
                    </button>
                    <button
                        onClick={() => user ? navigate('/wallet') : navigate('/login')}
                        className={`font-h2 text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer active:scale-95 pb-1 ${activeTab === 'wallet'
                            ? 'text-[#031636] border-b-2 border-[#031636] dark:text-[#d8e2ff] dark:border-[#d8e2ff]'
                            : 'text-gray-500 hover:text-[#031636] dark:text-gray-300 dark:hover:text-white'
                            }`}
                        id="nav-wallet"
                    >
                        Star Wallet
                    </button>
                </nav>

                {/* Trailing Icons & Auth */}
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            {/* Wallet Balance Widget */}
                            <div
                                onClick={() => navigate('/wallet')}
                                className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${activeTab === 'wallet'
                                    ? 'bg-[#1a2b4c] text-white border-[#1a2b4c]'
                                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700'
                                    }`}
                                id="header-wallet-widget"
                            >
                                <Wallet className="w-4 h-4 text-[#fed023]" />
                                <span className="font-semibold"><FormatCurrencyAnimated val={walletBalance} /></span>
                            </div>

                            <button
                                onClick={() => navigate('/wallet')}
                                className="p-2 text-gray-600 dark:text-gray-200 hover:text-[#031636] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-all duration-200 sm:hidden hover:scale-110 active:scale-95"
                                title="Star Wallet"
                                id="btn-wallet-mobile"
                            >
                                <Wallet className="w-5 h-5" />
                            </button>

                            {/* ===== NOTIFICATION BELL ===== */}
                            <div ref={notifRef} className="relative">
                                <button
                                    onClick={() => setIsNotifOpen((v) => !v)}
                                    className="p-2 text-gray-600 dark:text-gray-200 hover:text-[#031636] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-all duration-200 relative hover:scale-110 active:scale-95"
                                    title="Notifikasi"
                                    id="btn-notifications"
                                >
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 rounded-full flex items-center justify-center px-1 text-[9px] font-black text-white leading-none shadow-sm animate-pulse">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* Dropdown Panel */}
                                {isNotifOpen && (
                                    <div className="absolute top-[calc(100%+8px)] right-0 w-80 bg-white dark:bg-[#1A2B4C] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                                        {/* Header */}
                                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <Bell className="w-4 h-4 text-[#031636] dark:text-white" />
                                                <h3 className="font-bold text-sm text-[#031636] dark:text-white">Notifikasi</h3>
                                                {unreadCount > 0 && (
                                                    <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
                                                        {unreadCount} Baru
                                                    </span>
                                                )}
                                            </div>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={markAllRead}
                                                    className="text-[10px] font-bold text-[#031636] dark:text-[#fed023] hover:underline cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                                                >
                                                    Tandai Semua Dibaca
                                                </button>
                                            )}
                                        </div>

                                        {/* List */}
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="py-10 text-center">
                                                    <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                    <p className="text-xs text-gray-400 font-medium">Belum ada notifikasi</p>
                                                </div>
                                            ) : (
                                                notifications.map((notif) => (
                                                    <div
                                                        key={notif.id}
                                                        onClick={() => markRead(notif.id)}
                                                        className={`px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors flex gap-3 ${!notif.isRead ? 'bg-blue-50/60 dark:bg-[#fed023]/5' : ''}`}
                                                    >
                                                        {/* Icon dot */}
                                                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.isRead ? 'bg-gray-300' : 'bg-blue-500'}`} />
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-xs font-bold leading-snug truncate ${notif.isRead ? 'text-gray-500 dark:text-gray-400' : 'text-[#031636] dark:text-white'}`}>
                                                                {notif.title}
                                                            </p>
                                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed line-clamp-2">
                                                                {notif.message}
                                                            </p>
                                                            <p className="text-[10px] text-gray-400 mt-1 font-medium">
                                                                {timeAgo(notif.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        {/* Footer */}
                                        {notifications.length > 0 && (
                                            <div className="px-4 py-2.5 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-gray-700 text-center">
                                                <p className="text-[10px] text-gray-400 font-medium">
                                                    Menampilkan {notifications.length} notifikasi terbaru
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {/* ===== END NOTIFICATION BELL ===== */}

                            {/* User Profile Avatar */}
                            <div
                                onClick={() => navigate('/dashboard')}
                                className="flex items-center space-x-2 cursor-pointer group transition-all duration-200 hover:scale-105 active:scale-95"
                                id="header-avatar-container"
                            >
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#fed023] bg-slate-700 flex items-center justify-center text-white font-bold text-sm transition-all duration-300 shadow-sm select-none">
                                    {user?.profileUrl ? (
                                        <img
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                            src={user.profileUrl}
                                        />
                                    ) : (
                                        <span>
                                            {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div className="hidden lg:flex flex-col text-left">
                                    <span className="text-xs font-semibold leading-tight">{user.name}</span>
                                    <span className={`text-[10px] font-medium uppercase ${(user?.loyaltyPoints || 0) >= 10000 ? 'text-blue-500 font-bold' : (user?.loyaltyPoints || 0) >= 5000 ? 'text-[#735c00] font-bold' : 'text-gray-400'}`}>
                                        {(user?.loyaltyPoints || 0) >= 10000 ? 'PLATINUM' : (user?.loyaltyPoints || 0) >= 5000 ? 'GOLD' : 'SILVER'}
                                    </span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => navigate('/login')}
                                className="px-4 py-2 text-sm font-bold text-[#031636] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                Masuk
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="px-4 py-2 text-sm font-bold bg-[#031636] text-white dark:bg-white dark:text-[#031636] hover:opacity-90 rounded-full shadow-sm transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                Daftar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
