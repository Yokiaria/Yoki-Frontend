import React, { useState } from 'react';
import { Hotel, Booking, UserProfile } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';
import { Landmark, CreditCard, Wallet, Smartphone, ShieldCheck, Star, MapPin, Plane } from 'lucide-react';
import { AnimatedCounter } from './AnimatedUI';
import { apiClient } from '../api/apiClient';

interface CheckoutProps {
    hotel: Hotel;
    user: UserProfile;
    setUser: (user: UserProfile) => void;
    checkoutDetails: {
        checkInDate: string;
        checkOutDate: string;
        nights: number;
        guestsText: string;
        roomTypeId?: string;
        roomTypeName?: string;
        roomPrice?: number;
    };
    walletBalance: number;
    setWalletBalance: (bal: number) => void;
    bookings: Booking[];
    setBookings: (bookings: Booking[]) => void;
    onSuccessToast: (msg: string) => void;
    onErrorToast: (msg: string) => void;
}

const parseDate = (dStr: string) => {
    if (!dStr) return new Date().getTime();
    if (dStr.includes('-')) return new Date(dStr).getTime();
    const months: Record<string, number> = { 'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Mei': 4, 'Jun': 5, 'Jul': 6, 'Ags': 7, 'Sep': 8, 'Okt': 9, 'Nov': 10, 'Des': 11 };
    const parts = dStr.split(' ');
    if (parts.length === 3) {
        return new Date(parseInt(parts[2]), months[parts[1]] || 0, parseInt(parts[0])).getTime();
    }
    return new Date(dStr).getTime();
};

