import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Hotel, Booking, Promo, UserProfile } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import SearchResults from './components/SearchResults';
import PropertyDetail from './components/PropertyDetail';
import Checkout from './components/Checkout';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import LoyaltyDashboard from './components/LoyaltyDashboard';
import WriteReview from './components/WriteReview';
import CheckInOnline from './components/CheckInOnline';
import WalletTopUp from './components/WalletTopUp';
import Promosi from './components/Promosi';
import AdminConsole from './components/AdminConsole';
import BookingConfirmation from './components/BookingConfirmation';
import { apiClient } from './api/apiClient';
import { useAuth } from './hooks/useAuth';

// Komponen Layout Wrapper Global untuk Animasi Transisi Halaman
function AnimatedRoutes({ children }: { children: React.ReactNode }) {
    const location = useLocation();

    useEffect(() => {
        const pathMap: Record<string, string> = {
            '/': 'Beranda | Grandstarind',
            '/search': 'Hasil Pencarian | Grandstarind',
            '/checkout': 'Selesaikan Pembayaran | Grandstarind',
            '/login': 'Masuk | Grandstarind',
            '/register': 'Daftar | Grandstarind',
            '/dashboard': 'Dashboard | Grandstarind',
            '/loyalty': 'Loyalty Program | Grandstarind',
            '/wallet': 'Top-up GrandWallet | Grandstarind',
            '/promos': 'Promo Spesial | Grandstarind',
            '/admin': 'Dashboard Admin | Grandstarind',
        };

        if (location.pathname.startsWith('/hotel/')) {
            document.title = 'Detail Properti | Grandstarind';
        } else if (location.pathname.startsWith('/review/')) {
            document.title = 'Tulis Ulasan | Grandstarind';
        } else if (location.pathname.startsWith('/checkin/')) {
            document.title = 'Check-In Online | Grandstarind';
        } else {
            document.title = pathMap[location.pathname] || 'Grandstarind Hotel';
        }
    }, [location]);

    // Membungkus children (rute) dengan key berupa pathname.
    // Saat pathname berubah, React akan me-mount ulang div ini, sehingga memicu class animasi animate-in.
    return (
        <main key={location.pathname} className="flex-grow flex flex-col animate-in fade-in zoom-in-95 duration-300 ease-out">
            <Routes location={location}>
                {children}
            </Routes>
        </main>
    );
}

