import React, { useState, useEffect } from 'react';
import { Promo } from '../types';
import { useNavigate } from 'react-router-dom';
import { Tag, Copy, CheckCircle, Calendar, Sparkles } from 'lucide-react';
import { apiClient } from '../api/apiClient';

interface PromosiProps {
    onSuccessToast: (msg: string) => void;
}

const mapBackendCategory = (cat: string) => {
    switch (cat) {
        case 'flash_sale': return 'FLASH SALE';

        case 'spa': return 'SPA';
        case 'transfer': return 'TRANSFER';
        case 'staycation': return 'STAYCATION';
        default: return 'FLASH SALE';
    }
};

const mapCategoryToQuery = (cat: string) => {
    switch (cat) {
        case 'FLASH SALE': return 'flash_sale';

        case 'SPA': return 'spa';
        case 'TRANSFER': return 'transfer';
        case 'STAYCATION': return 'staycation';
        default: return '';
    }
};

export default function Promosi({ onSuccessToast }: PromosiProps) {
    const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'FLASH SALE' | 'SPA' | 'TRANSFER' | 'STAYCATION'>('ALL');
    const [promos, setPromos] = useState<Promo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPromos = async () => {
            setIsLoading(true);
            try {
                let url = '/promos';
                if (selectedCategory !== 'ALL') {
                    const queryCat = mapCategoryToQuery(selectedCategory);
                    url = `/promos?category=${queryCat}`;
                }
                const res = await apiClient.get<any[]>(url);
                const normalizedPromos: Promo[] = (Array.isArray(res) ? res : []).map(p => {
                    const isPercentage = p.discountType === 'percentage';
                    const discValue = Number(p.discountValue);
                    const discText = p.discountText || (isPercentage ? `Diskon ${discValue}%` : `Potongan Rp ${discValue.toLocaleString('id-ID')}`);
                    
                    let expiryText = p.expiryDate;
                    if (expiryText) {
                        try {
                            const date = new Date(expiryText);
                            expiryText = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                        } catch(e) {}
                    }

                    return {
                        id: p.id,
                        category: mapBackendCategory(p.category),
                        title: p.title || '',
                        description: p.description || '',
                        code: p.code || '',
                        discountText: discText,
                        imageUrl: p.imageUrl || 'https://images.unsplash.com/photo-1551882547-ff40c0d5b9fa?auto=format&fit=crop&q=80&w=1000',
                        validUntil: expiryText || 'Tanpa Batas',
                    };
                });
                setPromos(normalizedPromos);
            } catch (err) {
                console.error("Gagal mengambil promo:", err);
                setPromos([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPromos();
    }, [selectedCategory]);

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        onSuccessToast(`Kode Promo "${code}" Berhasil Disalin! Gunakan saat Checkout.`);
    };

    return (
        <main
            className="max-w-7xl mx-auto px-4 md:px-8 py-8 text-left font-sans flex-grow w-full pb-32 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-forwards"
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
                {(['ALL', 'FLASH SALE', 'SPA', 'TRANSFER', 'STAYCATION'] as const).map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 hover:scale-[1.03] cursor-pointer active:scale-95 ${selectedCategory === cat
                                ? 'bg-[#031636] dark:bg-[#fed023] text-white dark:text-[#031636] font-extrabold shadow-sm'
                                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-250 text-gray-500 dark:text-gray-300'
                            }`}
                    >
                        {cat === 'ALL' ? 'Semua' : cat}
                    </button>
                ))}
            </div>

            {/* Promos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative min-h-[300px]">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-[#0b1120]/50 backdrop-blur-sm z-10 rounded-3xl">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#031636] dark:border-[#fed023]"></div>
                    </div>
                )}
                {!isLoading && promos.length === 0 && (
                    <div className="col-span-1 md:col-span-2 py-20 text-center">
                        <p className="text-gray-400 dark:text-gray-500 font-medium">Belum ada promo aktif untuk kategori ini.</p>
                    </div>
                )}
                {promos.map((promo) => (
                    <article
                        key={promo.id}
                        className="bg-white dark:bg-[#1A2B4C] rounded-[24px] border border-gray-150 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col sm:flex-row group transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer hover:shadow-xl"
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
                                    className="flex items-center bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 px-3 py-2 rounded-xl border border-gray-200/50 dark:border-gray-700 cursor-pointer select-none group transition-all duration-200 hover:scale-[1.03] active:scale-95 hover:shadow-sm"
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