export default function Checkout({
    hotel,
    user,
    setUser,
    checkoutDetails,
    walletBalance,
    setWalletBalance,
    bookings,
    setBookings,
    onSuccessToast,
    onErrorToast,
}: CheckoutProps) {
    const [firstName, setFirstName] = useState(user.name.split(' ')[0] || 'John');
    const [lastName, setLastName] = useState(user.name.split(' ').slice(1).join(' ') || 'Doe');
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const navigate = useNavigate();
    const location = useLocation();
    // If hotel is passed via state, use it (optional depending on how we route)
    const stateHotel = location.state?.hotel;
    const activeHotel = stateHotel || hotel;
    const [paymentMethod, setPaymentMethod] = useState<'grandwallet' | 'bank' | 'ewallet' | 'card'>('bank');
    const [promoCode, setPromoCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [appliedPromoName, setAppliedPromoName] = useState('');

    // Room Physical Selection State
    const [availableRooms, setAvailableRooms] = useState<any[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState('');

    React.useEffect(() => {
        if (checkoutDetails?.roomTypeId) {
            const checkIn = checkoutDetails.checkInDate ? new Date(parseDate(checkoutDetails.checkInDate)).toISOString() : new Date().toISOString();
            const checkOut = checkoutDetails.checkOutDate ? new Date(parseDate(checkoutDetails.checkOutDate)).toISOString() : new Date(Date.now() + 86400000).toISOString();
            const hotelId = activeHotel?.id || hotel.id;
            
            apiClient.get(`/rooms/available-list?hotelId=${hotelId}&roomTypeId=${checkoutDetails.roomTypeId}&checkIn=${checkIn}&checkOut=${checkOut}`)
                .then((res: any) => setAvailableRooms(Array.isArray(res) ? res : (res.data || [])))
                .catch(err => console.error("Gagal memuat nomor kamar:", err));
        }
    }, [checkoutDetails]);

    const formatCurrency = (val: number) => {
        return 'Rp ' + val.toLocaleString('id-ID');
    };
    const FormatCurrencyAnimated = ({ val }: { val: number }) => (
        <>Rp <AnimatedCounter targetValue={val} /></>
    );



    const ciTime = parseDate(checkoutDetails.checkInDate);
    const coTime = parseDate(checkoutDetails.checkOutDate);
    const selisihWaktu = Math.max(0, coTime - ciTime);
    const calculatedNights = Math.ceil(selisihWaktu / (1000 * 60 * 60 * 24));
    
    // Gunakan calculatedNights jika > 0, jika tidak fallback ke nights/1
    const jumlahMalam = calculatedNights > 0 ? calculatedNights : (checkoutDetails.nights || 1);
    const jumlahKamar = parseInt(localStorage.getItem('search_rooms') || '1', 10);
    const guestsTextFromStorage = localStorage.getItem('search_guests_text') || checkoutDetails.guestsText || '2 Tamu, 1 Kamar';

    // Subtotal
    const subtotal = (checkoutDetails.roomPrice || hotel.pricePerNight) * jumlahMalam * jumlahKamar;
    
    // Tier Discount Logic
    const tier = user.tier || 'Bronze';
    const tierDiscountPercent = tier === 'Platinum' ? 0.20 : tier === 'Gold' ? 0.15 : tier === 'Silver' ? 0.10 : 0.05;
    const tierDiscountAmount = Math.round(subtotal * tierDiscountPercent);

    // Taxes
    const taxes = Math.round(subtotal * 0.21);
    // Total Harga
    const totalPrice = subtotal + taxes - appliedDiscount - tierDiscountAmount;

    const handleApplyPromo = async () => {
        const codeUpper = promoCode.trim().toUpperCase();
        if (!codeUpper) {
            onErrorToast('Masukkan kode promo terlebih dahulu!');
            return;
        }

        try {
            const result = await apiClient.post<any>('/promos/validate', { code: codeUpper, basePrice: subtotal });
            // Backend mengembalikan: { valid: true, discountAmount, discountPercent, promoName }
            if (result?.valid || result?.discountAmount || result?.discount) {
                const discount = result.discountAmount ?? result.discount ?? Math.round(subtotal * ((result.discountPercent ?? 0) / 100));
                setAppliedDiscount(discount);
                setAppliedPromoName(`${codeUpper} (${result.promoName || result.title || 'Promo'})`);
                onSuccessToast(`Promo ${codeUpper} berhasil diterapkan! Hemat ${formatCurrency(discount)}`);
            } else {
                onErrorToast(result?.message || 'Kode promo tidak valid!');
            }
        } catch (err: any) {
            onErrorToast(err.message || 'Kode promo tidak valid atau sudah kedaluwarsa!');
        }
    };

    const handlePayNow = async () => {
        if (!firstName || !lastName || !email || !phone) {
            onErrorToast('Mohon lengkapi semua rincian tamu!');
            return;
        }

        // Validasi: pastikan tipe kamar sudah dipilih
        if (!checkoutDetails.roomTypeId) {
            onErrorToast('Tipe kamar tidak ditemukan. Silakan kembali dan pilih kamar terlebih dahulu.');
            navigate(-1);
            return;
        }

        if (paymentMethod === 'grandwallet') {
            if (walletBalance < totalPrice) {
                onErrorToast('Saldo Star Wallet Anda tidak cukup! Silakan lakukan Top Up.');
                navigate('/wallet');
                return;
            }
            // Deduct balance
            setWalletBalance(walletBalance - totalPrice);
            setUser({ ...user, balance: (user.balance ?? 0) - totalPrice });
        }

        // Add new booking to dashboard list
        const newBooking: Booking = {
            id: 'GS-H-' + Math.floor(1000 + Math.random() * 9000),
            hotelId: hotel.id,
            hotelName: hotel.name,
            hotelImage: hotel.thumbnailUrl,
            stars: hotel.stars,
            rating: hotel.rating,
            checkInDate: checkoutDetails.checkInDate || '12 Okt 2024',
            checkOutDate: checkoutDetails.checkOutDate || '15 Okt 2024',
            nights: jumlahMalam,
            guestName: firstName + ' ' + lastName,
            guestsText: guestsTextFromStorage,
            totalPrice: totalPrice,
            status: 'aktif',
            roomTypeId: checkoutDetails.roomTypeId,
            roomTypeName: checkoutDetails.roomTypeName,
        };

        const formattedTotalPrice = Number(String(totalPrice).replace(/[^0-9.-]+/g, "")) || 0;

        // Convert Indonesian date string "12 Okt 2024" to ISO standard format
        const parseDateString = (dateStr: string) => {
            const mapIDtoEN: any = { 'Jan': 'Jan', 'Feb': 'Feb', 'Mar': 'Mar', 'Apr': 'Apr', 'Mei': 'May', 'Jun': 'Jun', 'Jul': 'Jul', 'Agu': 'Aug', 'Sep': 'Sep', 'Okt': 'Oct', 'Nov': 'Nov', 'Des': 'Dec' };
            const parts = dateStr.split(' ');
            if (parts.length === 3) {
                const enMonth = mapIDtoEN[parts[1]] || parts[1];
                const d = new Date(`${parts[0]} ${enMonth} ${parts[2]}`);
                if (!isNaN(d.getTime())) return d.toISOString();
            }
            return new Date().toISOString();
        };

        const payload: any = {
            hotelId: newBooking.hotelId,
            roomId: selectedRoomId || undefined,
            roomTypeId: checkoutDetails.roomTypeId,
            guestName: newBooking.guestName,
            guestsText: newBooking.guestsText,
            checkInDate: parseDateString(newBooking.checkInDate || ''),
            checkOutDate: parseDateString(newBooking.checkOutDate || ''),
            nights: newBooking.nights,
            paymentMethod,
            promoCode: appliedPromoName ? promoCode.trim().toUpperCase() : undefined,
            discountAmount: appliedDiscount,
            totalPrice: formattedTotalPrice
        };
        console.log("=== PAYLOAD CHECKOUT ===", payload);
        console.log("  hotelId   :", payload.hotelId);
        console.log("  roomId    :", payload.roomId);
        console.log("  totalPrice:", payload.totalPrice, typeof payload.totalPrice);

        try {
            const savedBooking: any = await apiClient.post('/bookings', payload);
            
            // Update user detail names if changed and update local balance state!
            const newBalance = paymentMethod === 'grandwallet' ? (user.balance ?? 0) - totalPrice : (user.balance ?? 0);
            setUser({
                ...user,
                name: firstName + ' ' + lastName,
                email: email,
                phone: phone,
                balance: newBalance
            });

            const bookingStatus = savedBooking?.status || (paymentMethod === 'grandwallet' ? 'confirmed' : 'tentative');

            // Navigate to confirmation/voucher page
            navigate('/booking-confirmation', {
                state: {
                    bookingCode: savedBooking?.bookingCode || 'GS-???',
                    hotelName: activeHotel?.name || '',
                    hotelAddress: activeHotel?.address || '',
                    roomTypeName: checkoutDetails.roomTypeName || '',
                    roomId: selectedRoomId || undefined,
                    roomNumber: availableRooms.find(r => r.id === selectedRoomId)?.roomNumber || undefined,
                    checkInDate: checkoutDetails.checkInDate,
                    checkOutDate: checkoutDetails.checkOutDate,
                    nights: jumlahMalam,
                    guestsText: guestsTextFromStorage,
                    totalPrice: totalPrice,
                    paymentMethod: paymentMethod,
                    status: bookingStatus,
                    holdExpiresAt: savedBooking?.holdExpiresAt || null,
                }
            });
        } catch (error: any) {
            console.error("Failed to post booking", error);
            const errorMsg = error.response?.data?.message || "Gagal memesan, kamar sudah penuh.";
            alert(errorMsg);
            onErrorToast(errorMsg);
            
            // Revert balance deduction if using grandwallet since booking failed
            if (paymentMethod === 'grandwallet') {
                setWalletBalance(walletBalance);
            }
        }
    };

    return (
        <main
            className="flex-grow flex flex-col md:flex-row gap-8 p-4 md:p-8 max-w-7xl mx-auto w-full pb-32 text-left font-sans animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-forwards"
            id="checkout-page-container"
        >
            {/* Left Column: Details */}
            <div className="flex-grow flex-1 flex flex-col gap-8">
                <div>
                    <h1 className="font-display-lg text-2xl md:text-3xl font-extrabold text-[#031636] dark:text-white mb-2 uppercase tracking-tight">
                        Review &amp; Pay
                    </h1>
                    <p className="font-body-lg text-sm md:text-base text-gray-500 dark:text-gray-400">
                        Lengkapi rincian pemesanan Anda di bawah ini.
                    </p>
                </div>

                {/* Booking Summary Card */}
                <section className="bg-white dark:bg-[#1A2B4C] rounded-[24px] shadow-sm border border-gray-150 dark:border-gray-800 p-6 flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="w-full sm:w-1/3 h-40 rounded-xl overflow-hidden relative select-none">
                                <img alt={hotel.name} className="w-full h-full object-cover" src={hotel.thumbnailUrl} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                                    <div className="bg-[#FEF9E7] text-[#735c00] px-2 py-1 rounded-full flex items-center gap-1 w-max">
                                        <Star className="w-3 h-3 fill-[#735c00] stroke-none" />
                                        <span className="font-label-caps text-[9px] font-bold">{(hotel?.rating || 0).toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h2 className="font-h2 text-lg font-bold text-[#031636] dark:text-white mb-2">{hotel.name}</h2>
                                    <p className="font-body-md text-xs text-gray-400 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-gray-400" /> {hotel.location}
                                    </p>
                                    <p className="font-body-md text-xs text-gray-400 dark:text-gray-300 font-semibold uppercase tracking-wider">
                                        Grand Deluxe Ocean Suite
                                    </p>
                                </div>
                                <div className="mt-4 flex gap-4 text-xs bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-150 dark:border-gray-700/60">
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 uppercase text-[9px] font-bold tracking-wider mb-1">Check-in</span>
                                        <span className="font-bold text-[#031636] dark:text-[#d8e2ff]">
                                            {checkoutDetails.checkInDate || '12 Okt 2024'}
                                        </span>
                                    </div>
                                    <div className="w-px bg-gray-200 dark:bg-gray-700"></div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 uppercase text-[9px] font-bold tracking-wider mb-1">Check-out</span>
                                        <span className="font-bold text-[#031636] dark:text-[#d8e2ff]">
                                            {checkoutDetails.checkOutDate || '15 Okt 2024'}
                                        </span>
                                    </div>
                                    <div className="w-px bg-gray-200 dark:bg-gray-700"></div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 uppercase text-[9px] font-bold tracking-wider mb-1">Durasi</span>
                                        <span className="font-bold text-[#031636] dark:text-[#d8e2ff]">{jumlahMalam} Malam</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                </section>

                {/* Guest Details Form */}
                <section className="bg-white dark:bg-[#1A2B4C] rounded-[24px] shadow-sm border border-gray-150 dark:border-gray-800 p-6">
                    <h3 className="font-h2 text-base font-bold text-[#031636] dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-2 uppercase tracking-wide">
                        Guest Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="font-label-caps text-[10px] uppercase font-bold text-gray-400">First Name</label>
                            <input
                                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-800 focus:border-[#031636] focus:ring-1 focus:ring-[#031636] dark:focus:ring-[#fed023] dark:focus:border-[#fed023] outline-none transition-all font-body-md text-sm text-[#031636] dark:text-white"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="font-label-caps text-[10px] uppercase font-bold text-gray-400">Last Name</label>
                            <input
                                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-800 focus:border-[#031636] focus:ring-1 focus:ring-[#031636] dark:focus:ring-[#fed023] dark:focus:border-[#fed023] outline-none transition-all font-body-md text-sm text-[#031636] dark:text-white"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="font-label-caps text-[10px] uppercase font-bold text-gray-400">Email Address</label>
                            <input
                                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-800 focus:border-[#031636] focus:ring-1 focus:ring-[#031636] dark:focus:ring-[#fed023] dark:focus:border-[#fed023] outline-none transition-all font-body-md text-sm text-[#031636] dark:text-white"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="font-label-caps text-[10px] uppercase font-bold text-gray-400">Phone Number</label>
                            <input
                                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-800 focus:border-[#031636] focus:ring-1 focus:ring-[#031636] dark:focus:ring-[#fed023] dark:focus:border-[#fed023] outline-none transition-all font-body-md text-sm text-[#031636] dark:text-white"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {/* Physical Room Selection (Optional) */}
                <section className="bg-white dark:bg-[#1A2B4C] rounded-[24px] shadow-sm border border-gray-150 dark:border-gray-800 p-6">
                    <h3 className="font-h2 text-base font-bold text-[#031636] dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-2 uppercase tracking-wide">
                        Pilih Nomor Kamar <span className="text-gray-400 text-xs font-normal normal-case">(Opsional)</span>
                    </h3>
                    <div className="mt-2">
                        <label className="text-sm font-medium text-gray-300">Nomor Kamar Tersedia</label>
                        <select 
                            value={selectedRoomId}
                            onChange={(e) => setSelectedRoomId(e.target.value)}
                            className="w-full mt-1 bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5"
                        >
                            <option value="">-- Biarkan sistem memilih otomatis --</option>
                            {availableRooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    Kamar {room.roomNumber}
                                </option>
                            ))}
                        </select>
                    </div>
                </section>

                {/* Payment Method Selector */}
                <section className="bg-white dark:bg-[#1A2B4C] rounded-[24px] shadow-sm border border-gray-150 dark:border-gray-800 p-6">
                    <h3 className="font-h2 text-base font-bold text-[#031636] dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-2 uppercase tracking-wide">
                        Payment Method
                    </h3>
                    <div className="flex flex-col gap-3">
                        {/* GrandWallet */}
                        <label
                            onClick={() => setPaymentMethod('grandwallet')}
                            className={`flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-all ${paymentMethod === 'grandwallet'
                                    ? 'border-[#031636] dark:border-[#fed023] bg-[#031636]/5 dark:bg-[#fed023]/5'
                                    : 'border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            <input
                                checked={paymentMethod === 'grandwallet'}
                                className="w-4 h-4 text-[#031636] dark:text-[#fed023] border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-[#031636] mr-4"
                                name="payment"
                                type="radio"
                                onChange={() => { }}
                            />
                            <div className="flex-grow text-left">
                                <span className="font-bold text-[#031636] dark:text-white block text-sm">GrandWallet</span>
                                <span className="text-xs text-gray-400 dark:text-gray-300 font-medium">
                                    Saldo: <FormatCurrencyAnimated val={walletBalance} />
                                </span>
                            </div>
                            <Wallet className="w-5 h-5 text-gray-400 dark:text-gray-300 shrink-0" />
                        </label>

                        {/* Bank Transfer */}
                        <label
                            onClick={() => setPaymentMethod('bank')}
                            className={`flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-all ${paymentMethod === 'bank'
                                    ? 'border-[#031636] dark:border-[#fed023] bg-[#031636]/5 dark:bg-[#fed023]/5'
                                    : 'border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            <input
                                checked={paymentMethod === 'bank'}
                                className="w-4 h-4 text-[#031636] dark:text-[#fed023] border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-[#031636] mr-4"
                                name="payment"
                                type="radio"
                                onChange={() => { }}
                            />
                            <div className="flex-grow text-left">
                                <span className="font-bold text-[#031636] dark:text-white block text-sm">Bank Transfer</span>
                                <span className="text-xs text-gray-400 dark:text-gray-300 font-medium">
                                    BCA, Mandiri, BNI, BRI (Instan Otomatis)
                                </span>
                            </div>
                            <Landmark className="w-5 h-5 text-gray-400 dark:text-gray-300 shrink-0" />
                        </label>

                        {/* E-Wallet */}
                        <label
                            onClick={() => setPaymentMethod('ewallet')}
                            className={`flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-all ${paymentMethod === 'ewallet'
                                    ? 'border-[#031636] dark:border-[#fed023] bg-[#031636]/5 dark:bg-[#fed023]/5'
                                    : 'border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            <input
                                checked={paymentMethod === 'ewallet'}
                                className="w-4 h-4 text-[#031636] dark:text-[#fed023] border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-[#031636] mr-4"
                                name="payment"
                                type="radio"
                                onChange={() => { }}
                            />
                            <div className="flex-grow text-left">
                                <span className="font-bold text-[#031636] dark:text-white block text-sm">E-Wallet</span>
                                <span className="text-xs text-gray-400 dark:text-gray-300 font-medium">GoPay, OVO, Dana, ShopeePay</span>
                            </div>
                            <Smartphone className="w-5 h-5 text-gray-400 dark:text-gray-300 shrink-0" />
                        </label>

                        {/* Credit Card */}
                        <label
                            onClick={() => setPaymentMethod('card')}
                            className={`flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-all ${paymentMethod === 'card'
                                    ? 'border-[#031636] dark:border-[#fed023] bg-[#031636]/5 dark:bg-[#fed023]/5'
                                    : 'border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            <input
                                checked={paymentMethod === 'card'}
                                className="w-4 h-4 text-[#031636] dark:text-[#fed023] border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-[#031636] mr-4"
                                name="payment"
                                type="radio"
                                onChange={() => { }}
                            />
                            <div className="flex-grow text-left">
                                <span className="font-bold text-[#031636] dark:text-white block text-sm">Credit / Debit Card</span>
                                <span className="text-xs text-gray-400 dark:text-gray-300 font-medium">Visa, Mastercard, JCB</span>
                            </div>
                            <CreditCard className="w-5 h-5 text-gray-400 dark:text-gray-300 shrink-0" />
                        </label>
                    </div>
                </section>
            </div>

            {/* Right Column: Price Details & Booking Code */}
            <div className="w-full md:w-[380px] lg:w-[410px]">
                <div className="sticky top-28 bg-white/95 dark:bg-[#1A2B4C]/95 backdrop-blur-xl rounded-[24px] border border-gray-150 dark:border-gray-800 p-6 flex flex-col gap-6 shadow-xl text-[#031636] dark:text-white text-left">
                    <h3 className="font-h2 text-base font-bold text-[#031636] dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2 uppercase tracking-wide">
                        Rincian Harga
                    </h3>
                    <div className="flex flex-col gap-3.5 font-body-md text-xs md:text-sm text-gray-700 dark:text-gray-300 font-medium">
                        <div className="flex justify-between">
                            <span className="text-gray-400">{jumlahKamar} Kamar x {jumlahMalam} Malam</span>
                            <span className="font-bold text-gray-800 dark:text-gray-100"><FormatCurrencyAnimated val={subtotal} /></span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Taxes &amp; Fees (21%)</span>
                            <span className="font-bold text-gray-800 dark:text-gray-100"><FormatCurrencyAnimated val={taxes} /></span>
                        </div>
                        {tierDiscountAmount > 0 && (
                            <div className="flex justify-between text-emerald-500">
                                <span className="text-gray-400">Diskon Member ({tier})</span>
                                <span className="font-bold">- <FormatCurrencyAnimated val={tierDiscountAmount} /></span>
                            </div>
                        )}
                        {appliedDiscount > 0 && (
                            <div className="flex justify-between text-[#00a858] bg-[#00a858]/5 p-2.5 rounded-lg border border-[#00a858]/15">
                                <span className="font-semibold text-xs leading-relaxed">{appliedPromoName}</span>
                                <span className="font-bold leading-relaxed">- <FormatCurrencyAnimated val={appliedDiscount} /></span>
                            </div>
                        )}
                    </div>

                    {/* Promo code entry panel */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Masukkan kode promo"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="flex-grow px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-[#031636] dark:focus:ring-[#fed023] font-body-md text-xs text-[#031636] dark:text-white uppercase font-bold"
                        />
                        <button
                            onClick={handleApplyPromo}
                            className="bg-gray-100 dark:bg-gray-800 hover:bg-[#031636] dark:hover:bg-[#fed023] hover:text-white dark:hover:text-[#031636] px-4 py-2 rounded-xl text-xs font-bold transition-all"
                        >
                            Gunakan
                        </button>
                    </div>

                    <div className="border-t border-gray-150 dark:border-gray-800 pt-4 flex justify-between items-end">
                        <span className="font-bold text-gray-400 text-sm">Total Harga</span>
                        <span className="font-price-display text-lg text-[#00a858] font-black"><FormatCurrencyAnimated val={totalPrice} /></span>
                    </div>

                    <button
                        onClick={handlePayNow}
                        className="w-full bg-[#1A2B4C] hover:bg-[#031636] dark:bg-[#fed023] dark:hover:bg-[#eec209] text-white dark:text-[#031636] h-[56px] rounded-full font-bold text-sm tracking-wide shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        Bayar Sekarang
                    </button>
                    <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider select-none mt-2">
                        <ShieldCheck className="w-4 h-4 text-[#00a858]" /> Secure &amp; Encrypted Transaction
                    </div>
                    <p className="text-center text-[10px] text-gray-400 font-medium select-none mt-1 leading-normal">
                        Dengan mengklik tombol di atas, Anda menyetujui Ketentuan Layanan kami.
                    </p>
                </div>
            </div>
        </main>
    );
}