const ProtectedRoute = ({ user, children }: { user: UserProfile | null, children: React.ReactNode }) => {
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

export default function App() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [promos, setPromos] = useState<Promo[]>([]);

    const [searchQuery, setSearchQuery] = useState('Bali');
    const [selectedHotelId, setSelectedHotelId] = useState('hotel-yoki-1');
    const [walletBalance, setWalletBalance] = useState(0);

    // Success / Error Toast alert states
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToastMessage(msg);
        setToastType(type);
    };

    // Use custom auth hook
    const { user, setUser, isAuthLoading } = useAuth(triggerToast);

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isAppLoading, setIsAppLoading] = useState(true);

    // Fetch Initial Data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [hotelsData, promosData] = await Promise.all([
                    apiClient.get<Hotel[]>('/hotels').catch(() => []),
                    apiClient.get<Promo[]>('/promos').catch(() => [])
                ]);
                
                const normalizedHotels = Array.isArray(hotelsData) ? hotelsData.map((h: any) => ({
                    ...h,
                    pricePerNight: Number(h.pricePerNight || 0),
                    originalPricePerNight: h.originalPricePerNight ? Number(h.originalPricePerNight) : undefined,
                    rating: h.rating ? Number(h.rating) : 0,
                    amenities: Array.isArray(h.amenities) ? h.amenities.map((a: any) => typeof a === 'string' ? a : a.amenity) : [],
                    tags: Array.isArray(h.tags) ? h.tags.map((t: any) => typeof t === 'string' ? t : t.tag) : [],
                    imageUrls: Array.isArray(h.images) ? h.images.map((img: any) => img.imageUrl) : [],
                    thumbnailUrl: h.thumbnailUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000'
                })) : [];
                setHotels(normalizedHotels);
                setPromos(Array.isArray(promosData) ? promosData : []);
            } catch (err) {
                console.error("Gagal mengambil data dari server:", err);
            }
        };

        fetchInitialData().finally(() => {
            setIsAppLoading(false);
        });
    }, []);

    const [checkoutDetails, setCheckoutDetails] = useState({
        checkInDate: '24 Okt 2024',
        checkOutDate: '27 Okt 2024',
        nights: 3,
        guestsText: '2 Tamu, 1 Kamar',
        roomTypeId: '',
        roomTypeName: '',
        roomPrice: 0,
    });

    // Sync wallet balance from user profile
    useEffect(() => {
        if (user && user.balance !== undefined) {
            setWalletBalance(user.balance);
        }
    }, [user]);

    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => {
                setToastMessage('');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);



    // ProtectedRoute has been moved outside of App to prevent infinite unmount/mount loops

    if (isAppLoading || isAuthLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb] dark:bg-[#031636]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#031636] dark:border-[#b6c6f0]"></div>
            </div>
        );
    }

    if (user?.role === 'admin') {
        return <AdminConsole onLogout={() => {
            localStorage.removeItem('gsi_token');
            localStorage.removeItem('gsi_user');
            sessionStorage.clear();
            window.location.href = '/login';
        }} />;
    }

    const selectedHotelObj = hotels.find((h) => h.id === selectedHotelId) || hotels[0] || ({} as Hotel);

    return (
        <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-[#f7f9fb] text-[#191c1e] dark:bg-[#031636] dark:text-white transition-all">
                {/* Dynamic Success/Error Toast Notification Alert */}
                {toastMessage && (
                    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce">
                        <div
                            className={`px-6 py-4 rounded-full shadow-2xl flex items-center space-x-2 border text-xs md:text-sm font-semibold select-none ${toastType === 'success'
                                    ? 'bg-emerald-500 text-white border-emerald-400'
                                    : 'bg-red-500 text-white border-red-400'
                                }`}
                        >
                            <span>{toastMessage}</span>
                        </div>
                    </div>
                )}

                {/* Persistent Navigation Header */}
                <Header
                    user={user}
                    walletBalance={walletBalance}
                />

                {/* State-Driven View Router Container */}
                <AnimatedRoutes>
                        <Route path="/" element={
                            <LandingPage
                                setSearchQuery={setSearchQuery}
                                setSelectedHotelId={setSelectedHotelId}
                            />
                        } />
                        
                        <Route path="/search" element={
                            <SearchResults
                                hotels={hotels}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                setSelectedHotelId={setSelectedHotelId}
                            />
                        } />

                        <Route path="/hotel/:id" element={
                            <PropertyDetail
                                checkoutDetails={checkoutDetails}
                                setCheckoutDetails={setCheckoutDetails}
                                user={user}
                            />
                        } />

                        <Route path="/checkout" element={
                            <ProtectedRoute user={user}>
                                <Checkout
                                    hotel={selectedHotelObj}
                                    checkoutDetails={checkoutDetails}
                                    user={user!}
                                    setUser={setUser}
                                    walletBalance={walletBalance}
                                    setWalletBalance={setWalletBalance}
                                    bookings={bookings}
                                    setBookings={setBookings}
                                    onSuccessToast={(msg: string) => triggerToast(msg, 'success')}
                                    onErrorToast={(msg: string) => triggerToast(msg, 'error')}
                                />
                            </ProtectedRoute>
                        } />

                        <Route path="/login" element={
                            <Auth
                                isLogin={true}
                                setUser={setUser}
                                onSuccessToast={(msg: string) => triggerToast(msg, 'success')}
                                onErrorToast={(msg: string) => triggerToast(msg, 'error')}
                            />
                        } />
                        
                        <Route path="/register" element={
                            <Auth
                                isLogin={false}
                                setUser={setUser}
                                onSuccessToast={(msg: string) => triggerToast(msg, 'success')}
                                onErrorToast={(msg: string) => triggerToast(msg, 'error')}
                            />
                        } />

                        <Route path="/dashboard" element={
                            <ProtectedRoute user={user}>
                                <Dashboard
                                    user={user!}
                                    setUser={setUser}
                                    bookings={bookings}
                                    setSelectedHotelId={setSelectedHotelId}
                                    onSuccessToast={(msg: string) => triggerToast(msg, 'success')}
                                />
                            </ProtectedRoute>
                        } />

                        <Route path="/loyalty" element={
                            <ProtectedRoute user={user}>
                                <LoyaltyDashboard 
                                    user={user!}
                                    setUser={setUser}
                                />
                            </ProtectedRoute>
                        } />

                        <Route path="/review/:hotelId" element={
                            <ProtectedRoute user={user}>
                                <WriteReview
                                    hotel={selectedHotelObj}
                                    onSuccessToast={(msg: string) => triggerToast(msg, 'success')}
                                />
                            </ProtectedRoute>
                        } />

                        <Route path="/checkin/:hotelId" element={
                            <ProtectedRoute user={user}>
                                <CheckInOnline
                                    hotel={selectedHotelObj}
                                    user={user!}
                                />
                            </ProtectedRoute>
                        } />

                        <Route path="/wallet" element={
                            <ProtectedRoute user={user}>
                                <WalletTopUp
                                    user={user!}
                                    walletBalance={walletBalance}
                                    setWalletBalance={setWalletBalance}
                                    onSuccessToast={(msg: string) => triggerToast(msg, 'success')}
                                />
                            </ProtectedRoute>
                        } />

                        <Route path="/promosi" element={
                            <Promosi
                                onSuccessToast={(msg: string) => triggerToast(msg, 'success')}
                            />
                        } />
                        
                        <Route path="/booking-confirmation" element={
                            <ProtectedRoute user={user}>
                                <BookingConfirmation />
                            </ProtectedRoute>
                        } />

                        {/* Fallback route */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                </AnimatedRoutes>

                {/* Persistent Footer */}
                <Footer />
            </div>
        </BrowserRouter>
    );
}
