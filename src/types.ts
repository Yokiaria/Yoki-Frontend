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
    status: 'Selesai' | 'Aktif' | 'Dibatalkan';
    isFlight?: boolean;
    flightNumber?: string;
    airline?: string;
    fromCode?: string;
    toCode?: string;
    departureTime?: string;
    arrivalTime?: string;
    classType?: string;
}

export interface Flight {
    id: string;
    airline: string;
    flightNumber: string;
    fromCode: string;
    fromName: string;
    toCode: string;
    toName: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    price: number;
    classType: 'First Class' | 'Business' | 'Economy';
    inclusions: string[];
}

export interface Promo {
    id: string;
    category: 'FLASH SALE' | 'TIKET PESAWAT' | 'SPA' | 'TRANSFER' | 'STAYCATION';
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
    tier: 'Elite Member' | 'Platinum Member' | 'Regular Member';
    role?: 'user' | 'admin';
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
