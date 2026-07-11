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
    hotelId?: string;
    hotel?: {
        name: string;
        [key: string]: any;
    };
}
export interface Room {
    number: string;
    hotelId?: string;
    roomTypeId: string;
    roomTypeName: string;
    floor: string;
    status: 'available' | 'booked' | 'maintenance' | 'OCCUPIED' | 'TERISI';
    bedType: string;
    smoking: boolean;
}

export interface Booking {
    id: string;
    guestName: string;
    guestContact: string;
    checkIn: string;
    checkOut: string;
    checkInDate?: string;
    checkOutDate?: string;
    status: 'dibayar' | 'selesai' | 'pending' | 'batal' | 'aktif' | 'check_in' | 'dibatalkan';
    timeCreated: string;
    roomTypeName: string;
    totalPrice?: number;
}

export interface User {
    id: string;
    initials: string;
    name: string;
    email: string;
    balance: number;
    points: number;
    status: 'aktif' | 'diblokir';
}

export interface Activity {
    id: string;
    type: 'booking' | 'cleaning' | 'cancel' | 'user';
    title: string;
    desc: string;
    time: string;
}

export interface Transaction {
    id: string;
    name: string;
    profileUrl?: string;
    initials?: string;
    roomType: string;
    amount: number;
    status: 'selesai' | 'proses' | 'gagal';
}

