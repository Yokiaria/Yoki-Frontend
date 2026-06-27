import React, { useState, useMemo } from 'react';
import { ActiveTab, Hotel, Flight } from '../types';
import { Search, MapPin, Star, Sparkles, CheckCircle, Plane, ArrowRight, ShieldCheck } from 'lucide-react';

interface SearchResultsProps {
    setActiveTab: (tab: ActiveTab) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    setSelectedHotelId: (id: string) => void;
    hotels: Hotel[];
    searchType: 'hotel' | 'flight';
    setSearchType: (type: 'hotel' | 'flight') => void;
    setSelectedFlight: (flight: Flight | null) => void;
}

const MOCK_FLIGHTS: Flight[] = [
    {
        id: 'GA-402',
        airline: 'Garuda Indonesia',
        flightNumber: 'GA-402',
        fromCode: 'CGK',
        fromName: 'Jakarta (Soekarno-Hatta)',
        toCode: 'DPS',
        toName: 'Bali (Ngurah Rai)',
        departureTime: '08:30',
        arrivalTime: '11:20',
        duration: '1j 50m',
        price: 2450000,
        classType: 'Business',
        inclusions: ['Bagasi Kabin 7kg', 'Bagasi Terdaftar 30kg', 'Premium Meal', 'Wi-Fi gratis', 'Akses Lounge']
    },
    {
        id: 'GS-881',
        airline: 'GrandStar Elite',
        flightNumber: 'GS-881',
        fromCode: 'CGK',
        fromName: 'Jakarta (Soekarno-Hatta)',
        toCode: 'DPS',
        toName: 'Bali (Ngurah Rai)',
        departureTime: '10:15',
        arrivalTime: '13:05',
        duration: '1j 50m',
        price: 5800000,
        classType: 'First Class',
        inclusions: ['Bagasi Kabin 10kg', 'Bagasi Terdaftar 40kg', 'Premium Fine Dining', 'Wi-Fi Cepat', 'Akses First Class Lounge', 'Flatbed Seat']
    },
    {
        id: 'ID-6050',
        airline: 'Batik Air',
        flightNumber: 'ID-6050',
        fromCode: 'CGK',
        fromName: 'Jakarta (Soekarno-Hatta)',
        toCode: 'DPS',
        toName: 'Bali (Ngurah Rai)',
        departureTime: '14:00',
        arrivalTime: '16:50',
        duration: '1j 50m',
        price: 1350000,
        classType: 'Economy',
        inclusions: ['Bagasi Kabin 7kg', 'Bagasi Terdaftar 20kg', 'Snack Box']
    },
    {
        id: 'GA-410',
        airline: 'Garuda Indonesia',
        flightNumber: 'GA-410',
        fromCode: 'CGK',
        fromName: 'Jakarta (Soekarno-Hatta)',
        toCode: 'DPS',
        toName: 'Bali (Ngurah Rai)',
        departureTime: '17:30',
        arrivalTime: '20:20',
        duration: '1j 50m',
        price: 3200000,
        classType: 'Business',
        inclusions: ['Bagasi Kabin 7kg', 'Bagasi Terdaftar 30kg', 'In-flight Dinner', 'Akses Lounge']
    }
];

