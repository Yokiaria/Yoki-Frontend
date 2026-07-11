import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Hotel as HotelIcon, Plane, MapPin, Calendar, Users, Star, ArrowRight, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';
import { AnimatedCounter } from './AnimatedUI';
import { apiClient } from '../api/apiClient';
import { Hotel } from '../types';

interface LandingPageProps {
    
    setSearchQuery: (query: string) => void;
    setSelectedHotelId: (id: string) => void;
}

export default function LandingPage({
    
    setSearchQuery,
    setSelectedHotelId,
}: LandingPageProps) {
    const [location, setLocation] = useState('');
    const [dates, setDates] = useState('24 Okt - 27 Okt 2024');
    const navigate = useNavigate();
    const [featuredHotels, setFeaturedHotels] = useState<Hotel[]>([]);
    const [availableLocations, setAvailableLocations] = useState<string[]>(['Bali, Indonesia']);
    const [showGuestPopover, setShowGuestPopover] = useState(false);
    const [guestCounters, setGuestCounters] = useState({ rooms: 1, adults: 2, children: 0 });

    const formattedGuestsText = `${guestCounters.adults} Dewasa${guestCounters.children > 0 ? `, ${guestCounters.children} Anak` : ''}, ${guestCounters.rooms} Kamar`;

    useEffect(() => {
        apiClient.get<Hotel[]>('/hotels')
            .then(hotels => {
                if (Array.isArray(hotels) && hotels.length > 0) {
                    setFeaturedHotels([...hotels].reverse().slice(0, 3));
                }
            })
            .catch(err => console.error("Failed to fetch hotels for landing page", err));

        // Fetch locations
        apiClient.get<string[]>('/hotels/locations')
            .then(locs => {
                if (Array.isArray(locs) && locs.length > 0) {
                    setAvailableLocations(locs);
                    if (!location) setLocation(locs[0]);
                }
            })
            .catch(err => console.error("Failed to fetch locations", err));
    }, []);

    const handleSearch = () => {
        setSearchQuery(location);
        
        // Parse dates string
        const dateParts = dates.split('-');
        const ci = dateParts[0]?.trim();
        const co = dateParts[1]?.trim();

        const totalGuests = guestCounters.adults + guestCounters.children;

        localStorage.setItem('search_rooms', guestCounters.rooms.toString());
        localStorage.setItem('search_guests_text', formattedGuestsText);
        localStorage.setItem('search_guests_count', totalGuests.toString());

        const params = new URLSearchParams({
            location: location,
            checkIn: ci || '',
            checkOut: co || '',
            guests: totalGuests.toString(),
            rooms: guestCounters.rooms.toString(),
        });

        navigate(`/search?${params.toString()}`);
    };

    const handleSelectFeatured = (hotelId: string) => {
        setSelectedHotelId(hotelId);
        navigate(`/hotel/${hotelId}`);
    };

    return (
        <div className="flex-grow flex flex-col font-sans animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-forwards" id="landing-page-wrapper">
            {/* Hero Header */}
            <header className="relative w-full h-[650px] min-h-[500px] flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 w-full h-full">
                    <img
                        alt="Resort"
                        className="w-full h-full object-cover select-none"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQLmK94bl1NIUEtBQOXcu32N-UeqOedt3CIrGKMlOfoYVKVK8eduPxiokqbkLny00q4XK9Ec0do0egd2sLPe_5njVWP9NjWmJpJygCUXy6wK21mIzhiRvEBfQYhlGby5H03WPBLTzt_DRTzlWuOG9IvoCL1tDt18o-ac3nN8W1CD2rQUQTKp22v3ANpS1t0FsnQIt_KOQBwvbAbzHXk-OkngSS0T90vt9dhUK4DjUpB1EKHu3gLmsv-1bC9Um07SqdgXaD6Lf1wsE"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1A2B4C]/50 via-transparent to-[#f7f9fb] dark:to-[#031636]"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mb-12">
                    <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl text-white drop-shadow-lg mb-4 font-extrabold tracking-tight">
                        Temukan Kemewahan Sejati
                    </h1>
                    <p className="font-body-lg text-base md:text-lg lg:text-xl text-white/95 drop-shadow-md max-w-2xl mx-auto font-medium leading-relaxed">
                        Kurasi eksklusif destinasi paling prestisius di Indonesia, dirancang khusus untuk kenyamanan Anda.
                    </p>
                </div>
            </header>

            {/* Interactive Search Panel */}
            <section className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 -mt-24 mb-24">
                <div className="bg-white/85 dark:bg-[#1a2b4c]/85 backdrop-blur-2xl p-6 md:p-8 rounded-[24px] shadow-[0_10px_30px_-10px_rgba(3,22,54,0.15)] border border-gray-200/50 dark:border-gray-800/50 flex flex-col gap-6">

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* Location Input */}
                        <div className="md:col-span-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-[24px] border border-gray-200/50 dark:border-gray-700/50 p-4 focus-within:border-[#031636] focus-within:ring-1 focus-within:ring-[#031636] transition-all group">
                            <label className="font-label-caps text-[10px] uppercase font-bold text-gray-400 block mb-1">
                                Lokasi
                            </label>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-gray-400 group-focus-within:text-[#031636] dark:group-focus-within:text-[#fed023]" />
                                <select
                                    className="bg-transparent border-none outline-none w-full font-body-md text-sm text-[#031636] dark:text-white p-0 focus:ring-0 focus:outline-none appearance-none cursor-pointer"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                >
                                    {availableLocations.map((loc, idx) => (
                                        <option key={idx} value={loc} className="text-gray-900">{loc}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Dates Input */}
                        <div className="md:col-span-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-[24px] border border-gray-200/50 dark:border-gray-700/50 p-4 focus-within:border-[#031636] focus-within:ring-1 focus-within:ring-[#031636] transition-all group">
                            <label className="font-label-caps text-[10px] uppercase font-bold text-gray-400 block mb-1">
                                Tanggal
                            </label>
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-gray-400 group-focus-within:text-[#031636] dark:group-focus-within:text-[#fed023]" />
                                <input
                                    className="bg-transparent border-none outline-none w-full font-body-md text-sm text-[#031636] dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 p-0 focus:ring-0 focus:outline-none"
                                    placeholder="Pilih Tanggal"
                                    type="text"
                                    value={dates}
                                    onChange={(e) => setDates(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Guests Input */}
                        <div className="md:col-span-3 relative bg-gray-50/50 dark:bg-gray-800/30 rounded-[24px] border border-gray-200/50 dark:border-gray-700/50 p-4 focus-within:border-[#031636] focus-within:ring-1 focus-within:ring-[#031636] transition-all group">
                            <label className="font-label-caps text-[10px] uppercase font-bold text-gray-400 block mb-1">
                                Tamu &amp; Kamar
                            </label>
                            <div 
                                className="flex items-center gap-3 cursor-pointer" 
                                onClick={() => setShowGuestPopover(!showGuestPopover)}
                            >
                                <Users className="w-5 h-5 text-gray-400 group-focus-within:text-[#031636] dark:group-focus-within:text-[#fed023]" />
                                <div className="w-full font-body-md text-sm text-[#031636] dark:text-white truncate">
                                    {formattedGuestsText}
                                </div>
                            </div>

                            {/* Guest Popover */}
                            {showGuestPopover && (
                                <div className="absolute top-[110%] left-0 w-[280px] bg-white dark:bg-[#1A2B4C] rounded-2xl shadow-xl border border-gray-150 dark:border-gray-700 p-4 z-50">
                                    <div className="flex flex-col gap-4">
                                        {/* Kamar */}
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-[#031636] dark:text-white">Kamar</span>
                                            <div className="flex items-center gap-3">
                                                <button 
                                                    onClick={() => setGuestCounters(p => ({ ...p, rooms: Math.max(1, p.rooms - 1) }))}
                                                    className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    -
                                                </button>
                                                <span className="w-4 text-center text-sm font-bold text-[#031636] dark:text-white">{guestCounters.rooms}</span>
                                                <button 
                                                    onClick={() => setGuestCounters(p => ({ ...p, rooms: Math.min(8, p.rooms + 1) }))}
                                                    className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        {/* Dewasa */}
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-[#031636] dark:text-white">Dewasa</span>
                                            <div className="flex items-center gap-3">
                                                <button 
                                                    onClick={() => setGuestCounters(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
                                                    className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    -
                                                </button>
                                                <span className="w-4 text-center text-sm font-bold text-[#031636] dark:text-white">{guestCounters.adults}</span>
                                                <button 
                                                    onClick={() => setGuestCounters(p => ({ ...p, adults: Math.min(16, p.adults + 1) }))}
                                                    className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        {/* Anak */}
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-[#031636] dark:text-white">Anak-anak</span>
                                            <div className="flex items-center gap-3">
                                                <button 
                                                    onClick={() => setGuestCounters(p => ({ ...p, children: Math.max(0, p.children - 1) }))}
                                                    className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    -
                                                </button>
                                                <span className="w-4 text-center text-sm font-bold text-[#031636] dark:text-white">{guestCounters.children}</span>
                                                <button 
                                                    onClick={() => setGuestCounters(p => ({ ...p, children: Math.min(10, p.children + 1) }))}
                                                    className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setShowGuestPopover(false)}
                                        className="mt-4 w-full bg-[#1A2B4C] dark:bg-[#fed023] text-white dark:text-[#031636] py-2 rounded-xl font-bold text-sm hover:opacity-90"
                                    >
                                        Selesai
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="md:col-span-2">
                            <button
                                onClick={handleSearch}
                                className="w-full h-full min-h-[56px] bg-[#1A2B4C] hover:bg-[#031636] dark:bg-[#fed023] dark:hover:bg-[#eec209] text-white dark:text-[#031636] rounded-[24px] font-label-caps text-sm tracking-wider font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md hover:shadow-lg"
                            >
                                <Search className="w-4 h-4" />
                                CARI
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Section */}
            <main className="w-full max-w-7xl mx-auto px-4 md:px-8 pb-24">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
                    <div>
                        <h2 className="font-h1 text-2xl md:text-3xl font-extrabold text-[#1A2B4C] dark:text-[#d8e2ff] mb-2">
                            Destinasi Elit Minggu Ini
                        </h2>
                        <p className="font-body-md text-sm md:text-base text-gray-500 dark:text-gray-400">
                            Kurasi eksklusif penginapan mewah dengan penawaran terbaik.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/search')}
                        className="font-label-caps text-xs uppercase tracking-wider text-[#1A2B4C] dark:text-[#fed023] hover:underline font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    >
                        Lihat Semua <Search className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Featured Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {featuredHotels.length > 0 && (
                        <>
                            {/* Main Large Card (First Hotel) */}
                            <article
                                onClick={() => handleSelectFeatured(featuredHotels[0].id)}
                                className="lg:col-span-8 rounded-[24px] overflow-hidden relative group cursor-pointer border border-gray-200/40 dark:border-gray-800/40 shadow-sm hover:shadow-xl transition-all duration-300 h-[400px] lg:h-[500px]"
                            >
                                <img
                                    alt={featuredHotels[0].name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                                    src={featuredHotels[0].thumbnailUrl || (featuredHotels[0].imageUrls && featuredHotels[0].imageUrls[0]) || 'https://picsum.photos/800/600'}
                                />
                                {/* Dark Vignette Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#031636]/90 via-[#031636]/30 to-transparent opacity-90 transition-opacity"></div>

                                {/* Recommendation badge */}
                                <div className="absolute top-6 left-6">
                                    <span className="bg-[#FEF9E7] text-[#735c00] font-label-caps text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                                        <Star className="w-3.5 h-3.5 fill-[#fed023] stroke-none" /> Rekomendasi
                                    </span>
                                </div>

                                {/* Bottom Info Row */}
                                <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 z-10">
                                    <div className="w-full md:w-2/3">
                                        <h3 className="text-xl md:text-3xl font-extrabold text-white mb-2 drop-shadow-md">
                                            {featuredHotels[0].name}
                                        </h3>
                                        <p className="font-body-md text-sm text-white/90 flex items-center gap-1 mb-3">
                                            <MapPin className="w-4 h-4 text-[#fed023]" /> {featuredHotels[0].location || featuredHotels[0].city}
                                        </p>
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < (featuredHotels[0].stars || 5) ? 'fill-[#fed023]' : 'fill-gray-400'} stroke-none`} />
                                            ))}
                                            <span className="font-body-md text-xs text-white ml-2">
                                                ({featuredHotels[0].rating}/5 {featuredHotels[0].ratingText})
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-left md:text-right w-full md:w-auto shrink-0">
                                        <p className="font-label-caps text-[10px] uppercase tracking-wider text-white/70 mb-1">
                                            Mulai dari / malam
                                        </p>
                                        <p className="font-price-display text-lg text-[#00a858] bg-white/95 dark:bg-gray-900/90 backdrop-blur-md px-4 py-2 rounded-full inline-block shadow-lg font-extrabold">
                                            Rp <AnimatedCounter targetValue={featuredHotels[0].pricePerNight || 0} />
                                        </p>
                                    </div>
                                </div>
                            </article>

                            {/* Right Two Column Stack */}
                            {featuredHotels.length > 1 && (
                                <div className="lg:col-span-4 flex flex-col gap-6">
                                    {featuredHotels.slice(1, 3).map((hotel) => (
                                        <article
                                            key={hotel.id}
                                            onClick={() => handleSelectFeatured(hotel.id)}
                                            className="flex-1 rounded-[24px] overflow-hidden relative group cursor-pointer border border-gray-200/40 dark:border-gray-800/40 shadow-sm hover:shadow-xl transition-all duration-300 min-h-[200px] flex flex-col justify-end p-5"
                                        >
                                            <img
                                                alt={hotel.name}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                                                src={hotel.thumbnailUrl || (hotel.imageUrls && hotel.imageUrls[0]) || 'https://picsum.photos/400/300'}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#031636]/90 via-[#031636]/40 to-transparent"></div>

                                            <div className="relative z-10 flex flex-col justify-between h-full">
                                                <div></div>
                                                <div className="mt-8">
                                                    <h3 className="text-lg font-bold text-white mb-1">{hotel.name}</h3>
                                                    <p className="font-body-md text-xs text-white/80 flex items-center gap-1 mb-2">
                                                        <MapPin className="w-3.5 h-3.5 text-[#fed023]" /> {hotel.location || hotel.city}
                                                    </p>
                                                    <div className="flex justify-between items-end mt-4">
                                                        <div className="flex items-center gap-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className={`w-3.5 h-3.5 ${i < (hotel.stars || 5) ? 'fill-[#fed023]' : 'fill-gray-400'} stroke-none`} />
                                                            ))}
                                                        </div>
                                                        <div>
                                                            <p className="font-price-display text-xs text-[#00a858] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-3 py-1 rounded-full font-extrabold shadow-sm">
                                                                Rp <AnimatedCounter targetValue={hotel.pricePerNight || 0} />
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
