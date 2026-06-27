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
}

export interface Room {
    number: string;
    roomTypeId: string;
    roomTypeName: string;
    floor: string;
    status: 'tersedia' | 'terisi' | 'perawatan' | 'rusak';
    bedType: string;
    smoking: boolean;
}

export interface Booking {
    id: string;
    guestName: string;
    guestContact: string;
    checkIn: string;
    checkOut: string;
    status: 'dibayar' | 'selesai' | 'pending' | 'batal';
    timeCreated: string;
    roomTypeName: string;
}

export interface User {
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

