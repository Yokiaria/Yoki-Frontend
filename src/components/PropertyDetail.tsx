import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Hotel, UserProfile, RoomType } from '../types';
import { ChevronRight, Star, MapPin, Share2, Heart, Check, HelpCircle, Eye } from 'lucide-react';
import { AnimatedCounter } from './AnimatedUI';
import { apiClient } from '../api/apiClient';

interface Review {
    id: string;
    rating?: number;
    ratingKebersihan?: number;
    ratingPelayanan?: number;
    ratingLokasi?: number;
    ratingFasilitas?: number;
    comment: string;
    createdAt: string;
    userName?: string;
    user?: {
        name: string;
    };
    guestName?: string;
}

interface PropertyDetailProps {
    checkoutDetails: {
        checkInDate: string;
        checkOutDate: string;
        nights: number;
        guestsText: string;
        roomTypeId?: string;
        roomTypeName?: string;
        roomPrice?: number;
    };
    setCheckoutDetails: (details: any) => void;
    user: UserProfile | null;
}

export default function PropertyDetail({
    checkoutDetails,
    setCheckoutDetails,
    user,
}: PropertyDetailProps) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    const [isLiked, setIsLiked] = useState(false);
    const [checkIn, setCheckIn] = useState(checkoutDetails.checkInDate);
    const [checkOut, setCheckOut] = useState(checkoutDetails.checkOutDate);
    const [guests, setGuests] = useState(checkoutDetails.guestsText);

    
    // Parser tanggal fleksibel untuk format Indonesia "24 Okt 2024" atau "YYYY-MM-DD"
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

    // Kalkulasi jumlah malam secara dinamis ketika tanggal berubah
    const calculatedNights = useMemo(() => {
        const ci = parseDate(checkIn);
        const co = parseDate(checkOut);
        const diff = Math.max(0, co - ci);
        const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return nights > 0 ? nights : (checkoutDetails.nights || 1);
    }, [checkIn, checkOut, checkoutDetails.nights]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [hotelData, typesData, reviewsData] = await Promise.all([
                    apiClient.get(`/hotels/${id}`),
                    apiClient.get<RoomType[]>(`/rooms/types?hotelId=${id}`).catch(() => []),
                    apiClient.get<Review[]>(`/reviews?hotelId=${id}`).catch(() => [])
                ]);
                
                const data: any = hotelData;
                const normalized: Hotel = {
                    ...data,
                    pricePerNight: Number(data.pricePerNight || 0),
                    originalPricePerNight: data.originalPricePerNight ? Number(data.originalPricePerNight) : undefined,
                    rating: data.rating ? Number(data.rating) : 0,
                    amenities: Array.isArray(data.amenities) ? data.amenities.map((a: any) => typeof a === 'string' ? a : a.amenity) : [],
                    tags: Array.isArray(data.tags) ? data.tags.map((t: any) => typeof t === 'string' ? t : t.tag) : [],
                    imageUrls: Array.isArray(data.images) && data.images.length > 0 ? data.images.map((img: any) => img.imageUrl) : [
                        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000',
                        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1000',
                        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000',
                        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000',
                        'https://images.unsplash.com/photo-1551882547-ff40c0d5b9fa?auto=format&fit=crop&q=80&w=1000'
                    ],
                };
                setHotel(normalized);
                
                const types = Array.isArray(typesData) ? typesData : [];
                setRoomTypes(types);
                setReviews(Array.isArray(reviewsData) ? reviewsData : []);
                if (types.length > 0) {
                    setSelectedRoomTypeId(types[0].id);
                }
            } catch (err) {
                console.error(err);
                setHotel(null);
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchData();
    }, [id]);

    const formatCurrency = (val: number) => {
        return 'Rp ' + val.toLocaleString('id-ID');
    };
    const FormatCurrencyAnimated = ({ val }: { val: number }) => (
        <>Rp <AnimatedCounter targetValue={val} /></>
    );

    const selectedRoomType = roomTypes.find((rt) => rt.id === selectedRoomTypeId);
    const currentPrice = selectedRoomType ? selectedRoomType.price : (hotel?.pricePerNight || 0);

    const handleBookNow = () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setCheckoutDetails({
            checkInDate: checkIn,
            checkOutDate: checkOut,
            nights: calculatedNights,
            guestsText: guests,
            roomTypeId: selectedRoomType?.id,
            roomTypeName: selectedRoomType?.name,
            roomPrice: currentPrice,
        });
        
        navigate('/checkout', { state: { hotel } });
    };

    if (isLoading) {
        return (
            <div className="flex-grow flex items-center justify-center min-h-[500px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#031636] dark:border-[#fed023]"></div>
            </div>
        );
    }

    if (!hotel) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center min-h-[500px] text-center p-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Hotel Tidak Ditemukan</h2>
                <p className="text-gray-500 mb-8 max-w-md">Maaf, kami tidak dapat menemukan properti dengan ID tersebut. Mungkin hotel sudah tidak tersedia atau link yang Anda tuju salah.</p>
                <button onClick={() => navigate('/')} className="px-6 py-3 bg-[#031636] dark:bg-[#fed023] text-white dark:text-[#031636] font-bold rounded-full hover:shadow-lg transition-all">
                    Kembali ke Beranda
                </button>
            </div>
        );
    }

    return (
        <main
            className="max-w-7xl mx-auto px-4 md:px-8 py-8 font-sans flex-grow animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-forwards"
            id="property-detail-container"
        >
            {/* Breadcrumbs */}
            <div className="flex items-center space-x-2 text-gray-400 dark:text-gray-300 font-label-caps text-[10px] tracking-wider mb-4 uppercase font-semibold select-none">
                <span>Indonesia</span>
                <ChevronRight className="w-3 h-3 text-gray-400" />
                <span>{hotel.city === 'Bali' ? 'Bali' : 'Jakarta'}</span>
                <ChevronRight className="w-3 h-3 text-gray-400" />
                <span className="text-[#031636] dark:text-[#fed023] font-bold">{hotel.city}</span>
            </div>

            {/* Property Title & Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-h1 text-2xl md:text-3xl font-extrabold text-[#031636] dark:text-white mb-2 leading-tight">
                        {hotel.name}
                    </h1>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center text-[#fed023] space-x-0.5">
                            {[...Array(hotel.stars || 5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-[#fed023] stroke-none" />
                            ))}
                        </div>
                        <div className="flex items-center text-gray-400 dark:text-gray-300 font-body-md text-xs md:text-sm">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            {hotel.location}
                        </div>
                    </div>
                </div>

                {/* Share & Like Buttons */}
                <div className="flex items-center space-x-3">
                    <button className="w-11 h-11 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer active:scale-95" title="Bagikan">
                        <Share2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setIsLiked(!isLiked)}
                        className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all cursor-pointer active:scale-95 ${isLiked
                                ? 'bg-red-50 border-red-200 text-red-500'
                                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        title="Suka"
                    >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Bento Grid Image Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3 h-auto md:h-[520px] mb-12 select-none">
                {/* Main Large Image */}
                <div className="md:col-span-2 md:row-span-2 relative rounded-[24px] overflow-hidden group cursor-pointer h-[260px] md:h-auto">
                    <img
                        alt={hotel.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src={hotel.imageUrls[0]}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
                    {/* Custom Tag */}
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white font-label-caps text-[10px] px-3 py-1 rounded-full">
                        Tampak Utama
                    </div>
                </div>

                {/* Top Right Room Interior */}
                <div className="hidden md:block relative rounded-[24px] overflow-hidden group cursor-pointer">
                    <img
                        alt="Interior Kamar"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src={hotel.imageUrls[1]}
                    />
                </div>

                {/* Top Right Bathroom */}
                <div className="hidden md:block relative rounded-[24px] overflow-hidden group cursor-pointer">
                    <img
                        alt="Kamar Mandi"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src={hotel.imageUrls[2]}
                    />
                </div>

                {/* Bottom Right Spa */}
                <div className="hidden md:block relative rounded-[24px] overflow-hidden group cursor-pointer">
                    <img
                        alt="Fasilitas Spa"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src={hotel.imageUrls[3]}
                    />
                </div>

                {/* Bottom Right Restaurant Overlay with "Lihat 42 Foto" */}
                <div className="hidden md:block relative rounded-[24px] overflow-hidden group cursor-pointer">
                    <img
                        alt="Restoran Resort"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src={hotel.imageUrls[4]}
                    />
                    <div className="absolute inset-0 bg-[#031636]/50 hover:bg-[#031636]/65 flex items-center justify-center transition-all">
                        <span className="text-white font-body-lg text-sm font-semibold flex items-center gap-2 select-none">
                            Lihat 42 Foto <Eye className="w-4 h-4" />
                        </span>
                    </div>
                </div>
            </div>

            {/* Grid: Details (8 Columns) & Widget (4 Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
                {/* Property Description & Amenities */}
                <div className="lg:col-span-8 space-y-12">
                    {/* About */}
                    <section>
                        <h2 className="font-h2 text-xl font-bold text-[#031636] dark:text-white mb-4 uppercase tracking-wide">
                            Tentang Properti Ini
                        </h2>
                        <p className="font-body-md text-sm md:text-base text-gray-500 dark:text-gray-300 leading-relaxed mb-4">
                            {hotel.description || "Dengan desain interior yang memadukan keanggunan modern dan sentuhan tradisional, setiap kamar dirancang untuk memberikan kenyamanan maksimal. Nikmati berbagai fasilitas kelas dunia termasuk kolam renang infinity yang ikonis, spa mewah pemenang penghargaan, dan pilihan bersantap eksklusif yang memanjakan lidah Anda."}
                        </p>
                    </section>

                    <hr className="border-gray-100 dark:border-gray-800" />

                    {/* Main Amenities */}
                    <section>
                        <h2 className="font-h2 text-xl font-bold text-[#031636] dark:text-white mb-6 uppercase tracking-wide">
                            Fasilitas Utama
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {hotel.amenities.map((amenity, idx) => (
                                <div key={idx} className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 font-medium text-sm md:text-base">
                                    <div className="w-9 h-9 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center shrink-0">
                                        <Check className="w-4 h-4 text-[#00a858]" />
                                    </div>
                                    <span>{amenity}</span>
                                </div>
                            ))}
                            {hotel.amenities.length === 0 && (
                                <div className="col-span-3 text-gray-500 italic">Belum ada fasilitas yang ditambahkan.</div>
                            )}
                        </div>
                        <div className="mt-8 flex justify-center md:justify-start">
                            <button
                                onClick={() => navigate(`/review/${hotel.id}`)}
                                className="flex items-center space-x-2 bg-[#1A2B4C] hover:bg-[#031636] text-white px-6 py-3 rounded-full font-semibold hover:shadow-md transition-all active:scale-95 text-xs md:text-sm font-label-caps uppercase tracking-wide"
                            >
                                Tulis Ulasan Stay Anda
                            </button>
                        </div>
                    </section>

                    <hr className="border-gray-100 dark:border-gray-800" />

                    {/* Map Location */}
                    <section>
                        <h2 className="font-h2 text-xl font-bold text-[#031636] dark:text-white mb-6 uppercase tracking-wide">
                            Lokasi
                        </h2>
                        <div className="w-full h-[300px] rounded-[24px] overflow-hidden relative bg-gray-100 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 select-none">
                            <img
                                alt="Map view"
                                className="w-full h-full object-cover opacity-80"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfeNreEtciWlXizVPPazEp1TlGlFcE2woodenwfs27v9SYN9HQW32jJ3ZFjaeF2LK6FgmHlU_c-8DQlnyS1DMN5TvhCzbOYP6FOK5YDzd3w88f9W8kt3ap2Dmk1v1ZK284YftBRnAFhJGZcSWKaEe_FDJ88naq4DlJVJBNcgFaDW45pL7CSPMdHzSsuvon2Hute2xeiKAk1VIJXEibEpKBdSVtRtJZJD29TA3cIYXQCD890N4zUmmIPirUJBjgMI5zx62X73nf7tw"
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="bg-[#1a2b4c] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-[#1a2b4c]/30 animate-pulse">
                                    <MapPin className="w-6 h-6 text-[#fed023] fill-[#fed023] stroke-none" />
                                </div>
                            </div>
                        </div>
                        <p className="font-body-md text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-4 flex items-start">
                            <MapPin className="w-5 h-5 mr-2 text-[#031636] dark:text-[#fed023] shrink-0" />
                            {hotel.location} - {hotel.city}
                        </p>
                    </section>
                </div>

                {/* Right Sticky Booking Widget (4 Columns) */}
                <div className="lg:col-span-4">
                    <div className="sticky top-28 bg-white dark:bg-[#1A2B4C] rounded-[24px] border border-gray-200/50 dark:border-gray-800/50 p-6 shadow-xl shadow-gray-200/20 dark:shadow-[#031636]/10 text-left">
                        {/* Pricing */}
                        <div className="flex items-end justify-between mb-6">
                            <div>
                                <span className="font-label-caps text-[10px] font-bold text-gray-400 uppercase block mb-1">
                                    Mulai dari
                                </span>
                                <div className="font-price-display text-[#00a858] flex items-baseline space-x-1">
                                    <span className="text-2xl font-extrabold"><FormatCurrencyAnimated val={currentPrice} /></span>
                                    <span className="font-body-md text-xs text-gray-400 font-medium">/ malam</span>
                                </div>
                            </div>
                        </div>

                        {/* Booking Form */}
                        <div className="space-y-4">
                            {/* CheckIn/CheckOut Picker Inputs */}
                            <div className="grid grid-cols-2 gap-0 border border-gray-300 dark:border-gray-600 rounded-[24px] overflow-hidden divide-x divide-gray-300 dark:divide-gray-600 focus-within:border-[#031636] dark:focus-within:border-[#fed023] transition-all">
                                <div className="p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <label className="block font-label-caps text-[9px] uppercase font-bold text-gray-400 mb-1">
                                        Check-in
                                    </label>
                                    <input
                                        type="text"
                                        className="font-body-md text-xs font-semibold text-gray-800 dark:text-white border-none p-0 w-full focus:ring-0 focus:outline-none bg-transparent"
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                    />
                                </div>
                                <div className="p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <label className="block font-label-caps text-[9px] uppercase font-bold text-gray-400 mb-1">
                                        Check-out
                                    </label>
                                    <input
                                        type="text"
                                        className="font-body-md text-xs font-semibold text-gray-800 dark:text-white border-none p-0 w-full focus:ring-0 focus:outline-none bg-transparent"
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Guests Selector Input */}
                            <div className="border border-gray-300 dark:border-gray-600 rounded-[24px] p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex justify-between items-center focus-within:border-[#031636] dark:focus-within:border-[#fed023]">
                                <div className="w-full">
                                    <label className="block font-label-caps text-[9px] uppercase font-bold text-gray-400 mb-1">
                                        Tamu &amp; Kamar
                                    </label>
                                    <input
                                        type="text"
                                        className="font-body-md text-xs font-semibold text-gray-800 dark:text-white border-none p-0 w-full focus:ring-0 focus:outline-none bg-transparent"
                                        value={guests}
                                        onChange={(e) => setGuests(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Room Type Selector Input */}
                            {roomTypes.length > 0 && (
                                <div className="border border-gray-300 dark:border-gray-600 rounded-[24px] p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors focus-within:border-[#031636] dark:focus-within:border-[#fed023]">
                                    <label className="block font-label-caps text-[9px] uppercase font-bold text-gray-400 mb-1">
                                        Pilih Tipe Kamar
                                    </label>
                                    <select
                                        className="font-body-md text-xs font-semibold text-gray-800 dark:text-white border-none p-0 w-full focus:ring-0 focus:outline-none bg-transparent cursor-pointer appearance-none"
                                        value={selectedRoomTypeId}
                                        onChange={(e) => setSelectedRoomTypeId(e.target.value)}
                                    >
                                        {roomTypes.map(rt => (
                                            <option key={rt.id} value={rt.id} className="text-gray-800">
                                                {rt.name} - {formatCurrency(rt.price)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Total calculations */}
                            <div className="pt-4 flex justify-between items-center font-body-md text-xs md:text-sm">
                                <span className="text-gray-400 dark:text-gray-300 underline decoration-dashed underline-offset-4 cursor-help flex items-center gap-1 select-none">
                                    Total (termasuk pajak) <HelpCircle className="w-3.5 h-3.5" />
                                </span>
                                <span className="font-extrabold text-[#031636] dark:text-white">
                                    <FormatCurrencyAnimated val={currentPrice * calculatedNights} />
                                </span>
                            </div>

                            {selectedRoomType && (String((selectedRoomType as any).status).toUpperCase() === 'OCCUPIED' || String((selectedRoomType as any).status).toUpperCase() === 'TERISI' || selectedRoomType.unitsAvailable === 0) ? (
                                <button disabled className="w-full h-[56px] bg-gray-400 dark:bg-gray-600 text-white dark:text-gray-300 cursor-not-allowed rounded-full font-body-lg text-sm tracking-wide font-extrabold mt-6 flex items-center justify-center">
                                    Kamar Penuh
                                </button>
                            ) : (
                                <button
                                    onClick={handleBookNow}
                                    className="w-full h-[56px] bg-[#1A2B4C] hover:bg-[#031636] dark:bg-[#fed023] dark:hover:bg-[#eec209] text-white dark:text-[#031636] rounded-full font-body-lg text-sm tracking-wide font-extrabold mt-6 hover:shadow-lg transition-all flex items-center justify-center active:scale-[0.98]"
                                >
                                    Pesan Sekarang
                                </button>
                            )}
                            <p className="text-center font-body-md text-[11px] font-semibold text-gray-400 mt-4 select-none">
                                Anda belum akan dikenakan biaya
                            </p>
                        </div>
                    </div>
                </div>

                {/* Daftar Ulasan Pengunjung */}
                <section className="mt-12">
                    <h2 className="text-2xl font-display font-bold text-[#031636] dark:text-white mb-6">Daftar Ulasan Pengunjung</h2>
                    {reviews.length > 0 ? (
                        <>
                            <div className="mb-6 flex items-center gap-2 text-[#031636] dark:text-white">
                                <span className="text-xl font-bold">⭐ {(
                                    reviews.reduce((acc, r) => {
                                        const avg = r.rating ?? ((Number(r.ratingKebersihan||0) + Number(r.ratingPelayanan||0) + Number(r.ratingLokasi||0) + Number(r.ratingFasilitas||0)) / 4);
                                        return acc + avg;
                                    }, 0) / reviews.length
                                ).toFixed(1)} / 5</span>
                                <span className="text-gray-500 dark:text-gray-400">dari {reviews.length} ulasan</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {reviews.map(review => (
                                    <div key={review.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
                                                    {(review.userName || review.user?.name || review.guestName || 'A').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="font-semibold text-[#031636] dark:text-white">
                                                    {review.userName || review.user?.name || review.guestName || 'Anonim'}
                                                </div>
                                            </div>
                                            <div className="flex text-yellow-400">
                                                {(() => {
                                                    const avgRating = review.rating ?? Math.round((Number(review.ratingKebersihan||0) + Number(review.ratingPelayanan||0) + Number(review.ratingLokasi||0) + Number(review.ratingFasilitas||0)) / 4);
                                                    return [...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-4 h-4 ${i < avgRating ? 'fill-yellow-400' : 'fill-gray-200 dark:fill-gray-600 text-gray-200 dark:text-gray-600'}`} />
                                                    ));
                                                })()}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm italic">"{review.comment}"</p>
                                        <div className="text-xs text-gray-400 mt-auto pt-4">
                                            {new Date(review.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">Belum ada ulasan untuk hotel ini.</p>
                    )}
                </section>
            </div>
        </main>
    );
}
