import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { Search, Hotel as HotelIcon, Plane, MapPin, Calendar, Users, Star } from 'lucide-react';

interface LandingPageProps {
    setActiveTab: (tab: ActiveTab) => void;
    setSearchQuery: (query: string) => void;
    setSelectedHotelId: (id: string) => void;
    setSearchType: (type: 'hotel' | 'flight') => void;
}

export default function LandingPage({
    setActiveTab,
    setSearchQuery,
    setSelectedHotelId,
    setSearchType,
}: LandingPageProps) {
    const [location, setLocation] = useState('Bali, Indonesia');
    const [dates, setDates] = useState('24 Okt - 27 Okt 2024');
    const [guests, setGuests] = useState('2 Dewasa, 1 Kamar');
    const [searchType, setSearchTypeLocal] = useState<'hotel' | 'flight'>('hotel');

    const handleSearch = () => {
        setSearchQuery(location);
        setSearchType(searchType);
        setActiveTab('search');
    };

    const handleSelectFeatured = (hotelId: string) => {
        setSelectedHotelId(hotelId);
        setActiveTab('detail');
    };

    return (
        <div className="flex-grow flex flex-col font-sans" id="landing-page-wrapper">
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
                    <div className="flex gap-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                        <button
                            onClick={() => setSearchTypeLocal('hotel')}
                            className={`font-label-caps text-xs uppercase tracking-wider font-bold pb-1 flex items-center gap-2 transition-all ${searchType === 'hotel'
                                    ? 'text-[#031636] dark:text-[#fed023] border-b-2 border-[#031636] dark:border-[#fed023]'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'
                                }`}
                        >
                            <HotelIcon className="w-4 h-4" /> Penginapan
                        </button>
                        <button
                            onClick={() => setSearchTypeLocal('flight')}
                            className={`font-label-caps text-xs uppercase tracking-wider font-bold pb-1 flex items-center gap-2 transition-all ${searchType === 'flight'
                                    ? 'text-[#031636] dark:text-[#fed023] border-b-2 border-[#031636] dark:border-[#fed023]'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'
                                }`}
                        >
                            <Plane className="w-4 h-4" /> Penerbangan
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* Location Input */}
                        <div className="md:col-span-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-[24px] border border-gray-200/50 dark:border-gray-700/50 p-4 focus-within:border-[#031636] focus-within:ring-1 focus-within:ring-[#031636] transition-all group">
                            <label className="font-label-caps text-[10px] uppercase font-bold text-gray-400 block mb-1">
                                Lokasi
                            </label>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-gray-400 group-focus-within:text-[#031636] dark:group-focus-within:text-[#fed023]" />
                                <input
                                    className="bg-transparent border-none outline-none w-full font-body-md text-sm text-[#031636] dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 p-0 focus:ring-0 focus:outline-none"
                                    placeholder="Cari destinasi atau hotel"
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
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
                        <div className="md:col-span-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-[24px] border border-gray-200/50 dark:border-gray-700/50 p-4 focus-within:border-[#031636] focus-within:ring-1 focus-within:ring-[#031636] transition-all group">
                            <label className="font-label-caps text-[10px] uppercase font-bold text-gray-400 block mb-1">
                                Tamu &amp; Kamar
                            </label>
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-gray-400 group-focus-within:text-[#031636] dark:group-focus-within:text-[#fed023]" />
                                <input
                                    className="bg-transparent border-none outline-none w-full font-body-md text-sm text-[#031636] dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 p-0 focus:ring-0 focus:outline-none"
                                    placeholder="2 Dewasa, 1 Kamar"
                                    type="text"
                                    value={guests}
                                    onChange={(e) => setGuests(e.target.value)}
                                />
                            </div>
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
                        onClick={() => setActiveTab('search')}
                        className="font-label-caps text-xs uppercase tracking-wider text-[#1A2B4C] dark:text-[#fed023] hover:underline font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    >
                        Lihat Semua <Search className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Featured Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Main Large Card (Nusa Dua Beach Hotel & Spa) */}
                    <article
                        onClick={() => handleSelectFeatured('nusa-dua-beach')}
                        className="lg:col-span-8 rounded-[24px] overflow-hidden relative group cursor-pointer border border-gray-200/40 dark:border-gray-800/40 shadow-sm hover:shadow-xl transition-all duration-300 h-[400px] lg:h-[500px]"
                    >
                        <img
                            alt="Nusa Dua Beach Hotel & Spa"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAogCOFF5tLCwexkCBMhBaFK5FyAFosphw5Sal8snuKNW8C1CeRL_HfpDP_rmLEhd26rC7hyUyON7PGLSty2JZM6VEIDx2XvspE--mH4eubHjEFNKm9ox26M5SicWsdSfwlq66KUc7mWGU6IAz1bAqgLl9YbzYU3mOw1H0RhWG86-vkXQeT7s0Qu8FfEaLhChuzAWYAvlwdkCXisY8TGNyJiu-BIpTjfzb_EIMN-PMWBiVS0Ug36MILOuGvJMsY8bue9DH_Q5V3UQ0"
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
                                    Nusa Dua Beach Hotel &amp; Spa
                                </h3>
                                <p className="font-body-md text-sm text-white/90 flex items-center gap-1 mb-3">
                                    <MapPin className="w-4 h-4 text-[#fed023]" /> Bali, Indonesia
                                </p>
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-[#fed023] stroke-none" />
                                    ))}
                                    <span className="font-body-md text-xs text-white ml-2">(4.9/5 Excellent)</span>
                                </div>
                            </div>
                            <div className="text-left md:text-right w-full md:w-auto shrink-0">
                                <p className="font-label-caps text-[10px] uppercase tracking-wider text-white/70 mb-1">
                                    Mulai dari / malam
                                </p>
                                <p className="font-price-display text-lg text-[#00a858] bg-white/95 dark:bg-gray-900/90 backdrop-blur-md px-4 py-2 rounded-full inline-block shadow-lg font-extrabold">
                                    Rp 4.500.000
                                </p>
                            </div>
                        </div>
                    </article>

                    {/* Right Two Column Stack */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        {/* Card 2: The Langham */}
                        <article
                            onClick={() => handleSelectFeatured('the-langham')}
                            className="flex-1 rounded-[24px] overflow-hidden relative group cursor-pointer border border-gray-200/40 dark:border-gray-800/40 shadow-sm hover:shadow-xl transition-all duration-300 min-h-[200px] flex flex-col justify-end p-5"
                        >
                            <img
                                alt="The Langham Jakarta"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNZzSopmrblm778queeMTbsrQD8Jf7HUtclhlNWL_4yxXT0t5I3MB0BR0izyj-iinTPZyPnaLgIXyEHD6bt6HF2c2XKl1Epp2w-G11z6uFWn-xTzaR8g3PWhxJWY_lQgZSpHkXanro7ToiXqyV6j07BEQWpaAk52_QLey2Nd4nxw4Hhn7oQygHbA2ylpzd58cpQgCfCcKK4TQhmS6qXKnmc73jZWNnJtHe4cd0DTULnW6SYL_bi_XCRoLGhdf13PCebMvUCRDNvgs"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#031636]/90 via-[#031636]/40 to-transparent"></div>

                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <div></div>
                                <div className="mt-8">
                                    <h3 className="text-lg font-bold text-white mb-1">The Langham</h3>
                                    <p className="font-body-md text-xs text-white/80 flex items-center gap-1 mb-2">
                                        <MapPin className="w-3.5 h-3.5 text-[#fed023]" /> Jakarta Selatan
                                    </p>
                                    <div className="flex justify-between items-end mt-4">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-3.5 h-3.5 fill-[#fed023] stroke-none" />
                                            ))}
                                        </div>
                                        <div>
                                            <p className="font-price-display text-xs text-[#00a858] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-3 py-1 rounded-full font-extrabold shadow-sm">
                                                Rp 5.200.000
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>

                        {/* Card 3: Amanwana Resort */}
                        <article
                            onClick={() => handleSelectFeatured('amanwana-resort')}
                            className="flex-1 rounded-[24px] overflow-hidden relative group cursor-pointer border border-gray-200/40 dark:border-gray-800/40 shadow-sm hover:shadow-xl transition-all duration-300 min-h-[200px] flex flex-col justify-end p-5"
                        >
                            <img
                                alt="Amanwana Resort Lombok"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeoIjK6nXCrqBtXeehnTu_AfbWsDuiMq-XkvQNE_QlGzreiF5sbSNDlwjXos-R3uyqalm3Eo_sgD57lBDU-EWibkkwgcN2YDniZmeG0q73EtP6WSt2rwwWcDKF5lHXPkBVpFUtX7Kxnw3ipJ8mLQr-GFmkceS4UoCNSSP7vxvMCsg6jHR-AjG3wlw94uG_CUHNCH99UE34Ddt6PAXbu3mXT4VEpx7Kq0AzBPFEepzyrycHaIUW9j6YZE-yGsYsQ-M4EkPPijt7Sg8"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#031636]/90 via-[#031636]/40 to-transparent"></div>

                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <div></div>
                                <div className="mt-8">
                                    <h3 className="text-lg font-bold text-white mb-1">Amanwana Resort</h3>
                                    <p className="font-body-md text-xs text-white/80 flex items-center gap-1 mb-2">
                                        <MapPin className="w-3.5 h-3.5 text-[#fed023]" /> Pulau Moyo, NTB
                                    </p>
                                    <div className="flex justify-between items-end mt-4">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-3.5 h-3.5 fill-[#fed023] stroke-none" />
                                            ))}
                                        </div>
                                        <div>
                                            <p className="font-price-display text-xs text-[#00a858] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-3 py-1 rounded-full font-extrabold shadow-sm">
                                                Rp 12.800.000
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </main>
        </div>
    );
}
