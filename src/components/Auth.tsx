import React, { useState } from 'react';
import { ActiveTab, UserProfile } from '../types';

interface AuthProps {
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
    setUser: (user: UserProfile) => void;
    onSuccessToast: (msg: string) => void;
}

export default function Auth({ activeTab, setActiveTab, setUser, onSuccessToast }: AuthProps) {
    const isLogin = activeTab === 'auth-login';
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const isAdmin = email.toLowerCase() === 'admin@grandstarind.com';
        
        // Mock login/register success
        setUser({
            name: isAdmin ? 'System Administrator' : (name || 'Tamu GrandStarInd'),
            email: email,
            phone: '+62 811 0000 0000',
            loyaltyPoints: isAdmin ? 999999 : 1250,
            tier: isAdmin ? 'Elite Member' : 'Regular Member',
            role: isAdmin ? 'admin' : 'user',
        });
        
        onSuccessToast(isLogin ? `Selamat datang kembali, ${isAdmin ? 'Admin' : 'User'}!` : 'Registrasi Berhasil! Selamat datang di GrandStarInd.');
        
        // For admin, the App component will automatically render AdminConsole based on the role.
        // But we still set active tab to home for consistency.
        setActiveTab('home');
    };

    return (
        <div className="flex-grow flex items-center justify-center p-6 md:p-12 relative overflow-hidden bg-[#f7f9fb] dark:bg-[#031636]">
            {/* Aesthetic Background Elements */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#031636]/10 to-transparent dark:from-[#1a2b4c]/50"></div>
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#fed023]/20 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#00a858]/20 rounded-full blur-3xl opacity-50"></div>

            <div className="w-full max-w-5xl bg-white dark:bg-[#071b3b] rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative z-10 border border-gray-100 dark:border-gray-800 animate-fade-in">
                
                {/* Left Side: Branding / Marketing (Hidden on very small screens) */}
                <div className="w-full md:w-1/2 bg-[#031636] text-white p-12 flex flex-col justify-between relative overflow-hidden">
                    {/* Background image overlay */}
                    <div className="absolute inset-0 opacity-20">
                        <img 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsmQxIPFALxGvEDeInaMBDSb_UatAyQTZQZYBT9r5Fye43c2XkNae06VF9xLOfZzM2BccbEEB_bX69RVeVVwpyTud72O7sKpeSwlxLM0Tav77LeU8IlmqBpJLbcorRcOVVEHTk1kTiWcTZAa3ZdmFs4nvMq3qlw5HUwrHDrZu0T2pw-NM_BPNPFlwDeAmpVs8geOrf37UcEyB0oQOOdDMbbck4gCX7vsMboL-hNNdNrPeYhapMjvnlx0rF3hylATJ28pVoKOoZ3rk"
                            alt="Resort View"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    
                    <div className="relative z-10">
                        <h2 className="text-3xl font-h1 font-black tracking-tight mb-4 text-[#ffe084]">GRANDSTARIND</h2>
                        <p className="text-lg font-light text-gray-300 leading-relaxed max-w-md">
                            Temukan pengalaman menginap eksklusif dan layanan bintang lima tanpa batas. Bergabunglah dengan program loyalitas kami.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-6 mt-12 md:mt-0">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                                <span className="material-symbols-outlined text-[#fed023]">diamond</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Elite Rewards</h4>
                                <p className="text-sm text-gray-400">Dapatkan poin di setiap reservasi</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                                <span className="material-symbols-outlined text-[#fed023]">security</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Aman & Terpercaya</h4>
                                <p className="text-sm text-gray-400">Privasi dan keamanan terjamin</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-h1 font-extrabold text-[#031636] dark:text-white mb-2 tracking-tight">
                            {isLogin ? 'Selamat Datang' : 'Buat Akun Baru'}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                            {isLogin ? 'Silakan masuk menggunakan kredensial Anda.' : 'Isi data diri Anda untuk memulai.'}
                        </p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Nama Lengkap</label>
                                <input 
                                    type="text" 
                                    required={!isLogin}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl p-3.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#031636] dark:focus:border-[#b6c6f0] focus:ring-0 outline-none transition-all font-medium"
                                    placeholder="Andi Pratama"
                                />
                            </div>
                        )}
                        
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Alamat Email</label>
                            <input 
                                type="email" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl p-3.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#031636] dark:focus:border-[#b6c6f0] focus:ring-0 outline-none transition-all font-medium"
                                placeholder="nama@email.com"
                            />
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex justify-between">
                                <span>Password</span>
                                {isLogin && <a href="#" className="text-[#031636] dark:text-[#b6c6f0] hover:underline normal-case">Lupa password?</a>}
                            </label>
                            <input 
                                type="password" 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl p-3.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#031636] dark:focus:border-[#b6c6f0] focus:ring-0 outline-none transition-all font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                        
                        <button 
                            type="submit"
                            className="w-full bg-[#031636] dark:bg-[#b6c6f0] hover:bg-[#1a2b4c] dark:hover:bg-white text-white dark:text-[#031636] font-bold py-4 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all mt-4 transform active:scale-95"
                        >
                            {isLogin ? 'Masuk ke Dashboard' : 'Daftar Sekarang'}
                        </button>
                    </form>
                    
                    <div className="mt-8 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                        {isLogin ? (
                            <p>
                                Belum punya akun?{' '}
                                <button onClick={() => setActiveTab('auth-register')} className="text-[#031636] dark:text-[#b6c6f0] font-bold hover:underline transition-all">
                                    Daftar di sini
                                </button>
                            </p>
                        ) : (
                            <p>
                                Sudah punya akun?{' '}
                                <button onClick={() => setActiveTab('auth-login')} className="text-[#031636] dark:text-[#b6c6f0] font-bold hover:underline transition-all">
                                    Masuk di sini
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
