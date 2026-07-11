export interface Hotel {
    id: string;
    name: string;
    rating: number;
    ratingText: string;
    stars: number;
    location: string;
    city: string;
    pricePerNight: number;
    originalPricePerNight?: number;
    thumbnailUrl: string;
    imageUrls: string[];
    description: string;
    amenities: string[];
    scarcityText?: string;
    tags?: string[];
}
export interface RoomType {
    id: string;
    name: string;
    unitsAvailable: number;
    price: number;
    capacity: string;
    capacityNum: number;
    size: number;
    bedType: string;
    facilities: string[];
    imageUrl: string;
    description: string;
    hotelId: string;
    hotel?: {
        name: string;
        [key: string]: any;
    };
}

export interface Booking {
    id: string;
    hotelId: string;
    hotelName: string;
    hotelImage: string;
    stars: number;
    rating: number;
    checkInDate: string;
    checkOutDate: string;
    nights: number;
    guestName: string;
    guestsText: string;
    totalPrice: number;
    status: 'selesai' | 'aktif' | 'check_in' | 'dibatalkan' | 'tentative' | 'confirmed';
    roomTypeId?: string;
    roomTypeName?: string;
    bookingCode?: string;
    holdExpiresAt?: string;
    hotel?: {
        id: string;
        name: string;
        [key: string]: any;
    };
}


export interface Promo {
    id: string;
    category: 'FLASH SALE' | 'SPA' | 'TRANSFER' | 'STAYCATION';
    title: string;
    description: string;
    code: string;
    discountText: string;
    imageUrl: string;
    validUntil: string;
}

export interface UserProfile {
    name: string;
    email: string;
    phone: string;
    loyaltyPoints: number;
    tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    role?: 'user' | 'admin';
    balance?: number;
    profileUrl?: string;
}

export interface ReviewRating {
    kebersihan: number;
    pelayanan: number;
    lokasi: number;
    fasilitas: number;
}

export interface HotelReview {
    id: string;
    hotelId: string;
    hotelName: string;
    ratings: ReviewRating;
    comment: string;
    images: string[];
    createdAt: string;
}

export type ActiveTab =
    | 'home'
    | 'search'
    | 'detail'
    | 'checkout'
    | 'auth-login'
    | 'auth-register'
    | 'dashboard'
    | 'review'
    | 'checkin'
    | 'wallet'
    | 'promosi';

export interface AppNotification {
    id: string;
    userId: string | null;
    role: 'user' | 'admin';
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

