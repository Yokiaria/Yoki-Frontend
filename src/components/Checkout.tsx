import React, { useState } from 'react';
import { ActiveTab, Hotel, Booking, UserProfile, Flight } from '../types';
import { Landmark, CreditCard, Wallet, Smartphone, ShieldCheck, Star, MapPin, Plane } from 'lucide-react';

interface CheckoutProps {
    setActiveTab: (tab: ActiveTab) => void;
    hotel: Hotel;
    user: UserProfile;
    setUser: (user: UserProfile) => void;
    checkoutDetails: {
        checkInDate: string;
        checkOutDate: string;
        nights: number;
        guestsText: string;
    };
    walletBalance: number;
    setWalletBalance: (bal: number) => void;
    bookings: Booking[];
    setBookings: (bookings: Booking[]) => void;
    onSuccessToast: (msg: string) => void;
    onErrorToast: (msg: string) => void;
    selectedFlight?: Flight | null;
}

export default function Checkout({
    setActiveTab,
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
    selectedFlight,
}: CheckoutProps) {
    const [firstName, setFirstName] = useState(user.name.split(' ')[0] || 'John');
    const [lastName, setLastName] = useState(user.name.split(' ').slice(1).join(' ') || 'Doe');
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [paymentMethod, setPaymentMethod] = useState<'grandwallet' | 'bank' | 'ewallet' | 'card'>('bank');
    const [promoCode, setPromoCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [appliedPromoName, setAppliedPromoName] = useState('');

    const formatCurrency = (val: number) => {
        return 'Rp ' + val.toLocaleString('id-ID');
    };

    const isFlight = !!selectedFlight;
    const nights = checkoutDetails.nights || 3;
    const basePrice = isFlight ? selectedFlight!.price : hotel.pricePerNight * nights;
    const taxAndFees = Math.round(basePrice * (isFlight ? 0.11 : 0.21));
    const totalPrice = basePrice + taxAndFees - appliedDiscount;

    const handleApplyPromo = () => {
        const codeUpper = promoCode.trim().toUpperCase();
        if (codeUpper === 'BALILUX50') {
            const discount = Math.round(basePrice * 0.5);
            setAppliedDiscount(discount);
            setAppliedPromoName('BALILUX50 (Flash Sale 50%)');
            onSuccessToast('Promo BALILUX50 Berhasil Diterapkan! Diskon 50%');
        } else if (codeUpper === 'RELAX30') {
            const discount = Math.round(basePrice * 0.3);
            setAppliedDiscount(discount);
            setAppliedPromoName('RELAX30 (Special 30%)');
            onSuccessToast('Promo RELAX30 Berhasil Diterapkan! Diskon 30%');
        } else if (codeUpper === 'FLYGRAND24') {
            setAppliedDiscount(500000);
            setAppliedPromoName('FLYGRAND24 (Potongan Rp 500rb)');
            onSuccessToast('Promo FLYGRAND24 Berhasil Diterapkan! Potongan Rp 500.000');
        } else if (codeUpper === 'JKTSTAY') {
            setAppliedDiscount(350000);
            setAppliedPromoName('JKTSTAY (Staycation Promo)');
            onSuccessToast('Promo JKTSTAY Berhasil Diterapkan! Potongan Rp 350.000');
        } else {
            onErrorToast('Kode promo tidak valid!');
        }
    };

    const handlePayNow = () => {
        if (!firstName || !lastName || !email || !phone) {
            onErrorToast(isFlight ? 'Mohon lengkapi semua rincian penumpang!' : 'Mohon lengkapi semua rincian tamu!');
            return;
        }

        if (paymentMethod === 'grandwallet') {
            if (walletBalance < totalPrice) {
                onErrorToast('Saldo Star Wallet Anda tidak cukup! Silakan lakukan Top Up.');
                setActiveTab('wallet');
                return;
            }
            // Deduct balance
            setWalletBalance(walletBalance - totalPrice);
        }

        // Add new booking to dashboard list
        const newBooking: Booking = isFlight ? {
            id: 'GS-F-' + Math.floor(1000 + Math.random() * 9000),
            hotelId: selectedFlight!.id,
            hotelName: selectedFlight!.airline + ' (' + selectedFlight!.flightNumber + ')',
            hotelImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPUSB6D4TIUx5ycUwmdcS-9QEL95AsDpEKYI2lOo5LkXsmEbSG2uU1muRm_aMXg0KQSYGdjMRHZ43bCiGK3akqxxR00ervoj7sJE8unzjoZbVo78DAfhjab_0R2OgTqOen8R0_NdBtCAYqavFRgOTY_793oX9mN6XHiidng0e1ItDf4psmhgv9vS7EEABSNLM2MO9aJFrJlYxM9qVOe04F38KYkUZU95I2hzOCylZrF78c0ARdGuijqL-3SwD2s0lLgG_8XQLa8f8',
            stars: 5,
            rating: 4.9,
            checkInDate: checkoutDetails.checkInDate || '24 Okt 2024',
            checkOutDate: checkoutDetails.checkInDate || '24 Okt 2024',
            nights: 0,
            guestName: firstName + ' ' + lastName,
            guestsText: '1 Penumpang, ' + selectedFlight!.classType,
            totalPrice: totalPrice,
            status: 'Aktif',
            isFlight: true,
            flightNumber: selectedFlight!.flightNumber,
            airline: selectedFlight!.airline,
            fromCode: selectedFlight!.fromCode,
            toCode: selectedFlight!.toCode,
            departureTime: selectedFlight!.departureTime,
            arrivalTime: selectedFlight!.arrivalTime,
            classType: selectedFlight!.classType,
        } : {
            id: 'GS-H-' + Math.floor(1000 + Math.random() * 9000),
            hotelId: hotel.id,
            hotelName: hotel.name,
            hotelImage: hotel.thumbnailUrl,
            stars: hotel.stars,
            rating: hotel.rating,
            checkInDate: checkoutDetails.checkInDate || '12 Okt 2024',
            checkOutDate: checkoutDetails.checkOutDate || '15 Okt 2024',
            nights: nights,
            guestName: firstName + ' ' + lastName,
            guestsText: checkoutDetails.guestsText || '2 Tamu, 1 Kamar',
            totalPrice: totalPrice,
            status: 'Aktif',
        };

        setBookings([newBooking, ...bookings]);

        // Update user detail names if changed
        setUser({
            ...user,
            name: firstName + ' ' + lastName,
            email: email,
            phone: phone,
        });

        onSuccessToast(isFlight ? 'Tiket penerbangan mewah berhasil dibayar! Tiket Anda siap di Dashboard.' : 'Pemesanan hotel berhasil dibayar! Kamar Anda siap.');
        setActiveTab('dashboard');
    };

    return (
        <main
            className="flex-grow flex flex-col md:flex-row gap-8 p-4 md:p-8 max-w-7xl mx-auto w-full pb-32 text-left font-sans"
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
                    {!isFlight ? (
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="w-full sm:w-1/3 h-40 rounded-xl overflow-hidden relative select-none">
                                <img alt={hotel.name} className="w-full h-full object-cover" src={hotel.thumbnailUrl} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                                    <div className="bg-[#FEF9E7] text-[#735c00] px-2 py-1 rounded-full flex items-center gap-1 w-max">
                                        <Star className="w-3 h-3 fill-[#735c00] stroke-none" />
                                        <span className="font-label-caps text-[9px] font-bold">{hotel.rating.toFixed(1)}</span>
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
                                        <span className="font-bold text-[#031636] dark:text-[#d8e2ff]">{nights} Malam</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="w-full sm:w-1/3 h-40 rounded-xl overflow-hidden relative bg-gradient-to-br from-[#031636] to-[#1A2B4C] flex flex-col items-center justify-center text-white select-none">
                                <Plane className="w-12 h-12 text-[#fed023] mb-2" />
                                <span className="font-mono text-xs font-bold tracking-wider text-gray-300">
                                    {selectedFlight!.airline}
                                </span>
                                <span className="font-mono text-[10px] font-bold tracking-widest text-[#fed023]/80 uppercase mt-0.5">
                                    {selectedFlight!.flightNumber}
                                </span>
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h2 className="font-h2 text-lg font-bold text-[#031636] dark:text-white mb-2">
                                        {selectedFlight!.airline}
                                    </h2>
                                    <p className="font-body-md text-xs text-gray-400 dark:text-gray-300 mb-1.5 flex items-center gap-1.5 font-bold uppercase tracking-wide">
                                        Rute: {selectedFlight!.fromCode} → {selectedFlight!.toCode}
                                    </p>
                                    <p className="font-body-md text-xs text-gray-400 dark:text-gray-300 font-semibold uppercase tracking-wider text-[#fed023]">
                                        {selectedFlight!.classType} Class Ticket
                                    </p>
                                </div>
                                <div className="mt-4 flex gap-4 text-xs bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-150 dark:border-gray-700/60">
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 uppercase text-[9px] font-bold tracking-wider mb-1">Dari</span>
                                        <span className="font-bold text-[#031636] dark:text-[#d8e2ff]">
                                            {selectedFlight!.fromName}
                                        </span>
                                    </div>
                                    <div className="w-px bg-gray-200 dark:bg-gray-700"></div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 uppercase text-[9px] font-bold tracking-wider mb-1">Ke</span>
                                        <span className="font-bold text-[#031636] dark:text-[#d8e2ff]">
                                            {selectedFlight!.toName}
                                        </span>
                                    </div>
                                    <div className="w-px bg-gray-200 dark:bg-gray-700"></div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 uppercase text-[9px] font-bold tracking-wider mb-1">Jam</span>
                                        <span className="font-bold text-[#031636] dark:text-[#d8e2ff]">
                                            {selectedFlight!.departureTime} - {selectedFlight!.arrivalTime}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Guest Details Form */}
                <section className="bg-white dark:bg-[#1A2B4C] rounded-[24px] shadow-sm border border-gray-150 dark:border-gray-800 p-6">
                    <h3 className="font-h2 text-base font-bold text-[#031636] dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-2 uppercase tracking-wide">
                        {isFlight ? 'Passenger Details' : 'Guest Details'}
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
                                    Saldo: {formatCurrency(walletBalance)}
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
                            <span className="text-gray-400">1 Kamar x {nights} Malam</span>
                            <span className="font-bold text-gray-800 dark:text-gray-100">{formatCurrency(basePrice)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Taxes &amp; Fees (21%)</span>
                            <span className="font-bold text-gray-800 dark:text-gray-100">{formatCurrency(taxAndFees)}</span>
                        </div>
                        {appliedDiscount > 0 && (
                            <div className="flex justify-between text-[#00a858] bg-[#00a858]/5 p-2.5 rounded-lg border border-[#00a858]/15">
                                <span className="font-semibold text-xs leading-relaxed">{appliedPromoName}</span>
                                <span className="font-bold leading-relaxed">- {formatCurrency(appliedDiscount)}</span>
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
                        <span className="font-price-display text-lg text-[#00a858] font-black">{formatCurrency(totalPrice)}</span>
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
