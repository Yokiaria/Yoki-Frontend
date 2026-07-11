import React, { useState, useEffect } from 'react';
import { Booking, UserProfile } from '../types';
import { useNavigate } from 'react-router-dom';
import { Ticket, History, Crown, Hotel as HotelIcon, CreditCard, ChevronRight, LogOut, CheckCircle, Clock, Search, Briefcase, Star, MapPin, Award, User, Mail, Phone, QrCode, X, Camera } from 'lucide-react';
import { AnimatedCounter } from './AnimatedUI';
import { apiClient } from '../api/apiClient';

interface DashboardProps {
    user: UserProfile;
    setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
    bookings: Booking[];
    setSelectedHotelId: (id: string) => void;
    onSuccessToast: (msg: string) => void;
}

export default function Dashboard({
    user,
    setUser,
    bookings,
    setSelectedHotelId,
    onSuccessToast,
}: DashboardProps) {
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [name, setName] = useState(user.name);
    const [dashboardBookings, setDashboardBookings] = useState<Booking[]>([]);
    const [isLoadingBookings, setIsLoadingBookings] = useState(true);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [profileFeedback, setProfileFeedback] = useState({ type: '', message: '' });

    // Avatar State
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [pendingAvatarUrl, setPendingAvatarUrl] = useState<string | null>(null);
    const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

    const DEFAULT_AVATARS = [
        'https://api.dicebear.com/9.x/bottts/svg?seed=Felix',
        'https://api.dicebear.com/9.x/micah/svg?seed=Aneka',
        'https://api.dicebear.com/9.x/notionists/svg?seed=Mimi',
        'https://api.dicebear.com/9.x/adventurer/svg?seed=Jack',
        'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Sarah',
        'https://api.dicebear.com/9.x/lorelei/svg?seed=Jasmine'
    ];

    // Password State
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordFeedback, setPasswordFeedback] = useState({ type: '', message: '' });

    const [selectedTicketBooking, setSelectedTicketBooking] = useState<Booking | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchUserData = async () => {
            try {
                const userData: any = await apiClient.get('/auth/profile');
                if (isMounted && userData) {
                    setUser((prevUser) => ({
                        ...(prevUser || {} as UserProfile),
                        ...userData,
                        balance: userData.balance ? Number(userData.balance) : 0,
                    }));
                }
            } catch (err) {
                console.error('Gagal mengambil data profil terbaru', err);
            }
        };

        const fetchMyBookings = async () => {
            try {
                const data = await apiClient.get<Booking[]>('/bookings');
                if (isMounted) {
                    setDashboardBookings(Array.isArray(data) ? data : []);
                }
            } catch (err: any) {
                console.error('Gagal mengambil data pesanan', err);
                // toast error could be added if needed
            } finally {
                if (isMounted) {
                    setIsLoadingBookings(false);
                }
            }
        };

        fetchUserData();
        fetchMyBookings();

        return () => {
            isMounted = false;
        };
    }, []);

    const formatCurrency = (val: number) => {
        return 'Rp ' + val.toLocaleString('id-ID');
    };

    const formatDateForVoucher = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatDateIndo = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedUser = await apiClient.put<UserProfile>('/users/me', { name, email, phone });
            setUser({ ...user, name: updatedUser.name || name, email: updatedUser.email || email, phone: updatedUser.phone || phone });
            onSuccessToast('Profil Anda berhasil diperbarui!');
        } catch (err: any) {
            console.error(err);
            alert(err.message || 'Gagal memperbarui profil.');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 1024 * 1024) {
            alert('Ukuran foto terlalu besar. Maksimal 1MB.');
            return;
        }

        setIsUpdatingAvatar(true);
        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;
                const updatedUser = await apiClient.put<UserProfile>('/users/me', { profilePicture: base64String });
                
                const newProfileUrl = updatedUser.profileUrl || base64String;
                setUser({ ...user, profileUrl: newProfileUrl });
                setPendingAvatarUrl(newProfileUrl);
                
                onSuccessToast('Foto profil berhasil diunggah!');
                setShowAvatarModal(false);
            };
            reader.readAsDataURL(file);
        } catch (error: any) {
            console.error('Gagal mengupload foto:', error);
            alert(error.message || 'Terjadi kesalahan saat mengunggah foto.');
        } finally {
            setIsUpdatingAvatar(false);
        }
    };

    const handleSaveAvatar = async () => {
        if (!pendingAvatarUrl) return;
        
        setIsUpdatingAvatar(true);
        try {
            const updatedUser = await apiClient.put<UserProfile>('/users/me', { profilePicture: pendingAvatarUrl });
            setUser({ ...user, profileUrl: updatedUser.profileUrl || pendingAvatarUrl });
            
            onSuccessToast('Avatar profil berhasil diperbarui!');
            setShowAvatarModal(false);
        } catch (error: any) {
            console.error('Gagal menyimpan avatar:', error);
            alert(error.message || 'Terjadi kesalahan saat menyimpan avatar.');
        } finally {
            setIsUpdatingAvatar(false);
        }
    };

    const navigate = useNavigate();

    const handleTulisReview = (hotelId?: string) => {
        if (!hotelId) return;
        setSelectedHotelId(hotelId);
        navigate(`/review/${hotelId}`);
    };

    const handleLanjutkanPembayaran = (booking: any) => {
        const checkIn = new Date(booking.checkInDate || booking.checkIn);
        const checkOut = new Date(booking.checkOutDate || booking.checkOut);
        const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));

        navigate('/booking-confirmation', {
            state: {
                bookingCode: booking.bookingCode || booking.id,
                hotelName: booking.hotel?.name || 'Hotel',
                hotelAddress: booking.hotel?.address || '',
                roomTypeName: booking.roomType?.name || booking.roomTypeName || 'Kamar',
                checkInDate: booking.checkInDate || booking.checkIn,
                checkOutDate: booking.checkOutDate || booking.checkOut,
                nights: nights,
                guestsText: booking.guestsText || '1 Tamu',
                totalPrice: booking.totalPrice || 0,
                paymentMethod: booking.paymentMethod || 'transfer',
                status: booking.status,
                holdExpiresAt: booking.holdExpiresAt || null,
            }
        });
    };

    const handleCheckIn = (hotelId: string) => {
        setSelectedHotelId(hotelId);
        navigate(`/checkin/${hotelId}`);
    };

    const handleClaimKamar = async (bookingId: string) => {
        try {
            await apiClient.patch(`/bookings/checkin/${bookingId}`);
            setDashboardBookings(prev =>
                prev.map(b => b.id === bookingId ? { ...b, status: 'check_in' as const } : b)
            );
            onSuccessToast('Berhasil Check-In! Selamat beristirahat.');
        } catch (error) {
            console.error(error);
            alert('Gagal klaim kamar.');
        }
    };

    const handleCheckoutMandiri = async (bookingId: string) => {
        if (!window.confirm("Apakah Anda yakin ingin Check-out dari kamar sekarang?")) return;
        
        try {
            await apiClient.patch('/bookings/' + bookingId + '/checkout');
            setDashboardBookings(prev =>
                prev.map(b => b.id === bookingId ? { ...b, status: 'selesai' as any } : b)
            );
            alert("Terima kasih telah menginap di Grandstarind! Kamar Anda berhasil dikosongkan.");
        } catch (error: any) {
            console.error("Gagal melakukan check-out", error);
            alert(error.response?.data?.message || "Gagal melakukan check-out. Silakan coba lagi.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('gsi_token');
        localStorage.removeItem('gsi_user');
        sessionStorage.clear();
        window.location.href = '/login';
    };

    return (
        <>
            <main
                className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left font-sans flex-grow w-full"
                id="dashboard-container"
            >
                {/* Left Column: User Profile & Points Info (4 Columns) */}
                <aside className="lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-[#1A2B4C] rounded-[24px] border border-gray-150 dark:border-gray-800 p-6 shadow-sm">
                        <div className="flex flex-col items-center text-center pb-6 border-b border-gray-150 dark:border-gray-800/80">
                            <div 
                              onClick={() => {
                                  setPendingAvatarUrl(user?.profileUrl || null);
                                  setShowAvatarModal(true);
                              }} 
                              className="relative group w-24 h-24 rounded-full overflow-hidden cursor-pointer bg-[#1A2B4C] dark:bg-slate-700 flex items-center justify-center border-4 border-gray-50 dark:border-gray-800 shadow-sm mx-auto mb-4 transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                              {user?.profileUrl ? (
                                <img src={user.profileUrl} alt={name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-white font-bold text-2xl">
                                    {name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                </span>
                              )}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                                <Camera className="w-6 h-6 text-white transition-all duration-200 group-hover:scale-110" />
                              </div>
                            </div>
                            <h2 className="font-h2 text-xl font-bold text-[#031636] dark:text-white mb-1">{user.name}</h2>
                            {(() => {
                                const pts = user?.loyaltyPoints || 0;
                                const computedTier = pts >= 10000 ? 'PLATINUM' : pts >= 5000 ? 'GOLD' : 'SILVER';
                                const badgeStyle = pts >= 10000 
                                    ? 'bg-gradient-to-r from-slate-200 via-white to-slate-200 text-slate-700 border border-slate-300 shadow-sm'
                                    : pts >= 5000 
                                    ? 'bg-[#FEF9E7] text-[#735c00] border border-[#fed023]/30'
                                    : 'bg-gray-100 text-gray-700 border border-gray-200';
                                
                                return (
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-label-caps text-[10px] font-bold uppercase select-none transition-all ${badgeStyle}`}>
                                        <Award className={`w-3.5 h-3.5 ${pts >= 10000 ? 'text-slate-500' : pts >= 5000 ? 'text-[#735c00]' : 'text-gray-500'}`} /> {computedTier}
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Loyalty Points Tracking */}
                        {(() => {
                            const points = user.loyaltyPoints || 0;
                            let nextTierPoints = 501;
                            let maxPoints = 500;
                            let nextTierName = 'Silver';
                            
                            if (points >= 3001) {
                                nextTierPoints = 0;
                                maxPoints = points;
                                nextTierName = '';
                            } else if (points >= 1501) {
                                nextTierPoints = 3001 - points;
                                maxPoints = 3000;
                                nextTierName = 'Platinum';
                            } else if (points >= 501) {
                                nextTierPoints = 1501 - points;
                                maxPoints = 1500;
                                nextTierName = 'Gold';
                            } else {
                                nextTierPoints = 501 - points;
                                maxPoints = 500;
                                nextTierName = 'Silver';
                            }

                            const progressPercentage = points >= 3001 ? 100 : Math.min(100, Math.max(0, (points / maxPoints) * 100));

                            return (
                                <div className="py-6 border-b border-gray-150 dark:border-gray-800/80">
                                    <div className="flex justify-between items-baseline mb-3">
                                        <span className="font-label-caps text-[10px] font-bold text-gray-400 uppercase">GrandStar Poin</span>
                                        <span className="font-price-display text-lg text-[#735c00] dark:text-[#fed023] font-black">
                                            {points.toLocaleString('id-ID')} Poin
                                        </span>
                                    </div>
                                    {/* Loyalty points slider scale */}
                                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-2">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#735c00] to-[#fed023] rounded-full"
                                            style={{ width: `${progressPercentage}%` }}
                                        ></div>
                                    </div>
                                    {points >= 3001 ? (
                                        <p className="font-body-md text-[10.5px] font-semibold text-gray-400">
                                            Anda berada di tingkat <span className="font-bold text-[#031636] dark:text-[#fed023]">Platinum Member</span> (Level Tertinggi).
                                        </p>
                                    ) : (
                                        <p className="font-body-md text-[10.5px] font-semibold text-gray-400">
                                            Kumpulkan {nextTierPoints.toLocaleString('id-ID')} poin lagi untuk melaju ke tingkat <span className="font-bold text-[#031636] dark:text-[#fed023]">{nextTierName} Member</span>.
                                        </p>
                                    )}
                                </div>
                            );
                        })()}

                        {/* Edit Profile Form Inputs */}
                        <form onSubmit={handleUpdateProfile} className="pt-6 space-y-4 text-left">
                            <h3 className="font-h2 text-sm font-bold text-[#031636] dark:text-white uppercase tracking-wider mb-2">
                                Edit Rincian Profil
                            </h3>
                            <div className="flex flex-col gap-1.5">
                                <label className="font-label-caps text-[9px] uppercase font-bold text-gray-400">NAMA LENGKAP</label>
                                <div className="relative">
                                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-xl font-body-md text-xs text-[#031636] dark:text-white focus:outline-none"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="font-label-caps text-[9px] uppercase font-bold text-gray-400">ALAMAT EMAIL</label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="email"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-xl font-body-md text-xs text-[#031636] dark:text-white focus:outline-none"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="font-label-caps text-[9px] uppercase font-bold text-gray-400">NO. HANDPHONE</label>
                                <div className="relative">
                                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="tel"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-xl font-body-md text-xs text-[#031636] dark:text-white focus:outline-none"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#1A2B4C] hover:bg-[#031636] dark:bg-[#fed023] dark:hover:bg-[#eec209] text-white dark:text-[#031636] py-2.5 rounded-xl text-xs font-bold font-label-caps tracking-wider transition-all duration-200 cursor-pointer uppercase mt-2 hover:shadow-md hover:scale-105 active:scale-95"
                            >
                                Update Profil
                            </button>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 py-2.5 rounded-xl text-xs font-bold font-label-caps tracking-wider transition-all duration-200 cursor-pointer uppercase mt-2 flex items-center justify-center gap-2 hover:shadow-md border border-red-100 dark:border-red-900/30 hover:scale-105 active:scale-95"
                            >
                                <LogOut className="w-4 h-4" /> Keluar Akun
                            </button>
                        </form>
                    </div>
                </aside>

                {/* Right Column: Bookings History (8 Columns) */}
                <section className="lg:col-span-8 space-y-6">
                    <div>
                        <h1 className="font-h1 text-xl md:text-2xl font-bold text-[#031636] dark:text-white uppercase tracking-tight">
                            Pesanan Saya
                        </h1>
                        <p className="font-body-md text-sm text-gray-400 dark:text-gray-300">
                            Berikut adalah riwayat menginap dan pesanan aktif Anda.
                        </p>
                    </div>

                    {isLoadingBookings ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#031636] dark:border-white"></div>
                        </div>
                    ) : dashboardBookings.length > 0 ? (
                        <div className="space-y-6">
                            {dashboardBookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="bg-white dark:bg-[#1A2B4C] rounded-[24px] border border-gray-150 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col md:flex-row group transition-all duration-300 hover:shadow-md"
                                >
                                    {/* Image */}
                                    <div className="relative w-full md:w-[240px] h-[180px] md:h-auto shrink-0 select-none">
                                        <img
                                            alt={booking.hotel?.name || booking.hotelName}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            src={booking.hotel?.images?.[0]?.url || booking.hotelImage || 'https://via.placeholder.com/400x300?text=No+Image'}
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span
                                                className={`font-label-caps text-[9px] font-bold px-3 py-1.5 rounded-full shadow-sm text-white select-none ${
                                                    (() => {
                                                        const s = String(booking.status).toLowerCase();
                                                        if (s === 'confirmed') return 'bg-[#00a858]';
                                                        if (s === 'tentative') return 'bg-amber-500';
                                                        if (s === 'check_in') return 'bg-emerald-600';
                                                        if (s === 'selesai') return 'bg-blue-500';
                                                        return 'bg-gray-400';
                                                    })()
                                                }`}
                                            >
                                                {(() => {
                                                    const s = String(booking.status).toLowerCase();
                                                    if (s === 'confirmed') return 'Terkonfirmasi';
                                                    if (s === 'tentative') return 'Menunggu Bayar';
                                                    if (s === 'check_in') return 'Check-In';
                                                    if (s === 'selesai') return 'Selesai';
                                                    return 'Dibatalkan';
                                                })()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="p-6 flex flex-col flex-grow justify-between">
                                        <div>
                                            <div className="flex justify-between items-start gap-4 mb-1">
                                                <h3 className="font-h2 text-base md:text-lg font-bold text-[#031636] dark:text-white leading-tight">
                                                    {booking.hotel?.name || booking.hotelName}
                                                </h3>
                                                <span className="font-mono text-[10px] text-gray-400 font-semibold uppercase">
                                                    {booking.bookingCode || booking.id}
                                                </span>
                                            </div>
                                            <>
                                                    <div className="flex items-center text-[#fed023] space-x-0.5 mb-3">
                                                        {[...Array(booking.stars || 5)].map((_, i) => (
                                                            <Star key={i} className="w-3.5 h-3.5 fill-[#fed023] stroke-none" />
                                                        ))}
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-b border-gray-50 dark:border-gray-800/50 py-3 mb-4 text-xs font-body-md text-gray-500 dark:text-gray-300">
                                                        <div>
                                                            <span className="text-gray-400 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Check-in</span>
                                                            <span className="font-bold text-gray-800 dark:text-gray-100">{formatDateIndo(booking.checkInDate)}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-400 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Check-out</span>
                                                            <span className="font-bold text-gray-800 dark:text-gray-100">{formatDateIndo(booking.checkOutDate)}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-400 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Tamu</span>
                                                            <span className="font-semibold text-gray-800 dark:text-gray-100">{booking.guestsText}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-400 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Total Biaya</span>
                                                            <span className="font-extrabold text-[#00a858]">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(booking.totalPrice)}</span>
                                                        </div>
                                                    </div>
                                                </>
                                        </div>

                                        {/* Actions Row */}
                                        <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
                                            <>
                                                    {String(booking.status).toLowerCase() === 'tentative' && (
                                                        (() => {
                                                            const isExpired = booking.holdExpiresAt && new Date(booking.holdExpiresAt).getTime() <= Date.now();
                                                            
                                                            if (isExpired) {
                                                                return (
                                                                    <button
                                                                        disabled
                                                                        className="bg-gray-400 text-white text-xs font-bold py-2 px-4 rounded-full font-label-caps uppercase tracking-wide cursor-not-allowed shadow-sm"
                                                                    >
                                                                        Sesi Pembayaran Berakhir
                                                                    </button>
                                                                );
                                                            }

                                                            return (
                                                                <button
                                                                    onClick={() => handleLanjutkanPembayaran(booking)}
                                                                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 px-4 rounded-full font-label-caps uppercase tracking-wide transition-all duration-200 cursor-pointer active:scale-95 hover:scale-105 shadow-sm"
                                                                >
                                                                    Bayar Sekarang
                                                                </button>
                                                            );
                                                        })()
                                                    )}
                                                    {['selesai', 'confirmed', 'check_in'].includes(String(booking.status).toLowerCase()) && (
                                                        <button
                                                            onClick={() => handleTulisReview(booking.hotelId)}
                                                            className="border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold py-2 px-4 rounded-full font-label-caps uppercase tracking-wide transition-all duration-200 cursor-pointer active:scale-95 hover:scale-105"
                                                        >
                                                            Tulis Review
                                                        </button>
                                                    )}
                                                    {(String(booking.status).toLowerCase() === 'confirmed') && (
                                                        <button
                                                            onClick={() => handleClaimKamar(booking.id)}
                                                            className="bg-secondary hover:bg-secondary/90 text-white text-xs font-bold py-2 px-4 rounded-full font-label-caps uppercase tracking-wide transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                                                        >
                                                            KLAIM KAMAR
                                                        </button>
                                                    )}
                                                    {booking.status === 'check_in' && (
                                                        <>
                                                            <button
                                                                onClick={() => setSelectedTicketBooking(booking)}
                                                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-4 rounded-full font-label-caps uppercase tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-1.5 active:scale-95 hover:scale-105 shadow-sm"
                                                            >
                                                                <QrCode className="w-3.5 h-3.5" /> LIHAT TIKET DIGITAL
                                                            </button>
                                                            <button
                                                                onClick={() => handleCheckoutMandiri(booking.id)}
                                                                className="border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs font-bold py-2 px-4 rounded-full font-label-caps uppercase tracking-wide transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                                                            >
                                                                CHECK-OUT
                                                            </button>
                                                        </>
                                                    )}
                                                </>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-[#1A2B4C] rounded-[24px] border border-gray-150 dark:border-gray-800 p-12 text-center">
                            <p className="font-body-lg text-gray-400 mb-4 font-medium">Anda belum memiliki riwayat pemesanan aktif.</p>
                            <button
                                onClick={() => navigate('/')}
                                className="bg-[#1A2B4C] hover:bg-[#031636] text-white px-6 py-3 rounded-full font-bold font-label-caps uppercase tracking-wider text-xs transition-all duration-200 active:scale-95 hover:scale-105"
                            >
                                Cari Hotel Sekarang
                            </button>
                        </div>
                    )}
                </section>
            </main>

            {/* ===== MODAL E-VOUCHER / TIKET DIGITAL ===== */}
            {selectedTicketBooking && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    onClick={() => setSelectedTicketBooking(null)}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                    {/* Card */}
                    <div
                        className="relative z-10 w-full max-w-sm bg-white dark:bg-[#1A2B4C] rounded-3xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Strip */}
                        <div className="bg-gradient-to-r from-[#031636] to-[#1A2B4C] px-6 py-5 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#fed023] mb-1">E-Voucher Check-In</p>
                                    <h2 className="font-black text-lg leading-tight">GRANDSTARIND</h2>
                                </div>
                                <button
                                    onClick={() => setSelectedTicketBooking(null)}
                                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Dashed divider with circles */}
                        <div className="relative flex items-center px-4">
                            <div className="absolute -left-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-[#0d1e38]" />
                            <div className="flex-1 border-t-2 border-dashed border-gray-200 dark:border-gray-700 mx-4" />
                            <div className="absolute -right-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-[#0d1e38]" />
                        </div>

                        {/* Body */}
                        <div className="px-6 py-5 space-y-4">
                            {/* Guest info */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Nama Tamu</p>
                                    <p className="font-bold text-[#031636] dark:text-white text-sm">{selectedTicketBooking.guestName || user.name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Kode Reservasi</p>
                                    <p className="font-mono font-bold text-[#031636] dark:text-white text-sm">{selectedTicketBooking.bookingCode || selectedTicketBooking.id.slice(0, 8).toUpperCase()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Check-In</p>
                                    <p className="font-bold text-[#031636] dark:text-white text-sm">{formatDateForVoucher(selectedTicketBooking.checkInDate)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Check-Out</p>
                                    <p className="font-bold text-[#031636] dark:text-white text-sm">{formatDateForVoucher(selectedTicketBooking.checkOutDate)}</p>
                                </div>
                            </div>

                            {/* Hotel name */}
                            <div className="bg-gray-50 dark:bg-white/5 rounded-2xl px-4 py-3">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Hotel</p>
                                <p className="font-extrabold text-[#031636] dark:text-white">{selectedTicketBooking.hotel?.name || selectedTicketBooking.hotelName}</p>
                            </div>

                            {/* QR Code */}
                            <div className="flex flex-col items-center gap-3 py-2">
                                <div className="p-3 bg-white rounded-2xl shadow-md border border-gray-100">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${selectedTicketBooking.bookingCode || selectedTicketBooking.id}&bgcolor=ffffff&color=031636&qzone=1`}
                                        alt="QR Code Check-in"
                                        className="w-40 h-40 block"
                                    />
                                </div>
                                <p className="text-[11px] font-mono text-gray-400 tracking-widest">{selectedTicketBooking.bookingCode || selectedTicketBooking.id.toUpperCase()}</p>
                            </div>

                            {/* Status badge */}
                            <div className="flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl py-3">
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                                    {String(selectedTicketBooking.status).toLowerCase() === 'confirmed' ? 'Siap Check-in / Terkonfirmasi' : 'Sedang Menginap'}
                                </span>
                            </div>

                            {/* Footer note */}
                            <p className="text-center text-[11px] text-gray-400 leading-relaxed">
                                Tunjukkan QR Code ini ke resepsionis saat tiba di hotel untuk verifikasi kunci kamar.
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {/* Avatar Selection Modal */}
            {showAvatarModal && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1A2B4C] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-h2 text-sm font-bold text-[#031636] dark:text-white uppercase tracking-wider">
                                Atur Foto Profil
                            </h3>
                            <button onClick={() => setShowAvatarModal(false)} className="text-gray-400 hover:text-red-500 transition-all duration-200 hover:scale-110 active:scale-95">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex justify-center">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 dark:border-gray-800 shadow-sm bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[#031636] dark:text-white font-bold text-3xl">
                                    {pendingAvatarUrl ? (
                                        <img src={pendingAvatarUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>
                                            {name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center justify-center w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 text-xs font-bold text-[#031636] dark:text-white text-center border-dashed">
                                    <Camera className="w-4 h-4 mr-2" /> Upload Foto (Maks 1MB)
                                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                                </label>
                            </div>

                            <div>
                                <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 text-center">Atau Pilih Avatar Favorit:</p>
                                <div className="flex gap-3 justify-center flex-wrap">
                                    {DEFAULT_AVATARS.map((url, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setPendingAvatarUrl(url)}
                                            className={`w-12 h-12 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 overflow-hidden border-2 shadow-sm ${pendingAvatarUrl === url ? 'border-[#fed023] scale-110' : 'border-transparent'}`}
                                        >
                                            <img src={url} alt={`Avatar ${idx}`} className="w-full h-full bg-blue-50 dark:bg-gray-700" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setPendingAvatarUrl('')}
                                className="w-full py-1.5 mt-2 text-[11px] font-bold text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 underline decoration-dotted underline-offset-4 transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                Hapus Foto & Gunakan Inisial
                            </button>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                            <button
                                onClick={() => setShowAvatarModal(false)}
                                disabled={isUpdatingAvatar}
                                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSaveAvatar}
                                disabled={isUpdatingAvatar}
                                className="flex-1 bg-[#1A2B4C] hover:bg-[#031636] dark:bg-[#fed023] dark:hover:bg-[#eec209] text-white dark:text-[#031636] py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-70 flex justify-center items-center gap-2"
                            >
                                {isUpdatingAvatar ? (
                                    <><div className="w-3.5 h-3.5 border-2 border-white dark:border-[#031636] border-t-transparent rounded-full animate-spin"></div> Menyimpan...</>
                                ) : 'Simpan Foto'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
