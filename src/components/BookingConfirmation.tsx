import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Clock, MapPin, Calendar, Users, Copy, Home } from 'lucide-react';

interface BookingConfirmationState {
    bookingCode: string;
    hotelName: string;
    hotelAddress?: string;
    roomTypeName: string;
    roomId?: string;
    roomNumber?: string;
    checkInDate: string;
    checkOutDate: string;
    nights: number;
    guestsText: string;
    totalPrice: number;
    paymentMethod: string;
    status: 'tentative' | 'confirmed';
    holdExpiresAt?: string;
}

export default function BookingConfirmation() {
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state as BookingConfirmationState;

    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [copied, setCopied] = useState(false);

    // Countdown timer for tentative bookings
    useEffect(() => {
        if (data?.status !== 'tentative' || !data?.holdExpiresAt) return;
        const expiresAt = new Date(data.holdExpiresAt).getTime();

        const tick = () => {
            const remaining = Math.max(0, expiresAt - Date.now());
            setTimeLeft(remaining);
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [data]);

    const formatTimeLeft = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const formatCurrency = (val: number) => {
        if (val === undefined || val === null || isNaN(val)) return 'Rp 0';
        return 'Rp ' + Number(val).toLocaleString('id-ID');
    };

    const copyCode = () => {
        navigator.clipboard.writeText(data?.bookingCode || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        document.title = 'Konfirmasi Booking | Grandstarind';
    }, []);

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <p className="text-gray-500">Data booking tidak ditemukan.</p>
                <button onClick={() => navigate('/dashboard')} className="mt-4 text-blue-600 underline">Ke Dashboard</button>
            </div>
        );
    }

    const isConfirmed = data.status === 'confirmed';
    const isTentative = data.status === 'tentative';

    const paymentLabels: Record<string, string> = {
        grandwallet: 'GrandWallet',
        bank: 'Transfer Bank',
        ewallet: 'E-Wallet',
        card: 'Kartu Kredit',
    };

    return (
        <main className="max-w-2xl mx-auto px-4 py-10 font-sans animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards">

            {/* Header Status */}
            <div className={`rounded-2xl p-6 text-center mb-6 ${isConfirmed ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                {isConfirmed ? (
                    <>
                        <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
                        <h1 className="text-2xl font-bold text-green-700">Pemesanan Terkonfirmasi!</h1>
                        <p className="text-green-600 mt-1 text-sm">Pembayaran berhasil. Kamar Anda sudah siap.</p>
                    </>
                ) : (
                    <>
                        <Clock className="w-14 h-14 text-amber-500 mx-auto mb-3" />
                        <h1 className="text-2xl font-bold text-amber-700">Menunggu Konfirmasi Pembayaran</h1>
                        <p className="text-amber-600 mt-1 text-sm">Selesaikan pembayaran Anda sebelum waktu habis.</p>
                        {isTentative && timeLeft > 0 && (
                            <div className="mt-3 inline-flex items-center gap-2 bg-amber-100 border border-amber-300 rounded-full px-4 py-1.5">
                                <Clock className="w-4 h-4 text-amber-600" />
                                <span className="font-mono font-bold text-amber-700 text-lg">{formatTimeLeft(timeLeft)}</span>
                                <span className="text-amber-600 text-xs">tersisa</span>
                            </div>
                        )}
                        {isTentative && timeLeft === 0 && (
                            <p className="mt-3 text-red-600 font-semibold text-sm">⚠️ Waktu telah habis. Pesanan mungkin otomatis dibatalkan.</p>
                        )}
                    </>
                )}
            </div>

            {/* Booking Code Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Kode Booking</p>
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-mono font-extrabold text-[#031636] dark:text-white tracking-wider">{data.bookingCode}</span>
                    <button
                        onClick={copyCode}
                        className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                    >
                        <Copy className="w-3.5 h-3.5" />
                        {copied ? 'Disalin!' : 'Salin'}
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">Tunjukkan kode ini kepada resepsionis saat check-in.</p>
            </div>

            {/* Booking Details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-4 shadow-sm space-y-4">
                <h2 className="font-bold text-gray-800 dark:text-white text-base">Detail Reservasi</h2>
                <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-white">{data.hotelName}</p>
                            {data.hotelAddress && <p className="text-gray-500">{data.hotelAddress}</p>}
                            <p className="text-gray-500">
                                {data.roomTypeName} {data.roomNumber ? `- Nomor Kamar: ${data.roomNumber}` : ''}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                        <div>
                            <p className="text-gray-800 dark:text-white">
                                <span className="font-semibold">Check-in:</span> {data.checkInDate}
                            </p>
                            <p className="text-gray-800 dark:text-white">
                                <span className="font-semibold">Check-out:</span> {data.checkOutDate}
                            </p>
                            <p className="text-gray-500">{data.nights} malam</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-gray-400 shrink-0" />
                        <p className="text-gray-800 dark:text-white">{data.guestsText}</p>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Metode Pembayaran</span>
                    <span className="font-semibold text-gray-800 dark:text-white text-sm">{paymentLabels[data.paymentMethod] || data.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800 dark:text-white">Total Dibayar</span>
                    <span className="font-bold text-[#031636] dark:text-[#fed023] text-lg">{formatCurrency(data.totalPrice)}</span>
                </div>
            </div>

            {/* Payment Instructions for Tentative */}
            {isTentative && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-4">
                    <h3 className="font-bold text-amber-800 mb-2">Instruksi Pembayaran</h3>
                    <p className="text-amber-700 text-sm mb-3">Silakan lakukan transfer ke rekening berikut dan hubungi resepsionis dengan menyebutkan kode booking Anda:</p>
                    <div className="bg-white rounded-xl p-3 text-sm space-y-1">
                        <p className="text-gray-600">Bank: <span className="font-bold">BCA</span></p>
                        <p className="text-gray-600">No. Rekening: <span className="font-bold">1234-5678-90</span></p>
                        <p className="text-gray-600">Atas nama: <span className="font-bold">PT Grandstarind Hotel</span></p>
                        <p className="text-gray-600">Nominal: <span className="font-bold text-[#031636]">{formatCurrency(data.totalPrice)}</span></p>
                    </div>
                    <p className="text-amber-600 text-xs mt-3">Admin akan mengkonfirmasi pembayaran Anda dalam waktu singkat.</p>
                </div>
            )}

            {/* CTA */}
            <button
                onClick={() => navigate('/dashboard')}
                className="w-full h-[52px] bg-[#1A2B4C] hover:bg-[#031636] text-white rounded-full font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
                <Home className="w-4 h-4" />
                Lihat Riwayat Pemesanan
            </button>
        </main>
    );
}
