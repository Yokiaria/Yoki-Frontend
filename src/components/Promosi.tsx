import React, { useState } from 'react';
import { ActiveTab, Promo } from '../types';
import { Tag, Copy, CheckCircle, Calendar, Sparkles } from 'lucide-react';

interface PromosiProps {
    setActiveTab: (tab: ActiveTab) => void;
    promos: Promo[];
    onSuccessToast: (msg: string) => void;
}

export default function Promosi({ setActiveTab, promos, onSuccessToast }: PromosiProps) {
    const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'FLASH SALE' | 'TIKET PESAWAT' | 'SPA' | 'TRANSFER' | 'STAYCATION'>('ALL');

    const filteredPromos = promos.filter((p) => {
        if (selectedCategory === 'ALL') return true;
        return p.category === selectedCategory;
    });

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        onSuccessToast(`Kode Promo "${code}" Berhasil Disalin! Gunakan saat Checkout.`);
    };

    return (
        <main
            className="max-w-7xl mx-auto px-4 md:px-8 py-8 text-left font-sans flex-grow w-full pb-32 space-y-8"
            id="promosi-page-container"
        >
            {/* Page Header */}
            <div>
                <h1 className="font-h1 text-xl md:text-2xl font-bold text-[#031636] dark:text-white uppercase tracking-tight">
                    Penawaran &amp; Promosi Spesial
                </h1>
                <p className="font-body-md text-sm text-gray-400 dark:text-gray-300">
                    Gunakan kode promo kurasi kami untuk mendapatkan diskon terbaik pada liburan mewah Anda.
                </p>
            </div>

            {/* Category Tabs Filter */}
            <div className="flex flex-wrap gap-2.5 border-b border-gray-100 dark:border-gray-800 pb-4 select-none">
                {(['ALL', 'FLASH SALE', 'TIKET PESAWAT', 'SPA', 'TRANSFER', 'STAYCATION'] as const).map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-95 ${selectedCategory === cat
                                ? 'bg-[#031636] dark:bg-[#fed023] text-white dark:text-[#031636] font-extrabold shadow-sm'
                                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-250 text-gray-500 dark:text-gray-300'
                            }`}
                    >
                        {cat === 'ALL' ? 'Semua' : cat}
                    </button>
                ))}
            </div>

            {/* Promos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPromos.map((promo) => (
                    <article
                        key={promo.id}
                        className="bg-white dark:bg-[#1A2B4C] rounded-[24px] border border-gray-150 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col sm:flex-row group transition-all duration-300 hover:shadow-lg"
                    >
                        {/* Coupon Image side */}
                        <div className="relative w-full sm:w-[200px] h-[160px] sm:h-auto shrink-0 select-none">
                            <img
                                alt={promo.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                src={promo.imageUrl}
                            />
                            <div className="absolute top-4 left-4">
                                <span className="bg-[#FEF9E7] text-[#735c00] font-label-caps text-[9px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm select-none">
                                    <Sparkles className="w-3 h-3 fill-[#735c00] stroke-none" /> {promo.category}
                                </span>
                            </div>
                        </div>

                        {/* Coupon Details side */}
                        <div className="p-6 flex flex-col justify-between flex-grow text-left">
                            <div>
                                <span className="font-price-display text-sm font-extrabold text-[#00a858] block mb-1">
                                    {promo.discountText}
                                </span>
                                <h3 className="font-h2 text-base font-bold text-[#031636] dark:text-white leading-snug mb-1.5">
                                    {promo.title}
                                </h3>
                                <p className="font-body-md text-xs text-gray-400 dark:text-gray-300 leading-relaxed mb-4">
                                    {promo.description}
                                </p>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-800/50 pt-4 gap-4 flex-wrap">
                                <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase select-none">
                                    <Calendar className="w-3.5 h-3.5 mr-1" /> s/d {promo.validUntil}
                                </div>

                                {/* Promo Code Copy clicker */}
                                <div
                                    onClick={() => handleCopyCode(promo.code)}
                                    className="flex items-center bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 px-3 py-2 rounded-xl border border-gray-200/50 dark:border-gray-700 cursor-pointer select-none group transition-all duration-200 hover:shadow-sm"
                                    title="Salin Kode Promo"
                                >
                                    <Tag className="w-3.5 h-3.5 text-[#031636] dark:text-[#fed023] mr-1.5" />
                                    <span className="font-mono text-xs font-black tracking-wider text-[#031636] dark:text-white mr-2">
                                        {promo.code}
                                    </span>
                                    <Copy className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#031636] dark:group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </main>
    );
}
