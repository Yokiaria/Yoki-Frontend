import React, { useState, useMemo, useEffect } from 'react';
import { Hotel } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, MapPin, Star, Sparkles, CheckCircle } from 'lucide-react';
import { AnimatedCounter } from './AnimatedUI';
import { apiClient } from '../api/apiClient';

interface SearchResultsProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    setSelectedHotelId: (id: string) => void;
    hotels: Hotel[];
}

export default function SearchResults({
    searchQuery,
    setSearchQuery,
    setSelectedHotelId,
    hotels, // fallback statis
}: SearchResultsProps) {
    const [priceRange, setPriceRange] = useState<number>(15000000);
    const [selectedStars, setSelectedStars] = useState<number[]>([3, 4, 5]);
    const navigate = useNavigate();
    const location = useLocation();

    const [dynamicHotels, setDynamicHotels] = useState<Hotel[] | null>(null);
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);

    // Dapatkan URL Params
    const queryParams = new URLSearchParams(location.search);
    const urlLocation = queryParams.get('location') || searchQuery || 'Bali';
    const checkIn = queryParams.get('checkIn');
    const checkOut = queryParams.get('checkOut');
    const guests = queryParams.get('guests');
    const rooms = queryParams.get('rooms');

    const [locationKeyword, setLocationKeyword] = useState<string>(urlLocation);

    useEffect(() => {
        let isMounted = true;
        // Jika parameter advanced (checkIn, guests) tersedia, tembak API search
        if (checkIn && guests) {
            setIsLoadingSearch(true);
            const query = new URLSearchParams();
            if (urlLocation) query.append('location', urlLocation);
            if (checkIn) query.append('checkIn', checkIn);
            if (checkOut) query.append('checkOut', checkOut);
            if (guests) query.append('guests', guests);
            if (rooms) query.append('rooms', rooms);

            apiClient.get<Hotel[]>(`/rooms/search?${query.toString()}`).then((res) => {
                if (isMounted) {
                    setDynamicHotels(Array.isArray(res) ? res : []);
                }
            }).catch(err => {
                console.error("Gagal mengambil dynamic search", err);
                if (isMounted) setDynamicHotels([]); // fallback kosong
            }).finally(() => {
                if (isMounted) setIsLoadingSearch(false);
            });
        } else {
            // Fallback ke data statis
            setDynamicHotels(null);
        }

        return () => { isMounted = false; };
    }, [urlLocation, checkIn, checkOut, guests, rooms]);

    const handleStarToggle = (star: number) => {
        if (selectedStars.includes(star)) {
            setSelectedStars(selectedStars.filter((s) => s !== star));
        } else {
            setSelectedStars([...selectedStars, star]);
        }
    };

    const filteredHotels = useMemo(() => {
        const kw = (locationKeyword || '').toLowerCase();
        const baseHotels = dynamicHotels !== null ? dynamicHotels : (hotels || []);
        
        return baseHotels.filter((hotel) => {
            if (!hotel) return false;
            // Filter by location / name keyword
            const matchesKeyword =
                (hotel.name || '').toLowerCase().includes(kw) ||
                (hotel.location || '').toLowerCase().includes(kw) ||
                (hotel.city || '').toLowerCase().includes(kw);

            // Filter by stars
            const matchesStars = selectedStars.length === 0 || selectedStars.includes(hotel.stars);

            // Filter by price
            const matchesPrice = (hotel.pricePerNight || 0) <= priceRange;

            return matchesKeyword && matchesStars && matchesPrice;
        });
    }, [hotels, dynamicHotels, locationKeyword, selectedStars, priceRange]);

    const handleSelectHotel = (hotelId: string) => {
        setSelectedHotelId(hotelId);
        navigate(`/hotel/${hotelId}`);
    };

    const formatCurrency = (val: number) => {
        return 'Rp ' + val.toLocaleString('id-ID');
    };
    const FormatCurrencyAnimated = ({ val }: { val: number }) => (
        <>Rp <AnimatedCounter targetValue={val} /></>
    );

    return (
        <main
            className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 md:grid-cols-12 gap-6 font-sans flex-grow"
            id="search-results-container"
        >
            {/* Sidebar Filters */}
            <aside className="col-span-12 md:col-span-3 space-y-6">
                <div className="bg-white dark:bg-[#1A2B4C] rounded-[24px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm sticky top-24 transition-colors">
                    <h2 className="font-h2 text-lg font-bold text-[#031636] dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-2">
                        Filter Pencarian
                    </h2>

                    {/* Search Keyword Input */}
                    <div className="mb-6">
                        <label className="font-label-caps text-[10px] uppercase font-bold text-gray-400 block mb-2">
                            LOKASI ATAU NAMA HOTEL
                        </label>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                className="w-full h-[48px] pl-11 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#031636] focus:ring-1 focus:ring-[#031636] dark:focus:ring-[#fed023] dark:focus:border-[#fed023] transition-all font-body-md text-sm text-[#031636] dark:text-white outline-none"
                                type="text"
                                value={locationKeyword}
                                onChange={(e) => setLocationKeyword(e.target.value)}
                                placeholder="Cari destinasi..."
                            />
                        </div>
                    </div>

                    {/* Price Range Slider */}
                    <div className="mb-6">
                        <h3 className="font-label-caps text-[10px] uppercase font-bold text-gray-400 block mb-3">
                            RENTANG HARGA PER MALAM
                        </h3>
                        <input
                            className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#031636] dark:accent-[#fed023]"
                            max="20000000"
                            min="0"
                            step="500000"
                            type="range"
                            value={priceRange}
                            onChange={(e) => setPriceRange(Number(e.target.value))}
                        />
                        <div className="flex justify-between mt-2 font-body-md text-xs text-gray-400 dark:text-gray-300 font-semibold">
                            <span>Rp 0</span>
                            <span>Maks: {formatCurrency(priceRange)}</span>
                        </div>
                    </div>

                    {/* Dynamic Filter Section */}
                        <div>
                            <h3 className="font-label-caps text-[10px] uppercase font-bold text-gray-400 block mb-3">
                                BINTANG HOTEL
                            </h3>
                            <div className="space-y-3">
                                {[5, 4, 3].map((star) => (
                                    <label key={star} className="flex items-center space-x-3 cursor-pointer group select-none transition-all duration-200 hover:scale-105 active:scale-95">
                                        <input
                                            checked={selectedStars.includes(star)}
                                            onChange={() => handleStarToggle(star)}
                                            className="rounded border-gray-300 dark:border-gray-600 text-[#031636] dark:text-[#fed023] focus:ring-[#031636] dark:focus:ring-[#fed023] w-4 h-4 bg-white dark:bg-gray-800"
                                            type="checkbox"
                                        />
                                        <div className="flex items-center text-[#fed023] gap-0.5">
                                            {[...Array(star)].map((_, idx) => (
                                                <Star key={idx} className="w-4 h-4 fill-[#fed023] stroke-none" />
                                            ))}
                                            <span className="text-xs text-gray-400 dark:text-gray-300 ml-1 font-medium">
                                                Bintang {star}
                                            </span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                </div>
            </aside>

            {/* Search Listings */}
            <div className="col-span-12 md:col-span-9 space-y-6">
                        <div className="flex justify-between items-end mb-4 gap-4">
                            <h1 className="font-h1 text-xl md:text-2xl font-bold text-[#031636] dark:text-white uppercase tracking-tight">
                                Akomodasi di {locationKeyword || 'Indonesia'}
                            </h1>
                            <span className="font-body-md text-xs md:text-sm text-gray-400 dark:text-gray-300 font-semibold whitespace-nowrap">
                                Menampilkan {filteredHotels.length} hasil
                            </span>
                        </div>

                        {isLoadingSearch ? (
                            <div className="py-20 flex flex-col items-center justify-center text-center">
                                <div className="w-12 h-12 border-4 border-gray-200 border-t-[#fed023] rounded-full animate-spin mb-4"></div>
                                <p className="text-[#031636] dark:text-white font-bold">Mencari ketersediaan kamar yang akurat...</p>
                                <p className="text-sm text-gray-500 mt-2">Menyesuaikan jadwal dan kapasitas tamu Anda.</p>
                            </div>
                        ) : filteredHotels.length > 0 ? (
                            filteredHotels.map((hotel) => (
                                <div
                                    key={hotel.id}
                                    className="bg-white dark:bg-[#1A2B4C] rounded-[24px] shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800/40 flex flex-col md:flex-row overflow-hidden group transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer"
                                >
                                    {/* Hotel Image Card Side */}
                                    <div className="relative w-full md:w-[320px] h-[220px] md:h-auto shrink-0 overflow-hidden select-none">
                                        <img
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            src={hotel.thumbnailUrl}
                                            alt={hotel.name}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#031636]/60 via-transparent to-transparent opacity-60"></div>
                                    </div>

                                    {/* Hotel Details Side */}
                                    <div className="p-6 flex flex-col flex-grow justify-between text-left">
                                        <div>
                                            <div className="flex justify-between items-start mb-2 gap-4">
                                                <div>
                                                    <h3 className="font-h2 text-lg md:text-xl font-extrabold text-[#031636] dark:text-white group-hover:text-[#1a2b4c] dark:group-hover:text-[#fed023] transition-colors leading-snug">
                                                        {hotel.name}
                                                    </h3>
                                                    <div className="flex items-center space-x-0.5 mt-1 text-[#fed023]">
                                                        {[...Array(hotel.stars)].map((_, i) => (
                                                            <Star key={i} className="w-3.5 h-3.5 fill-[#fed023] stroke-none" />
                                                        ))}
                                                    </div>
                                                    <div className="flex items-center mt-2.5 text-gray-400 dark:text-gray-300 font-body-md text-xs md:text-sm">
                                                        <MapPin className="w-4 h-4 mr-1 text-gray-400 shrink-0" />
                                                        {hotel.location}
                                                    </div>
                                                </div>

                                                {/* Review Badge */}
                                                <div className="bg-[#fed023]/10 dark:bg-[#fed023]/20 text-[#735c00] dark:text-[#fed023] px-3 py-2 rounded-xl flex flex-col items-center justify-center min-w-[68px] border border-[#fed023]/20 shadow-sm shrink-0 select-none">
                                                    <span className="font-price-display text-base font-extrabold leading-none">
                                                        {hotel.rating ? Number(hotel.rating).toFixed(1) : "0.0"}
                                                    </span>
                                                    <span className="font-label-caps text-[9px] uppercase mt-1 font-bold tracking-wider opacity-90">
                                                        {hotel.ratingText}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <ul className="space-y-1.5 font-body-md text-xs md:text-sm text-gray-500 dark:text-gray-400">
                                                    {hotel.amenities.slice(0, 2).map((amenity, idx) => (
                                                        <li key={idx} className="flex items-center font-medium">
                                                            <CheckCircle className="w-4 h-4 mr-2 text-[#00a858] shrink-0" /> {amenity}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Pricing & CTA Button */}
                                        <div className="mt-6 flex flex-col md:flex-row justify-between items-end border-t border-gray-100 dark:border-gray-800/40 pt-4 gap-4">
                                            <div>
                                                {hotel.scarcityText && (
                                                    <div className="inline-flex items-center bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 px-3 py-1.5 rounded-full font-label-caps text-[10px] font-bold select-none">
                                                        <Sparkles className="w-3.5 h-3.5 mr-1 fill-red-100 dark:fill-red-950/20" />
                                                        {hotel.scarcityText}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-right w-full md:w-auto flex flex-col items-end">
                                                {hotel.originalPricePerNight && (
                                                    <span className="font-body-md text-xs text-gray-400 dark:text-gray-400 line-through mb-0.5">
                                                        <FormatCurrencyAnimated val={hotel.originalPricePerNight} />
                                                    </span>
                                                )}
                                                <span className="font-price-display text-xl text-[#00a858] font-black leading-none">
                                                    <FormatCurrencyAnimated val={hotel.pricePerNight} />
                                                </span>
                                                <span className="font-body-md text-[10px] uppercase font-bold text-gray-400 mt-1 mb-3">
                                                    per malam
                                                </span>
                                                <button
                                                    onClick={() => handleSelectHotel(hotel.id)}
                                                    className="bg-[#1A2B4C] hover:bg-[#031636] dark:bg-[#fed023] dark:hover:bg-[#eec209] text-white dark:text-[#031636] rounded-full h-[48px] px-6 font-body-md text-xs md:text-sm font-bold hover:shadow-md transition-all w-full md:w-auto active:scale-95 duration-200 hover:scale-[1.03]"
                                                >
                                                    Pilih Kamar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 bg-white dark:bg-[#1A2B4C] rounded-[24px] border border-gray-100 dark:border-gray-800">
                                <p className="font-body-lg text-gray-400 mb-2">Tidak ada akomodasi yang cocok dengan kriteria Anda.</p>
                                <button
                                    onClick={() => {
                                        setLocationKeyword('');
                                        setPriceRange(15000000);
                                        setSelectedStars([3, 4, 5]);
                                    }}
                                    className="text-[#031636] dark:text-[#fed023] font-bold underline text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                                >
                                    Reset Filter
                                </button>
                            </div>
                        )}
            </div>
        </main>
    );
}
