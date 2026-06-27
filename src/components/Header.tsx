import { ActiveTab, UserProfile } from '../types';
import { Wallet, Bell } from 'lucide-react';

interface HeaderProps {
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
    user: UserProfile | null;
    walletBalance: number;
    searchType: 'hotel' | 'flight';
    setSearchType: (type: 'hotel' | 'flight') => void;
}

export default function Header({
    activeTab,
    setActiveTab,
    user,
    walletBalance,
    searchType,
    setSearchType,
}: HeaderProps) {
    const formatCurrency = (val: number) => {
        return 'Rp ' + val.toLocaleString('id-ID');
    };

    return (
        <header className="w-full sticky top-0 z-50 bg-white/90 dark:bg-[#031636]/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 shadow-sm text-[#031636] dark:text-white transition-all">
            <div className="flex justify-between items-center w-full px-4 md:px-8 max-w-7xl mx-auto h-20">
                {/* Brand */}
                <div
                    onClick={() => setActiveTab('home')}
                    className="text-2xl font-black tracking-tighter text-[#031636] dark:text-[#d8e2ff] cursor-pointer hover:opacity-90 select-none font-h1 uppercase"
                    id="header-brand"
                >
                    GRANDSTARIND
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-8">
                    <button
                        onClick={() => {
                            setSearchType('hotel');
                            setActiveTab('home');
                        }}
                        className={`font-h2 text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer active:scale-95 pb-1 ${activeTab === 'home' || (activeTab === 'search' && searchType === 'hotel')
                            ? 'text-[#031636] border-b-2 border-[#031636] dark:text-[#d8e2ff] dark:border-[#d8e2ff]'
                            : 'text-gray-500 hover:text-[#031636] dark:text-gray-300 dark:hover:text-white'
                            }`}
                        id="nav-home"
                    >
                        Hotels
                    </button>
                    <button
                        onClick={() => {
                            setSearchType('flight');
                            setActiveTab('search');
                        }}
                        className={`font-h2 text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer active:scale-95 pb-1 ${activeTab === 'search' && searchType === 'flight'
                            ? 'text-[#031636] border-b-2 border-[#031636] dark:text-[#d8e2ff] dark:border-[#d8e2ff]'
                            : 'text-gray-500 hover:text-[#031636] dark:text-gray-300 dark:hover:text-white'
                            }`}
                        id="nav-flights"
                    >
                        Flights
                    </button>
                    <button
                        onClick={() => setActiveTab('promosi')}
                        className={`font-h2 text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer active:scale-95 pb-1 ${activeTab === 'promosi'
                            ? 'text-[#031636] border-b-2 border-[#031636] dark:text-[#d8e2ff] dark:border-[#d8e2ff]'
                            : 'text-gray-500 hover:text-[#031636] dark:text-gray-300 dark:hover:text-white'
                            }`}
                        id="nav-transfers"
                    >
                        Promosi
                    </button>
                    <button
                        onClick={() => user ? setActiveTab('wallet') : setActiveTab('auth-login')}
                        className={`font-h2 text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer active:scale-95 pb-1 ${activeTab === 'wallet'
                            ? 'text-[#031636] border-b-2 border-[#031636] dark:text-[#d8e2ff] dark:border-[#d8e2ff]'
                            : 'text-gray-500 hover:text-[#031636] dark:text-gray-300 dark:hover:text-white'
                            }`}
                        id="nav-wallet"
                    >
                        Star Wallet
                    </button>
                </nav>

                {/* Trailing Icons & Auth */}
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            {/* Wallet Balance Widget */}
                            <div
                                onClick={() => setActiveTab('wallet')}
                                className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs cursor-pointer transition-all duration-200 ${activeTab === 'wallet'
                                    ? 'bg-[#1a2b4c] text-white border-[#1a2b4c]'
                                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700'
                                    }`}
                                id="header-wallet-widget"
                            >
                                <Wallet className="w-4 h-4 text-[#fed023]" />
                                <span className="font-semibold">{formatCurrency(walletBalance)}</span>
                            </div>

                            <button
                                onClick={() => setActiveTab('wallet')}
                                className="p-2 text-gray-600 dark:text-gray-200 hover:text-[#031636] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-all sm:hidden"
                                title="Star Wallet"
                                id="btn-wallet-mobile"
                            >
                                <Wallet className="w-5 h-5" />
                            </button>

                            <button
                                className="p-2 text-gray-600 dark:text-gray-200 hover:text-[#031636] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-all relative"
                                title="Notifikasi"
                                id="btn-notifications"
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* User Profile Avatar */}
                            <div
                                onClick={() => setActiveTab('dashboard')}
                                className="flex items-center space-x-2 cursor-pointer group"
                                id="header-avatar-container"
                            >
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#fed023] transition-all duration-300 shadow-sm">
                                    <img
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhs5gR4qSoLbE8UCBd27essE6TgbXoMn_h_VkKd2j1q943nxEXLt-pTIjfoR5CG4PpvHTwd_PXi-YIVkKLDAZbRgk5wNb57vI-KqO3F7sf1xIiF1xiXd0bhsX49O_euXBiXNFN9PPPIskMx4Nrxdqg2_xaLQ6IDG4wB9uHLDte3sVk7RlcuBjxMqJ-ezT9rvdnX450TqzzZ1PAbHeJ0CD5XlngvD4B-2SWWlY9GqbaEvCFTTBM60I1Uun69tzcG2WQqiQjgMosplo"
                                    />
                                </div>
                                <div className="hidden lg:flex flex-col text-left">
                                    <span className="text-xs font-semibold leading-tight">{user.name}</span>
                                    <span className="text-[10px] text-gray-400 font-medium">{user.tier}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setActiveTab('auth-login')}
                                className="px-4 py-2 text-sm font-bold text-[#031636] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
                            >
                                Masuk
                            </button>
                            <button
                                onClick={() => setActiveTab('auth-register')}
                                className="px-4 py-2 text-sm font-bold bg-[#031636] text-white dark:bg-white dark:text-[#031636] hover:opacity-90 rounded-full shadow-sm transition-all"
                            >
                                Daftar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
