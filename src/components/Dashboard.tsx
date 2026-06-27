import React, { useState } from 'react';
import { ActiveTab, Booking, UserProfile } from '../types';
import { Star, MapPin, Award, CheckCircle, ChevronRight, User, Mail, Phone, ExternalLink, LogOut } from 'lucide-react';

interface DashboardProps {
    setActiveTab: (tab: ActiveTab) => void;
    user: UserProfile;
    setUser: (user: UserProfile | null) => void;
    bookings: Booking[];
    setSelectedHotelId: (id: string) => void;
    onSuccessToast: (msg: string) => void;
}

export default function Dashboard({
    setActiveTab,
    user,
    setUser,
    bookings,
    setSelectedHotelId,
    onSuccessToast,
}: DashboardProps) {
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [name, setName] = useState(user.name);

    const formatCurrency = (val: number) => {
        return 'Rp ' + val.toLocaleString('id-ID');
    };

    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setUser({
            ...user,
            name,
            email,
            phone,
        });
        onSuccessToast('Profil Anda berhasil diperbarui!');
    };

    const handleTulisReview = (hotelId: string) => {
        setSelectedHotelId(hotelId);
        setActiveTab('review');
    };

    const handleCheckIn = (hotelId: string) => {
        setSelectedHotelId(hotelId);
        setActiveTab('checkin');
    };

    const handleLogout = () => {
        setUser(null);
        setActiveTab('home');
        onSuccessToast('Anda berhasil keluar.');
    };

    return (
        <main
            className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left font-sans flex-grow w-full"
            id="dashboard-container"
        >
            {/* Left Column: User Profile & Points Info (4 Columns) */}
            <aside className="lg:col-span-4 space-y-6">
                <div className="bg-white dark:bg-[#1A2B4C] rounded-[24px] border border-gray-150 dark:border-gray-800 p-6 shadow-sm">
                    <div className="flex flex-col items-center text-center pb-6 border-b border-gray-150 dark:border-gray-800/80">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 shadow-sm relative mb-4">
                            <img
                                alt={user.name}
                                className="w-full h-full object-cover select-none"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhs5gR4qSoLbE8UCBd27essE6TgbXoMn_h_VkKd2j1q943nxEXLt-pTIjfoR5CG4PpvHTwd_PXi-YIVkKLDAZbRgk5wNb57vI-KqO3F7sf1xIiF1xiXd0bhsX49O_euXBiXNFN9PPPIskMx4Nrxdqg2_xaLQ6IDG4wB9uHLDte3sVk7RlcuBjxMqJ-ezT9rvdnX450TqzzZ1PAbHeJ0CD5XlngvD4B-2SWWlY9GqbaEvCFTTBM60I1Uun69tzcG2WQqiQjgMosplo"
                            />
                        </div>
                        <h2 className="font-h2 text-xl font-bold text-[#031636] dark:text-white mb-1">{user.name}</h2>
                        <div className="flex items-center gap-1.5 bg-[#FEF9E7] text-[#735c00] px-3 py-1 rounded-full font-label-caps text-[10px] font-bold shadow-sm uppercase select-none">
                            <Award className="w-3.5 h-3.5" /> {user.tier}
                        </div>
                    </div>

                    {/* Loyalty Points Tracking */}
                    <div className="py-6 border-b border-gray-150 dark:border-gray-800/80">
                        <div className="flex justify-between items-baseline mb-3">
                            <span className="font-label-caps text-[10px] font-bold text-gray-400 uppercase">GrandStar Poin</span>
                            <span className="font-price-display text-lg text-[#735c00] dark:text-[#fed023] font-black">
                                {user.loyaltyPoints.toLocaleString('id-ID')} Poin
                            </span>
                        </div>
                        {/* Loyalty points slider scale */}
                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full bg-gradient-to-r from-[#735c00] to-[#fed023] rounded-full"
                                style={{ width: '62%' }}
                            ></div>
                        </div>
                        <p className="font-body-md text-[10.5px] font-semibold text-gray-400">
                            Kumpulkan 7.550 poin lagi untuk melaju ke tingkat <span className="font-bold text-[#031636] dark:text-[#fed023]">Platinum Member</span>.
                        </p>
                    </div>

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
                            className="w-full bg-[#1A2B4C] hover:bg-[#031636] dark:bg-[#fed023] dark:hover:bg-[#eec209] text-white dark:text-[#031636] py-2.5 rounded-xl text-xs font-bold font-label-caps tracking-wider transition-all cursor-pointer uppercase mt-2 hover:shadow-md"
                        >
                            Update Profil
                        </button>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 py-2.5 rounded-xl text-xs font-bold font-label-caps tracking-wider transition-all cursor-pointer uppercase mt-2 flex items-center justify-center gap-2 hover:shadow-md border border-red-100 dark:border-red-900/30"
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

                {bookings.length > 0 ? (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-white dark:bg-[#1A2B4C] rounded-[24px] border border-gray-150 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col md:flex-row group transition-all duration-300 hover:shadow-md"
                            >
                                {/* Image */}
                                <div className="relative w-full md:w-[240px] h-[180px] md:h-auto shrink-0 select-none">
                                    <img
                                        alt={booking.hotelName}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        src={booking.hotelImage}
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span
                                            className={`font-label-caps text-[9px] font-bold px-3 py-1.5 rounded-full shadow-sm text-white select-none ${booking.status === 'Aktif' ? 'bg-[#00a858]' : 'bg-gray-400'
                                                }`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="p-6 flex flex-col flex-grow justify-between">
                                    <div>
                                        <div className="flex justify-between items-start gap-4 mb-1">
                                            <h3 className="font-h2 text-base md:text-lg font-bold text-[#031636] dark:text-white leading-tight">
                                                {booking.hotelName}
                                            </h3>
                                            <span className="font-mono text-[10px] text-gray-400 font-semibold uppercase">
                                                {booking.id}
                                            </span>
                                        </div>
                                        {!booking.isFlight ? (
                                            <>
                                                <div className="flex items-center text-[#fed023] space-x-0.5 mb-3">
                                                    {[...Array(booking.stars || 5)].map((_, i) => (
                                                        <Star key={i} className="w-3.5 h-3.5 fill-[#fed023] stroke-none" />
                                                    ))}
                                                </div>

                                                <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-b border-gray-50 dark:border-gray-800/50 py-3 mb-4 text-xs font-body-md text-gray-500 dark:text-gray-300">
                                                    <div>
                                                        <span className="text-gray-400 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Check-in</span>
                                                        <span className="font-bold text-gray-800 dark:text-gray-100">{booking.checkInDate}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Check-out</span>
                                                        <span className="font-bold text-gray-800 dark:text-gray-100">{booking.checkOutDate}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Tamu</span>
                                                        <span className="font-semibold text-gray-800 dark:text-gray-100">{booking.guestsText}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Total Biaya</span>
                                                        <span className="font-extrabold text-[#00a858]">{formatCurrency(booking.totalPrice)}</span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                                                    <span>{booking.airline}</span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                                    <span>{booking.flightNumber}</span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                                    <span className="text-[#fed023]">{booking.classType}</span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-b border-gray-50 dark:border-gray-800/50 py-3 mb-4 text-xs font-body-md text-gray-500 dark:text-gray-300">
                                                    <div>
                                                        <span className="text-gray-400 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Rute</span>
                                                        <span className="font-bold text-gray-800 dark:text-gray-100">{booking.fromCode} → {booking.toCode}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Tanggal</span>
                                                        <span className="font-bold text-gray-800 dark:text-gray-100">{booking.checkInDate}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Waktu</span>
                                                        <span className="font-semibold text-gray-800 dark:text-gray-100">{booking.departureTime} - {booking.arrivalTime}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Total Harga</span>
                                                        <span className="font-extrabold text-[#00a858]">{formatCurrency(booking.totalPrice)}</span>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Actions Row */}
                                    <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
                                        {!booking.isFlight ? (
                                            <>
                                                <button
                                                    onClick={() => handleTulisReview(booking.hotelId)}
                                                    className="border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold py-2 px-4 rounded-full font-label-caps uppercase tracking-wide transition-all cursor-pointer active:scale-95"
                                                >
                                                    Tulis Review
                                                </button>
                                                {booking.status === 'Aktif' && (
                                                    <button
                                                        onClick={() => handleCheckIn(booking.hotelId)}
                                                        className="bg-[#1A2B4C] hover:bg-[#031636] dark:bg-[#fed023] dark:hover:bg-[#eec209] text-white dark:text-[#031636] text-xs font-bold py-2 px-4 rounded-full font-label-caps uppercase tracking-wide transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-sm"
                                                    >
                                                        Check-in Online <ChevronRight className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => onSuccessToast('E-Ticket penerbangan berhasil diunduh ke perangkat Anda!')}
                                                className="bg-[#1A2B4C] hover:bg-[#031636] dark:bg-[#fed023] dark:hover:bg-[#eec209] text-white dark:text-[#031636] text-xs font-bold py-2.5 px-5 rounded-full font-label-caps uppercase tracking-wide transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-sm"
                                            >
                                                Download E-Ticket <ExternalLink className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-[#1A2B4C] rounded-[24px] border border-gray-150 dark:border-gray-800 p-12 text-center">
                        <p className="font-body-lg text-gray-400 mb-4 font-medium">Anda belum memiliki riwayat pemesanan aktif.</p>
                        <button
                            onClick={() => setActiveTab('home')}
                            className="bg-[#1A2B4C] hover:bg-[#031636] text-white px-6 py-3 rounded-full font-bold font-label-caps uppercase tracking-wider text-xs transition-all active:scale-95"
                        >
                            Cari Hotel Sekarang
                        </button>
                    </div>
                )}
            </section>
        </main>
    );
}