export default function SearchResults({
    setActiveTab,
    searchQuery,
    setSearchQuery,
    setSelectedHotelId,
    hotels,
    searchType,
    setSearchType,
    setSelectedFlight,
}: SearchResultsProps) {
    const [priceRange, setPriceRange] = useState<number>(15000000);
    const [selectedStars, setSelectedStars] = useState<number[]>([4, 5]);
    const [selectedClassTypes, setSelectedClassTypes] = useState<string[]>(['Economy', 'Business', 'First Class']);
    const [locationKeyword, setLocationKeyword] = useState<string>(searchQuery || 'Bali');

    const handleStarToggle = (star: number) => {
        if (selectedStars.includes(star)) {
            setSelectedStars(selectedStars.filter((s) => s !== star));
        } else {
            setSelectedStars([...selectedStars, star]);
        }
    };

    const handleClassTypeToggle = (classType: string) => {
        if (selectedClassTypes.includes(classType)) {
            setSelectedClassTypes(selectedClassTypes.filter((c) => c !== classType));
        } else {
            setSelectedClassTypes([...selectedClassTypes, classType]);
        }
    };

    const filteredHotels = useMemo(() => {
        return hotels.filter((hotel) => {
            // Filter by location / name keyword
            const matchesKeyword =
                hotel.name.toLowerCase().includes(locationKeyword.toLowerCase()) ||
                hotel.location.toLowerCase().includes(locationKeyword.toLowerCase()) ||
                hotel.city.toLowerCase().includes(locationKeyword.toLowerCase());

            // Filter by stars
            const matchesStars = selectedStars.includes(hotel.stars);

            // Filter by price
            const matchesPrice = hotel.pricePerNight <= priceRange;

            return matchesKeyword && matchesStars && matchesPrice;
        });
    }, [hotels, locationKeyword, selectedStars, priceRange]);

    const filteredFlights = useMemo(() => {
        return MOCK_FLIGHTS.filter((flight) => {
            const matchesKeyword =
                flight.airline.toLowerCase().includes(locationKeyword.toLowerCase()) ||
                flight.fromName.toLowerCase().includes(locationKeyword.toLowerCase()) ||
                flight.toName.toLowerCase().includes(locationKeyword.toLowerCase()) ||
                flight.fromCode.toLowerCase().includes(locationKeyword.toLowerCase()) ||
                flight.toCode.toLowerCase().includes(locationKeyword.toLowerCase());

            const matchesClass = selectedClassTypes.includes(flight.classType);
            const matchesPrice = flight.price <= priceRange;

            return matchesKeyword && matchesClass && matchesPrice;
        });
    }, [locationKeyword, selectedClassTypes, priceRange]);

    const handleSelectHotel = (hotelId: string) => {
        setSelectedHotelId(hotelId);
        setActiveTab('detail');
    };

    const handleSelectFlight = (flight: Flight) => {
        setSelectedFlight(flight);
        setActiveTab('checkout');
    };

    const formatCurrency = (val: number) => {
        return 'Rp ' + val.toLocaleString('id-ID');
    };

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
                            {searchType === 'hotel' ? 'LOKASI ATAU NAMA HOTEL' : 'RUTE ATAU MASKAPAI'}
                        </label>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                className="w-full h-[48px] pl-11 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#031636] focus:ring-1 focus:ring-[#031636] dark:focus:ring-[#fed023] dark:focus:border-[#fed023] transition-all font-body-md text-sm text-[#031636] dark:text-white outline-none"
                                type="text"
                                value={locationKeyword}
                                onChange={(e) => setLocationKeyword(e.target.value)}
                                placeholder={searchType === 'hotel' ? 'Cari destinasi...' : 'Cari rute atau maskapai...'}
                            />
                        </div>
                    </div>

                    {/* Price Range Slider */}
                    <div className="mb-6">
                        <h3 className="font-label-caps text-[10px] uppercase font-bold text-gray-400 block mb-3">
                            {searchType === 'hotel' ? 'RENTANG HARGA PER MALAM' : 'RENTANG HARGA TIKET'}
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

                    {/* Dynamic Filter Section (Stars vs Class types) */}
                    {searchType === 'hotel' ? (
                        <div>
                            <h3 className="font-label-caps text-[10px] uppercase font-bold text-gray-400 block mb-3">
                                BINTANG HOTEL
                            </h3>
                            <div className="space-y-3">
                                {[5, 4, 3].map((star) => (
                                    <label key={star} className="flex items-center space-x-3 cursor-pointer group select-none">
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
                    ) : (
                        <div>
                            <h3 className="font-label-caps text-[10px] uppercase font-bold text-gray-400 block mb-3">
                                KELAS PENERBANGAN
                            </h3>
                            <div className="space-y-3">
                                {['Economy', 'Business', 'First Class'].map((cls) => (
                                    <label key={cls} className="flex items-center space-x-3 cursor-pointer group select-none">
                                        <input
                                            checked={selectedClassTypes.includes(cls)}
                                            onChange={() => handleClassTypeToggle(cls)}
                                            className="rounded border-gray-300 dark:border-gray-600 text-[#031636] dark:text-[#fed023] focus:ring-[#031636] dark:focus:ring-[#fed023] w-4 h-4 bg-white dark:bg-gray-800"
                                            type="checkbox"
                                        />
                                        <span className="text-xs text-gray-600 dark:text-gray-300 font-semibold uppercase tracking-wider">
                                            {cls}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Search Listings */}
            <div className="col-span-12 md:col-span-9 space-y-6">
                {searchType === 'hotel' ? (
                    <>
                        <div className="flex justify-between items-end mb-4 gap-4">
                            <h1 className="font-h1 text-xl md:text-2xl font-bold text-[#031636] dark:text-white uppercase tracking-tight">
                                Akomodasi di {locationKeyword || 'Indonesia'}
                            </h1>
                            <span className="font-body-md text-xs md:text-sm text-gray-400 dark:text-gray-300 font-semibold whitespace-nowrap">
                                Menampilkan {filteredHotels.length} hasil
                            </span>
                        </div>

                        {filteredHotels.length > 0 ? (
                            filteredHotels.map((hotel) => (
                                <div
                                    key={hotel.id}
                                    className="bg-white dark:bg-[#1A2B4C] rounded-[24px] shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-800/40 flex flex-col md:flex-row overflow-hidden group transition-all duration-300"
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
                                                        {hotel.rating.toFixed(1)}
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
                                                        {formatCurrency(hotel.originalPricePerNight)}
                                                    </span>
                                                )}
                                                <span className="font-price-display text-xl text-[#00a858] font-black leading-none">
                                                    {formatCurrency(hotel.pricePerNight)}
                                                </span>
                                                <span className="font-body-md text-[10px] uppercase font-bold text-gray-400 mt-1 mb-3">
                                                    per malam
                                                </span>
                                                <button
                                                    onClick={() => handleSelectHotel(hotel.id)}
                                                    className="bg-[#1A2B4C] hover:bg-[#031636] dark:bg-[#fed023] dark:hover:bg-[#eec209] text-white dark:text-[#031636] rounded-full h-[48px] px-6 font-body-md text-xs md:text-sm font-bold hover:shadow-md transition-all w-full md:w-auto active:scale-95 duration-200"
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
                                        setSelectedStars([4, 5]);
                                    }}
                                    className="text-[#031636] dark:text-[#fed023] font-bold underline text-sm"
                                >
                                    Reset Filter
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="flex justify-between items-end mb-4 gap-4">
                            <h1 className="font-h1 text-xl md:text-2xl font-bold text-[#031636] dark:text-white uppercase tracking-tight">
                                Penerbangan ke {locationKeyword || 'Bali'}
                            </h1>
                            <span className="font-body-md text-xs md:text-sm text-gray-400 dark:text-gray-300 font-semibold whitespace-nowrap">
                                Menampilkan {filteredFlights.length} hasil
                            </span>
                        </div>

                        {filteredFlights.length > 0 ? (
                            filteredFlights.map((flight) => (
                                <div
                                    key={flight.id}
                                    className="bg-white dark:bg-[#1A2B4C] rounded-[24px] shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-800/40 p-6 flex flex-col md:flex-row justify-between items-center group transition-all duration-300 gap-6 text-left"
                                >
                                    {/* Airline details */}
                                    <div className="flex items-center gap-4 w-full md:w-1/3">
                                        <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center shrink-0">
                                            <Plane className="w-6 h-6 text-[#031636] dark:text-[#fed023]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base text-[#031636] dark:text-white">
                                                {flight.airline}
                                            </h3>
                                            <p className="font-mono text-xs text-gray-400 uppercase tracking-wider mt-0.5">
                                                {flight.flightNumber} • {flight.classType} Class
                                            </p>
                                        </div>
                                    </div>

                                    {/* Departure & Arrival route timeline */}
                                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 justify-center w-full md:w-1/3 text-center sm:text-left">
                                        <div className="text-center sm:text-right">
                                            <span className="block text-lg font-black text-[#031636] dark:text-white leading-none">
                                                {flight.departureTime}
                                            </span>
                                            <span className="font-mono text-xs text-gray-400 tracking-wider">
                                                {flight.fromCode}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center flex-1 max-w-[120px] w-full">
                                            <span className="font-body-md text-[10px] text-gray-400 font-medium mb-1">
                                                {flight.duration}
                                            </span>
                                            <div className="w-full h-0.5 bg-gray-200 dark:bg-gray-700 relative flex items-center justify-center">
                                                <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 absolute" />
                                            </div>
                                        </div>
                                        <div className="text-center sm:text-left">
                                            <span className="block text-lg font-black text-[#031636] dark:text-white leading-none">
                                                {flight.arrivalTime}
                                            </span>
                                            <span className="font-mono text-xs text-gray-400 tracking-wider">
                                                {flight.toCode}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Price and Action */}
                                    <div className="flex flex-col items-end w-full md:w-1/3 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800/40 pt-4 md:pt-0 md:pl-6">
                                        <div className="text-right w-full flex flex-col items-end">
                                            <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-300 text-xs font-semibold mb-2 flex-wrap justify-end">
                                                {flight.inclusions.slice(0, 2).map((inc, i) => (
                                                    <span key={i} className="bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200/50 dark:border-gray-700">
                                                        {inc}
                                                    </span>
                                                ))}
                                            </div>
                                            <span className="font-price-display text-xl text-[#00a858] font-black leading-none">
                                                {formatCurrency(flight.price)}
                                            </span>
                                            <span className="font-body-md text-[10px] uppercase font-bold text-gray-400 mt-1 mb-3">
                                                per penumpang
                                            </span>
                                            <button
                                                onClick={() => handleSelectFlight(flight)}
                                                className="bg-[#1A2B4C] hover:bg-[#031636] dark:bg-[#fed023] dark:hover:bg-[#eec209] text-white dark:text-[#031636] rounded-full h-[44px] px-6 font-body-md text-xs md:text-sm font-bold hover:shadow-md transition-all w-full md:w-auto active:scale-95 duration-200 flex items-center justify-center gap-2"
                                            >
                                                Pilih Penerbangan
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 bg-white dark:bg-[#1A2B4C] rounded-[24px] border border-gray-150 dark:border-gray-800">
                                <p className="font-body-lg text-gray-400 mb-2">Tidak ada penerbangan mewah yang cocok dengan kriteria Anda.</p>
                                <button
                                    onClick={() => {
                                        setLocationKeyword('');
                                        setPriceRange(15000000);
                                        setSelectedClassTypes(['Economy', 'Business', 'First Class']);
                                    }}
                                    className="text-[#031636] dark:text-[#fed023] font-bold underline text-sm"
                                >
                                    Reset Filter
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
