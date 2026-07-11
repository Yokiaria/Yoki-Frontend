import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { Wallet, ShieldCheck, PlusCircle, ArrowUpRight, ArrowDownLeft, Sparkles } from 'lucide-react';
import { AnimatedCounter } from './AnimatedUI';

interface WalletTopUpProps {
    
    user: UserProfile;
    walletBalance: number;
    setWalletBalance: (bal: number) => void;
    onSuccessToast: (msg: string) => void;
}

interface Transaction {
    id: string;
    type: 'TOPUP' | 'PAYMENT';
    title: string;
    amount: number;
    date: string;
    status: 'Berhasil' | 'Tertunda';
    pointsEarned?: number;
}

export default function WalletTopUp({
    
    user,
    walletBalance,
    setWalletBalance,
    onSuccessToast,
}: WalletTopUpProps) {
    const [topUpAmount, setTopUpAmount] = useState<number>(500000);
    const [customAmountText, setCustomAmountText] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'bank' | 'ewallet' | 'card'>('bank');

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

    // Fetch transaction history from API on mount
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await apiClient.get<any[]>('/wallet/history');
                if (Array.isArray(data)) {
                    // Map backend fields ke format lokal
                    const mapped: Transaction[] = data.map((tx: any) => ({
                        id: tx.id || tx.referenceId || 'TX-' + Date.now(),
                        type: tx.type === 'topup' || tx.type === 'TOPUP' ? 'TOPUP' : 'PAYMENT',
                        title: tx.description || tx.title || (tx.type === 'topup' ? 'Top-Up Star Wallet' : 'Pembayaran'),
                        amount: tx.amount || 0,
                        date: tx.createdAt
                            ? new Date(tx.createdAt).toLocaleDateString('id-ID', {
                                  day: '2-digit', month: 'short', year: 'numeric',
                              }) + ', ' + new Date(tx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                            : tx.date || '-',
                        status: tx.status === 'success' || tx.status === 'Berhasil' ? 'Berhasil' : 'Tertunda',
                          pointsEarned: tx.pointsEarned || 0,
                    }));
                    setTransactions(mapped);
                }
            } catch (err) {
                console.error('Gagal memuat riwayat transaksi wallet:', err);
                // Biarkan kosong jika endpoint belum ada
            } finally {
                setIsLoadingTransactions(false);
            }
        };
        fetchHistory();
    }, []);

    const formatCurrency = (val: number) => {
        return 'Rp ' + val.toLocaleString('id-ID');
    };
    const FormatCurrencyAnimated = ({ val }: { val: number }) => (
        <>Rp <AnimatedCounter targetValue={val} /></>
    );

    const handleQuickAmount = (amount: number) => {
        setTopUpAmount(amount);
        setCustomAmountText('');
    };

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawVal = e.target.value.replace(/\D/g, '');
        setCustomAmountText(rawVal);
        if (rawVal) {
            setTopUpAmount(Number(rawVal));
        }
    };

    const handleTopUpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (topUpAmount <= 0) {
            alert('Mohon masukkan jumlah top-up yang valid!');
            return;
        }

        try {
            const result = await apiClient.post<any>('/wallet/topup', {
                amount: topUpAmount,
                paymentMethod: selectedPaymentMethod,
            });

            // Update balance dari response backend jika ada, atau tambah manual
            const newBalance = result?.balance ?? result?.newBalance ?? (walletBalance + topUpAmount);
            setWalletBalance(newBalance);

            // Tambahkan transaksi baru ke history
            const newTx: Transaction = {
                id: result?.id || result?.referenceId || 'TX-' + Math.floor(1000 + Math.random() * 9000),
                type: 'TOPUP',
                title: `Top-Up Star Wallet (${selectedPaymentMethod === 'bank' ? 'BCA VA' : selectedPaymentMethod === 'ewallet' ? 'GOPAY' : 'KARTU KREDIT'})`,
                amount: topUpAmount,
                date: new Date().toLocaleDateString('id-ID', {
                    day: '2-digit', month: 'short', year: 'numeric',
                }) + `, ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
                status: 'Berhasil',
                pointsEarned: Math.floor(topUpAmount / 100000) * 10,
            };

            setTransactions([newTx, ...transactions]);
            onSuccessToast(`Top Up berhasil! ${formatCurrency(topUpAmount)} ditambahkan ke Star Wallet.`);
            setCustomAmountText('');
        } catch (err: any) {
            console.error('Top-up gagal:', err);
            alert(err.message || 'Gagal melakukan top-up. Coba lagi.');
        }
    };

    return (
        <main
            className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left font-sans flex-grow w-full pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-forwards"
            id="wallet-top-up-container"
        >
            {/* 12 Column Header */}
            <div className="col-span-12">
                <h1 className="font-h1 text-xl md:text-2xl font-bold text-[#031636] dark:text-white uppercase tracking-tight">
                    Star Wallet &amp; Top Up
                </h1>
                <p className="font-body-md text-sm text-gray-400 dark:text-gray-300">
                    Isi ulang saldo dompet digital Anda secara instan untuk transaksi pemesanan yang cepat dan aman.
                </p>
            </div>

            {/* Left Column: Wallet Card & Form (6 Columns) */}
            <section className="col-span-12 lg:col-span-6 space-y-6">
                {/* Luxury Blue Gradient Card */}
                <div className="bg-gradient-to-br from-[#031636] via-[#1A2B4C] to-[#4e5e82] text-white rounded-[24px] p-6 md:p-8 shadow-xl border border-white/10 flex flex-col justify-between h-[230px] relative overflow-hidden select-none transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer hover:shadow-2xl">
                    {/* Absolute decorative star badge */}
                    <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
                        <Sparkles className="w-48 h-48 text-[#fed023]" />
                    </div>

                    <div className="flex justify-between items-start relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 text-[#fed023] shadow-md">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <span className="font-h1 text-xs font-black tracking-widest block uppercase text-white/95">
                                    STAR WALLET
                                </span>
                                <span className="text-[10px] text-[#fed023] font-bold uppercase tracking-wider">
                                    {user.tier} Card
                                </span>
                            </div>
                        </div>
                        {/* Wallet Hotlink logo */}
                        <img
                            alt="Star Wallet Logo"
                            className="w-16 h-10 object-contain select-none opacity-90"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7J1P6FLKnToZa0QJqtE1lZbt0PU76edAXASg2imr2dmJU8SGqx9u8ZwgR8__jiqcskj6bntjzht5eA6qLlTHcKOwnqxAfMZwoFEvCyd-J8ViINm30HZXQSonJdvqRPnKok6lHH57wmqxTHJQT4EiQkZeQi7FDDw10L_WnnpdwwQfDGmcsL7eFGZ0JajBBFenmaMUlgVzCcRJnIVH78yeuij-M0aWLJJE-DwPONFExB-8R4iby2r6vQvsP-y6E_za57a1QBrcgO4I"
                        />
                    </div>

                    <div className="mt-8 text-left relative z-10">
                        <span className="text-white/40 block text-[9px] uppercase font-bold tracking-widest mb-1">
                            Saldo Aktif
                        </span>
                        <span className="font-price-display text-2xl md:text-3xl font-black text-white leading-none">
                            <FormatCurrencyAnimated val={walletBalance} />
                        </span>
                    </div>
                </div>

                {/* Top Up Form */}
                <div className="bg-white dark:bg-[#1A2B4C] rounded-[24px] border border-gray-150 dark:border-gray-800 p-6 shadow-sm">
                    <form onSubmit={handleTopUpSubmit} className="space-y-6 text-left">
                        <h3 className="font-h2 text-sm font-bold text-[#031636] dark:text-white uppercase tracking-wider border-b border-gray-50 dark:border-gray-800 pb-2">
                            Isi Ulang Saldo (Top-Up)
                        </h3>

                        {/* Quick amount grid selectors */}
                        <div className="space-y-3">
                            <span className="font-label-caps text-[9px] uppercase font-bold text-gray-400">PILIH NOMINAL CEPAT</span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {[100000, 200000, 500000, 1000000, 2000000, 5000000].map((amount) => (
                                    <button
                                        key={amount}
                                        type="button"
                                        onClick={() => handleQuickAmount(amount)}
                                        className={`h-[44px] rounded-xl border text-xs font-bold transition-all duration-200 hover:scale-[1.03] flex items-center justify-center select-none active:scale-95 cursor-pointer ${topUpAmount === amount && !customAmountText
                                                ? 'border-[#031636] dark:border-[#fed023] bg-[#031636]/5 dark:bg-[#fed023]/5 text-[#031636] dark:text-[#fed023]'
                                                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        {formatCurrency(amount)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Input amount field */}
                        <div className="flex flex-col gap-1.5">
                            <label className="font-label-caps text-[9px] uppercase font-bold text-gray-400">NOMINAL LAINNYA</label>
                            <div className="relative">
                                <span className="font-bold text-sm text-[#031636] dark:text-white absolute left-4 top-1/2 -translate-y-1/2">
                                    Rp
                                </span>
                                <input
                                    type="text"
                                    placeholder="Masukkan jumlah top-up (cth: 750.000)"
                                    value={customAmountText}
                                    onChange={handleCustomAmountChange}
                                    className="w-full h-[48px] pl-11 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#031636] focus:ring-1 focus:ring-[#031636] dark:focus:ring-[#fed023] outline-none transition-all font-body-md text-sm text-[#031636] dark:text-white font-bold"
                                />
                            </div>
                        </div>

                        {/* Select Bank Payment Methods */}
                        <div className="space-y-3">
                            <span className="font-label-caps text-[9px] uppercase font-bold text-gray-400">METODE PEMBAYARAN</span>
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setSelectedPaymentMethod('bank')}
                                    className={`h-[44px] rounded-xl border text-xs font-bold uppercase transition-all duration-200 hover:scale-[1.03] flex items-center justify-center select-none active:scale-95 cursor-pointer ${selectedPaymentMethod === 'bank'
                                            ? 'border-[#031636] dark:border-[#fed023] bg-[#031636]/5 dark:bg-[#fed023]/5 text-[#031636] dark:text-[#fed023]'
                                            : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    BCA VA
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedPaymentMethod('ewallet')}
                                    className={`h-[44px] rounded-xl border text-xs font-bold uppercase transition-all duration-200 hover:scale-[1.03] flex items-center justify-center select-none active:scale-95 cursor-pointer ${selectedPaymentMethod === 'ewallet'
                                            ? 'border-[#031636] dark:border-[#fed023] bg-[#031636]/5 dark:bg-[#fed023]/5 text-[#031636] dark:text-[#fed023]'
                                            : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    GoPay
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedPaymentMethod('card')}
                                    className={`h-[44px] rounded-xl border text-xs font-bold uppercase transition-all duration-200 hover:scale-[1.03] flex items-center justify-center select-none active:scale-95 cursor-pointer ${selectedPaymentMethod === 'card'
                                            ? 'border-[#031636] dark:border-[#fed023] bg-[#031636]/5 dark:bg-[#fed023]/5 text-[#031636] dark:text-[#fed023]'
                                            : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    Kartu Kredit
                                </button>
                            </div>
                        </div>

                        {/* CTA button */}
                        <button
                            type="submit"
                            className="w-full bg-[#1A2B4C] hover:bg-[#031636] dark:bg-[#fed023] dark:hover:bg-[#eec209] text-white dark:text-[#031636] h-[48px] rounded-full font-bold text-xs font-label-caps uppercase tracking-wider transition-all duration-200 hover:scale-[1.03] active:scale-95 select-none cursor-pointer flex items-center justify-center gap-1.5 hover:shadow-md"
                        >
                            <PlusCircle className="w-4 h-4" /> Top Up Sekarang
                        </button>
                        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider select-none pt-1">
                            <ShieldCheck className="w-4 h-4 text-[#00a858]" /> Keamanan enkripsi SSL terverifikasi
                        </div>
                    </form>
                </div>
            </section>

            {/* Right Column: Transaction Logs History (6 Columns) */}
            <section className="col-span-12 lg:col-span-6">
                <div className="bg-white dark:bg-[#1A2B4C] rounded-[24px] border border-gray-150 dark:border-gray-800 p-6 shadow-sm flex flex-col h-full min-h-[400px]">
                    <h3 className="font-h2 text-sm font-bold text-[#031636] dark:text-white uppercase tracking-wider border-b border-gray-50 dark:border-gray-800 pb-3 mb-4 shrink-0">
                        Riwayat Transaksi
                    </h3>

                    <div className="flex-1 overflow-y-auto space-y-4">
                        {isLoadingTransactions ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#031636] dark:border-[#fed023]"></div>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <ArrowDownLeft className="w-10 h-10 mb-3 opacity-30" />
                                <p className="text-sm font-medium">Belum ada riwayat transaksi</p>
                            </div>
                        ) : (
                            transactions.map((tx) => (
                            <div
                                key={tx.id}
                                className="flex items-center justify-between border-b border-gray-50 dark:border-gray-800/50 pb-4 last:border-b-0 transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/30 p-2 rounded-xl"
                            >
                                <div className="flex items-start gap-3 text-left">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'TOPUP'
                                            ? 'bg-[#00a858]/10 text-[#00a858]'
                                            : 'bg-red-50 dark:bg-red-950/20 text-red-500'
                                        }`}>
                                        {tx.type === 'TOPUP' ? (
                                            <ArrowDownLeft className="w-5 h-5" />
                                        ) : (
                                            <ArrowUpRight className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-body-md text-xs md:text-sm font-semibold text-[#031636] dark:text-white leading-normal">
                                            {tx.title}
                                        </h4>
                                        <span className="text-[10px] text-gray-400 font-medium block mt-0.5">
                                            {tx.date} • ID: {tx.id}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right whitespace-nowrap shrink-0">
                                    <span className={`font-price-display text-sm md:text-base font-extrabold ${tx.type === 'TOPUP' ? 'text-[#00a858]' : 'text-red-500'
                                        }`}>
                                        {tx.type === 'TOPUP' ? '+' : '-'} {formatCurrency(tx.amount)}
                                    </span>
                                    {tx.pointsEarned && tx.pointsEarned > 0 && (
                                        <p className="text-green-500 text-xs font-semibold mt-0.5">+ {tx.pointsEarned} Poin</p>
                                    )}
                                    <span className="block text-[9px] uppercase tracking-wider font-bold text-[#00a858] mt-1 select-none">
                                        {tx.status}
                                    </span>
                                </div>
                            </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}



