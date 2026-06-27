import { RoomType, Room, Booking, User, Activity, Transaction } from './types';

export const initialRoomTypes: RoomType[] = [
  {
    id: 'rt-standard',
    name: 'Standard Room',
    unitsAvailable: 45,
    price: 850000,
    capacity: '2 Dewasa',
    capacityNum: 2,
    size: 24,
    bedType: '1 Queen Bed',
    facilities: ['wifi', 'tv', 'ac'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbur4RX92tH8sLosAhTwk6vhNlestwA9ixJXtJyG-9euWQVoSbU9PPZPAZL1kmGKwDN5YB5gtmbSsqs-Xta7k3VylFGxcJRG_euoHFrbebI8NphDJ6AYX4cljBNdGsLv8UjLOq4_WdNBXkMEo4SQb1YfnEn_iRm2zEax7UCsI8x16v0Za8UKn5uVpZixo9RZUig4efaMnhzTrEHlbfbchbWGejTBjHpgJLw3Y693lZGhxN9g2EvUY-owm081du8Qf8UZhBHne4ZHs',
    description: 'Kamar standard yang modern dan minimalis, cocok untuk perjalanan bisnis singkat dengan kenyamanan esensial yang lengkap.'
  },
  {
    id: 'rt-deluxe',
    name: 'Deluxe Suite',
    unitsAvailable: 30,
    price: 1450000,
    capacity: '3 Dewasa',
    capacityNum: 3,
    size: 42,
    bedType: '1 King Bed',
    facilities: ['wifi', 'bathtub', 'ac', 'tv', 'minibar'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLerdjqgNYCzs3kskwpD2mJVSo5VDORznW35WO5iIi0mFVqgtYf9eMrKQXCECeWSbW-HbubjvsRh9ogaZUsJmUpE13hUrEDP7uQ1gcjjb3_d6poSN8IucVVrOQnsz2rZCEO-DSNA9F_RxiEtE7M8ljEh32gOXVMsXreglAA6_UMHoYO--hFcKhO6lQ6RPeWYvn1440SOeoR96t5JaIh1DK1TQiFWrr92KdNXi61TdvA-forlaxujzZ1bWWAy2uxCuqs1YHpMn_Gwo',
    description: 'Suite mewah yang luas dengan pemandangan kota, bak mandi eksklusif, dan dekorasi kayu hangat bernuansa keramahtamahan Indonesia modern.'
  },
  {
    id: 'rt-executive',
    name: 'Executive Room',
    unitsAvailable: 20,
    price: 1150000,
    capacity: '2 Dewasa',
    capacityNum: 2,
    size: 32,
    bedType: '1 King Bed & Sofa Bed',
    facilities: ['wifi', 'ac', 'tv', 'coffee_maker'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1C5VkvO-udEOLPsM7oNVxyxGfBN9g3cMzqLxAR6xTcFnNOo2PfUSFZlkmAS01qu7z0PeU6FdXV7XDcrOZU5Tg4JhLyQ4mGVjouQkeEPQNPpeRbe_4xYGyL_finUxqgdhJ7U6GAD1LoYEE8KpPGnLBbdk1Qjz6qPvcgEiIZH9VCatNBJ8e_dT22SvDzNmS7vuaI6RyUlnbtk8UsIAS4HU_m3gn5eFXgg7WnNIUUaNDY2QiYMxfwTbH4J8li5ZPYEHJjn8ZfsTgxQ8',
    description: 'Kamar eksekutif yang disesuaikan untuk pelancong bisnis tingkat tinggi dengan ruang kerja ergonomis khusus dan pembuat kopi espresso premium.'
  }
];

export const initialRooms: Room[] = [
  {
    number: '101',
    roomTypeId: 'rt-deluxe',
    roomTypeName: 'Deluxe Ocean View',
    floor: 'Lantai 1',
    status: 'tersedia',
    bedType: 'King Bed',
    smoking: false
  },
  {
    number: '102',
    roomTypeId: 'rt-deluxe',
    roomTypeName: 'Deluxe Ocean View',
    floor: 'Lantai 1',
    status: 'terisi',
    bedType: 'Twin Bed',
    smoking: false
  },
  {
    number: '205',
    roomTypeId: 'rt-executive',
    roomTypeName: 'Executive Suite',
    floor: 'Lantai 2',
    status: 'perawatan',
    bedType: 'King Bed',
    smoking: true
  },
  {
    number: '310',
    roomTypeId: 'rt-executive',
    roomTypeName: 'Presidential Villa',
    floor: 'Lantai 3',
    status: 'tersedia',
    bedType: 'Private Pool • 2 Bedrooms',
    smoking: false
  }
];

export const initialBookings: Booking[] = [
  {
    id: 'GS-8842',
    guestName: 'Andi Pratama',
    guestContact: '+62 812 3456 7890',
    checkIn: '15 Okt 2023, 14:00',
    checkOut: '18 Okt 2023, 12:00',
    status: 'dibayar',
    timeCreated: 'Dipesan 2 jam lalu',
    roomTypeName: 'Deluxe Suite'
  },
  {
    id: 'GS-8839',
    guestName: 'Sarah Connor',
    guestContact: '+1 555 019 823',
    checkIn: '10 Okt 2023, 15:30',
    checkOut: '12 Okt 2023, 11:45',
    status: 'selesai',
    timeCreated: 'Dipesan 5 hari lalu',
    roomTypeName: 'Executive Room'
  }
];

export const initialUsers: User[] = [
  {
    initials: 'AW',
    name: 'Arya Wijaya',
    email: 'arya.w@elite-travel.id',
    balance: 12500000,
    points: 4250,
    status: 'aktif'
  },
  {
    initials: 'NL',
    name: 'Nadia Larasati',
    email: 'nadia.l@corporate.co.id',
    balance: 4200000,
    points: 1120,
    status: 'diblokir'
  },
  {
    initials: 'BP',
    name: 'Bima Pratama',
    email: 'bima.p@startuphub.id',
    balance: 8950000,
    points: 2800,
    status: 'aktif'
  },
  {
    initials: 'CK',
    name: 'Citra Kirana',
    email: 'citra.kirana@luxury-lifestyle.com',
    balance: 25000000,
    points: 15400,
    status: 'aktif'
  }
];

export const initialActivities: Activity[] = [
  {
    id: 'act-1',
    type: 'booking',
    title: 'Booking #GS-8842 Dikonfirmasi',
    desc: 'Suite 402 • Tamu: Andi Pratama',
    time: '10 MENIT LALU'
  },
  {
    id: 'act-2',
    type: 'cleaning',
    title: 'Kamar 304 Dibersihkan',
    desc: 'Tim Housekeeping menandai kamar telah siap.',
    time: '45 MENIT LALU'
  },
  {
    id: 'act-3',
    type: 'cancel',
    title: 'Pembatalan Diajukan',
    desc: 'Booking #GS-0988 • Standard Room',
    time: '2 JAM LALU'
  },
  {
    id: 'act-4',
    type: 'user',
    title: 'Pendaftaran Pengguna Baru',
    desc: 'Klien Korporat: PT Maju Jaya',
    time: '3 JAM LALU'
  }
];

export const initialTransactions: Transaction[] = [
  {
    id: 'GS-8829',
    name: 'Budi Santoso',
    initials: 'BS',
    profileUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7zkygALqOaH9n3ByrnvcTZQf-F54hUuQI5z-V0xdY3_LFC_G1pWfKCib4_14a82WTiMTVJbL67hWMhQ7_1-mlCTbXjtfKwxDpZU1kROlfotS24-cjnHcQiEmoAXVFqvg-Qs9d9G5tPapY4eOY8qswXUqFi9QF-kf-6MjSZCVsBH4mIYPjGQ8OLuW0fPNaVrNA5plf1bjuq_vFPLjeq93384oBGV588SbKTSDvdBKZaC202nZDIQ5rpJ-wVbPOMS4BbURmFbv07Vw',
    roomType: 'Royal Suite',
    amount: 4500000,
    status: 'selesai'
  },
  {
    id: 'GS-8828',
    name: 'Siti Aminah',
    initials: 'SA',
    profileUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG721didLpN6_EBlz4suNVirTNmsjeYq-leVhG00fdXwfzDuuICP4J5kjhNukJhTEZpwx5AOWpYVsY8NYOHYvpl3b7QLOGMRnYA2kxpxWfZnqNRf8ezmmTeEV_cy-nqoWjncJCUpxnuE0Rlicwoy4MWvOzW5jskrTq8hwcyEyLrOJ8mVs3gjQdmvaU053WZRV1CWLXFJXggcZW5Jx7B3PCI1j7M_s0hW9iwvkAzmyZxoCV6eh1U1HkY8-wC0p3CD3Sk84D54VYQhU',
    roomType: 'Deluxe Ocean View',
    amount: 2850000,
    status: 'proses'
  },
  {
    id: 'GS-8827',
    name: 'Andi Wijaya',
    initials: 'AW',
    profileUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbfjJZWzZ5XkvAi69NK7aitKlA3HLSZQMm58R9HJFGsClA99er03BetPck_ymewIGaj1sv6hg-lDX7qZjF18FA5A3RietX20TUm9MDrEUjVTsQkwznDbJjZg8OLK3-vpik5JAOUIM_AbhD71hz3tHxeFOfOaKulyYCRpUoWa4Hk5xkIaUPla6_ZwvjXJvpH7d0oOOaieu-bRLG3InMF2SvZw88954WoDhuDikcxf3pxtjn0BHvFtdBL8HAyHaTPtbAiUKL5RtAFdU',
    roomType: 'Presidential Villa',
    amount: 12000000,
    status: 'selesai'
  },
  {
    id: 'GS-8826',
    name: 'Rina Kartika',
    initials: 'RK',
    roomType: 'Standard Garden',
    amount: 1200000,
    status: 'gagal'
  }
];
