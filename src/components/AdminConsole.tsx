import React, { useState, useMemo } from 'react';
import { RoomType, Room, Booking, User, Activity, Transaction } from './types';
import { apiClient } from '../api/apiClient';
import Sidebar from './Sidebar';
import Header from './AdminHeader';
import Overview from './Overview';
import RoomTypes from './RoomTypes';
import Rooms from './Rooms';
import Bookings from './Bookings';
import Users from './Users';
import Financials from './Financials';
import AdminHotels from './AdminHotels';
import AdminPromos from './AdminPromos';
import AdminReviews from './AdminReviews';

interface AdminConsoleProps {
  onLogout: () => void;
}

export default function AdminConsole({ onLogout }: AdminConsoleProps) {
  // Navigation & UI States
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Data States
  // Data States
  const [hotels, setHotels] = useState<any[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [revenueToday, setRevenueToday] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Update document title dynamically based on active tab
  React.useEffect(() => {
    const tabTitles: Record<string, string> = {
      'overview': 'Dashboard Admin | Grandstarind',
      'rooms': 'Manajemen Kamar | Grandstarind',
      'bookings': 'Manajemen Reservasi | Grandstarind',
      'reviews': 'Manajemen Ulasan | Grandstarind',
      'financials': 'Keuangan | Grandstarind',
      'settings': 'Pengaturan | Grandstarind'
    };
    document.title = tabTitles[currentTab] || 'Dashboard Admin | Grandstarind';
  }, [currentTab]);

  // Fetch all admin data on mount
  React.useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [
          hotelsData,
          typesData,
          roomsData,
          bookingsData,
          usersData,
          activitiesData,
          transactionsData,
          statsData
        ] = await Promise.all([
          apiClient.get<any[]>('/hotels').catch(() => []),
          apiClient.get<any[]>('/rooms/types').catch(() => []),
          apiClient.get<any[]>('/rooms').catch(() => []),
          apiClient.get<any[]>('/bookings').catch(() => []),
          apiClient.get<any[]>('/users').catch(() => []),
          apiClient.get<any[]>('/activities').catch(() => []),
          apiClient.get<any[]>('/transactions').catch(() => []),
          apiClient.get<any>('/bookings/stats').catch(() => ({})),
        ]);

        // Normalize RoomType: backend uses sizeSqm, facilities as objects array
        const normalizedTypes: RoomType[] = (Array.isArray(typesData) ? typesData : []).map((t: any) => ({
          id: t.id ?? '',
          name: t.name ?? '',
          unitsAvailable: t.unitsAvailable ?? 0,
          price: Number(t.price) || 0,
          capacity: t.capacity ?? '2 Dewasa',
          capacityNum: t.capacityNum ?? 2,
          size: t.sizeSqm ?? t.size ?? 0,
          bedType: t.bedType ?? '',
          imageUrl: t.imageUrl ?? '',
          description: t.description ?? '',
          // facilities dari backend: array of { id, facility, roomTypeId }
          // frontend expects: array of strings
          facilities: Array.isArray(t.facilities)
            ? t.facilities.map((f: any) => (typeof f === 'string' ? f : f.facility ?? ''))
            : [],
        }));

        // Normalize Room: backend uses roomNumber (not number), has roomType relation object
        const normalizedRooms: Room[] = (Array.isArray(roomsData) ? roomsData : []).map((r: any) => ({
          number: r.roomNumber ?? r.number ?? '',
          roomTypeId: r.roomTypeId ?? r.room_type_id ?? '',
          roomTypeName: r.roomType?.name ?? r.roomTypeName ?? '',
          floor: r.floor ?? '',
          status: r.status ?? 'available',
          bedType: r.bedType ?? r.bed_type ?? '',
          smoking: Boolean(r.smoking),
        }));

        // Normalize Booking: map backend fields to frontend fields
        const normalizedBookings: Booking[] = (Array.isArray(bookingsData) ? bookingsData : []).map((b: any) => ({
          id: b.id ?? '',
          guestName: b.guestName ?? b.user?.name ?? '',
          guestContact: b.guestContact ?? b.user?.phone ?? b.user?.email ?? '',
          checkIn: b.checkIn ?? b.checkInDate ?? '',
          checkOut: b.checkOut ?? b.checkOutDate ?? '',
          checkInDate: b.checkInDate,
          checkOutDate: b.checkOutDate,
          status: b.status ?? 'pending',
          timeCreated: b.timeCreated ?? b.createdAt ?? '',
          roomTypeName: b.roomTypeName ?? b.roomType?.name ?? '',
          totalPrice: b.totalPrice ?? b.price ?? 0,
        }));

        // Normalize User: backend uses loyaltyPoints (not points), initials may be null
        const normalizedUsers: User[] = (Array.isArray(usersData) ? usersData : []).map((u: any) => ({
          id: u.id ?? '',
          initials: u.initials ?? u.name?.slice(0, 2).toUpperCase() ?? 'US',
          name: u.name ?? '',
          email: u.email ?? '',
          balance: Number(u.balance) || 0,
          points: u.loyaltyPoints ?? u.points ?? 0,
          status: u.status ?? 'aktif',
        }));

        // Normalize Activity
        const normalizedActivities: Activity[] = (Array.isArray(activitiesData) ? activitiesData : []).map((a: any) => ({
          id: a.id ?? '',
          type: a.type ?? 'booking',
          title: a.title ?? '',
          desc: a.desc ?? a.description ?? '',
          time: a.time ?? a.createdAt ?? '',
        }));

        // Normalize Transaction
        let normalizedTransactions: Transaction[] = (Array.isArray(transactionsData) ? transactionsData : []).map((t: any) => ({
          id: t.id ?? '',
          name: t.name ?? t.user?.name ?? '',
          profileUrl: t.profileUrl ?? t.user?.profileUrl,
          initials: t.initials ?? t.user?.initials ?? t.user?.name?.slice(0, 2).toUpperCase() ?? '',
          roomType: t.roomType ?? t.roomTypeName ?? '',
          amount: Number(t.totalPrice) || Number(t.price) || Number(t.amount) || 0,
          status: t.status ?? 'proses',
        }));

        // Fallback: If no transactions found, use bookings data as mock transactions
        if (normalizedTransactions.length === 0 && normalizedBookings.length > 0) {
          normalizedTransactions = normalizedBookings.map((b: Booking) => ({
            id: b.id,
            name: b.guestName || b.guestContact || 'Guest',
            profileUrl: undefined,
            initials: (b.guestName || 'G').slice(0, 2).toUpperCase(),
            roomType: b.roomTypeName || 'Tipe Kamar',
            amount: Number(b.totalPrice) || Number((b as any).price) || Number((b as any).amount) || 0,
            status: b.status === 'selesai' ? 'selesai' : b.status === 'dibatalkan' ? 'gagal' : 'proses',
          }));
        }

        setHotels(Array.isArray(hotelsData) ? hotelsData : []);
        setRoomTypes(normalizedTypes);
        setRooms(normalizedRooms);
        setBookings(normalizedBookings);
        setUsers(normalizedUsers);
        setActivities(normalizedActivities);
        setTransactions(normalizedTransactions);

        // Set revenue from backend stats
        setRevenueToday(statsData?.revenue || 0);
      } catch (err: any) {
        console.error("Gagal mengambil data admin", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  // New Reservation Modal State
  const [showReservationModal, setShowReservationModal] = useState<boolean>(false);
  const [newResGuestName, setNewResGuestName] = useState<string>('');
  const [newResContact, setNewResContact] = useState<string>('');
  const [newResCheckIn, setNewResCheckIn] = useState<string>('2024-10-15T14:00');
  const [newResCheckOut, setNewResCheckOut] = useState<string>('2024-10-18T12:00');
  const [newResRoomTypeId, setNewResRoomTypeId] = useState<string>('');
  const [newResRoomId, setNewResRoomId] = useState<string>('');

  // 1. Add/Update Room Type Handler
  const handleSaveRoomType = async (roomType: RoomType, isEdit: boolean) => {
    try {
      const { id, size, hotel, facilities, ...rest } = roomType as any;
      const payload = {
        ...rest,
        hotelId: roomType.hotelId,
        sizeSqm: size || 32,
        facilities: roomType.facilities?.map((f: any) => typeof f === 'string' ? f : f?.facility) || []
      };
      
      let savedData;
      if (isEdit) {
        savedData = await apiClient.put<any>(`/rooms/types/${id}`, payload);
        const frontendData: RoomType = {
          ...roomType, // preserve other local states or strings
          ...savedData,
          size: savedData.sizeSqm || payload.sizeSqm,
          facilities: savedData.facilities || roomType.facilities,
          hotel: hotels.find(h => h.id === savedData.hotelId)
        };
        setRoomTypes(prev => prev.map(t => t.id === id ? frontendData : t));
        
        const newAct: Activity = {
          id: 'act-' + Date.now(),
          type: 'user',
          title: 'Tipe Kamar Diperbarui',
          desc: `${roomType.name} berhasil diubah.`,
          time: 'BARU SAJA',
        };
        setActivities((prev) => [newAct, ...prev]);
        alert('Data tipe kamar berhasil diperbarui di database!');
      } else {
        savedData = await apiClient.post<any>('/rooms/types', payload);
        const frontendData: RoomType = {
          ...savedData,
          size: savedData.sizeSqm || payload.sizeSqm,
          facilities: savedData.facilities || roomType.facilities,
          hotel: hotels.find(h => h.id === savedData.hotelId)
        };
        setRoomTypes((prev) => [frontendData, ...prev]);
        
        const newAct: Activity = {
          id: 'act-' + Date.now(),
          type: 'user',
          title: 'Tipe Kamar Baru Ditambahkan',
          desc: `${roomType.name} dengan tarif Rp ${roomType.price.toLocaleString('id-ID')}`,
          time: 'BARU SAJA',
        };
        setActivities((prev) => [newAct, ...prev]);
        alert('Data tipe kamar berhasil disimpan ke database!');
      }
    } catch (error: any) {
      console.error('Error saat save room type:', error);
      alert(error.message || 'Gagal menyambung ke server backend');
    }
  };
  // 2. Delete Room Type Handler
  const handleDeleteRoomType = async (id: string) => {
    try {
      await apiClient.delete(`/rooms/types/${id}`);
      setRoomTypes((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Gagal menghapus tipe kamar.');
    }
  };

  // 3. Add Physical Room Handler
  const handleAddRoom = async (newRoom: Room) => {
    try {
      const { roomTypeName, number, ...restRoom } = newRoom as any;
      const payload = {
        ...restRoom,
        roomNumber: number,
      };
      
      const savedData = await apiClient.post<any>('/rooms', payload);
      
      const frontendData: Room = {
        ...savedData,
        number: savedData.roomNumber || payload.roomNumber,
        roomTypeName: newRoom.roomTypeName,
      };
      
      setRooms((prev) => [frontendData, ...prev]);
      
      const newAct: Activity = {
        id: 'act-' + Date.now(),
        type: 'cleaning',
        title: 'Kamar Fisik Ditambahkan',
        desc: `Kamar nomor ${newRoom.number} (${newRoom.roomTypeName}) disiapkan`,
        time: 'BARU SAJA',
      };
      setActivities((prev) => [newAct, ...prev]);
      alert('Data kamar fisik berhasil disimpan ke database!');
    } catch (error: any) {
      console.error('Error saat add room:', error);
      alert(error.message || 'Gagal menyambung ke server backend saat menambah kamar');
    }
  };

  // 4. Update Room Status Handler
  const handleUpdateRoomStatus = async (roomNumber: string, newStatus: Room['status']) => {
    try {
      await apiClient.patch(`/rooms/${roomNumber}/status`, { status: newStatus });
      setRooms((prev) =>
        prev.map((r) => (r.number === roomNumber ? { ...r, status: newStatus } : r))
      );

      const newAct: Activity = {
        id: 'act-' + Date.now(),
        type: 'cleaning',
        title: `Status Kamar ${roomNumber} Diubah`,
        desc: `Status kamar nomor ${roomNumber} kini: ${newStatus.toUpperCase()}`,
        time: 'BARU SAJA',
      };
      setActivities((prev) => [newAct, ...prev]);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Gagal memperbarui status kamar.');
    }
  };

  // 5. Cancel Booking Handler
  const handleCancelBooking = async (id: string) => {
    try {
      await apiClient.put(`/bookings/${id}/cancel`);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'batal' as const } : b))
      );

      const booking = bookings.find((b) => b.id === id);
      if (!booking) return;

      const newAct: Activity = {
        id: 'act-' + Date.now(),
        type: 'cancel',
        title: `Reservasi ${id} Dibatalkan`,
        desc: `Tamu: ${booking.guestName} (${booking.roomTypeName})`,
        time: 'BARU SAJA',
      };
      setActivities((prev) => [newAct, ...prev]);

      const newTrans: Transaction = {
        id: 'GS-TR-' + Date.now().toString().slice(-4),
        name: booking.guestName,
        roomType: booking.roomTypeName,
        amount: -1200000,
        status: 'gagal',
      };
      setTransactions((prev) => [newTrans, ...prev]);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal membatalkan reservasi.');
    }
  };

  // 5b. Activate Booking Handler
  const handleActivateBooking = async (id: string) => {
    try {
      await apiClient.patch(`/bookings/${id}/confirm`);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'confirmed' as any } : b))
      );

      const booking = bookings.find((b) => b.id === id);
      if (!booking) return;

      const newAct: Activity = {
        id: 'act-' + Date.now(),
        type: 'booking',
        title: `Reservasi ${id} Dikonfirmasi`,
        desc: `Tamu: ${booking.guestName} (${booking.roomTypeName})`,
        time: 'BARU SAJA',
      };
      setActivities((prev) => [newAct, ...prev]);
    } catch (err) {
      console.error(err);
      alert('Gagal mengaktifkan reservasi.');
    }
  };

  // 5c. Check-in Booking Handler
  const handleCheckInBooking = async (id: string) => {
    try {
      await apiClient.patch(`/bookings/${id}/claim`);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'check_in' as any } : b))
      );

      const booking = bookings.find((b) => b.id === id);
      if (!booking) return;

      const newAct: Activity = {
        id: 'act-' + Date.now(),
        type: 'booking',
        title: `Tamu Check-In (${id})`,
        desc: `Tamu: ${booking.guestName} (${booking.roomTypeName}) telah check-in`,
        time: 'BARU SAJA',
      };
      setActivities((prev) => [newAct, ...prev]);
    } catch (err) {
      console.error(err);
      alert('Gagal memproses check-in.');
    }
  };

  // 5d. Complete Booking Handler
  const handleCompleteBooking = async (id: string) => {
    try {
      // Hitung tagihan/checkout
      await apiClient.patch(`/bookings/${id}/checkout`);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'selesai' as any } : b))
      );

      const booking = bookings.find((b) => b.id === id);
      if (!booking) return;

      const newAct: Activity = {
        id: 'act-' + Date.now(),
        type: 'booking',
        title: `Reservasi ${id} Selesai`,
        desc: `Tamu: ${booking.guestName} (${booking.roomTypeName})`,
        time: 'BARU SAJA',
      };
      setActivities((prev) => [newAct, ...prev]);
      
      // Bisa juga menambah logic revenue hari ini kalau diperlukan
    } catch (err) {
      console.error(err);
      alert('Gagal menyelesaikan reservasi.');
    }
  };

  // Computed Available Rooms based on Room Type & Dates
  const availableRoomsForSelection = useMemo(() => {
    if (!newResRoomTypeId || !newResCheckIn || !newResCheckOut) return [];
    
    const checkInDate = new Date(newResCheckIn).getTime();
    const checkOutDate = new Date(newResCheckOut).getTime();
    
    if (isNaN(checkInDate) || isNaN(checkOutDate)) return [];
    
    // Filter physical rooms for this room type
    const candidateRooms = rooms.filter(r => r.roomTypeId === newResRoomTypeId && r.status === 'available');
    
    // Check overlapping bookings
    return candidateRooms.filter(room => {
      // Find any booking that uses this room and overlaps
      const conflictingBooking = bookings.find(b => {
        if (b.roomId !== room.id) return false;
        if (b.status === 'batal' || b.status === 'selesai') return false;
        
        const bIn = new Date(b.checkInDate || b.checkIn).getTime();
        const bOut = new Date(b.checkOutDate || b.checkOut).getTime();
        
        // Check overlap: start A < end B && end A > start B
        return bIn < checkOutDate && bOut > checkInDate;
      });
      
      return !conflictingBooking;
    });
  }, [newResRoomTypeId, newResCheckIn, newResCheckOut, rooms, bookings]);

  // 6. Add Booking Handler (New Reservation Modal)
  const handleNewReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResGuestName || !newResRoomTypeId) {
      alert('Mohon lengkapi formulir reservasi.');
      return;
    }

    const selectedType = roomTypes.find((t) => t.id === newResRoomTypeId);
    if (!selectedType) return;

    // Payload yang sesuai dengan CreateBookingDto backend
    const payload = {
      guestName: newResGuestName,
      guestContact: newResContact || undefined,
      roomTypeId: newResRoomTypeId,
      roomId: newResRoomId || undefined,
      checkInDate: newResCheckIn ? new Date(newResCheckIn).toISOString() : undefined,
      checkOutDate: newResCheckOut ? new Date(newResCheckOut).toISOString() : undefined,
      totalPrice: selectedType.price,
      paymentMethod: 'manual-admin',
    };

    try {
      const savedBooking = await apiClient.post<any>('/bookings', payload);

      // Normalize response ke format frontend Booking
      const frontendBooking: Booking = {
        id: savedBooking.id ?? 'GS-' + Date.now(),
        guestName: savedBooking.guestName ?? newResGuestName,
        guestContact: savedBooking.guestContact ?? newResContact,
        checkIn: savedBooking.checkInDate ?? savedBooking.checkIn ?? newResCheckIn,
        checkOut: savedBooking.checkOutDate ?? savedBooking.checkOut ?? newResCheckOut,
        status: savedBooking.status ?? 'dibayar',
        timeCreated: savedBooking.createdAt ?? 'Baru saja',
        roomTypeName: savedBooking.roomType?.name ?? selectedType.name,
      };

      setBookings((prev) => [frontendBooking, ...prev]);
      setRevenueToday((prev) => prev + selectedType.price);

      const newAct: Activity = {
        id: 'act-' + Date.now(),
        type: 'booking',
        title: `Booking #${frontendBooking.id} Dibuat`,
        desc: `${selectedType.name} • Tamu: ${newResGuestName}`,
        time: 'BARU SAJA',
      };
      setActivities((prev) => [newAct, ...prev]);

      const newTrans: Transaction = {
        id: frontendBooking.id,
        name: newResGuestName,
        roomType: selectedType.name,
        amount: selectedType.price,
        status: 'selesai',
      };
      setTransactions((prev) => [newTrans, ...prev]);

      setNewResCheckIn('2024-10-15T14:00');
      setNewResCheckOut('2024-10-18T12:00');
      setNewResRoomTypeId('');
      setNewResRoomId('');
      setShowReservationModal(false);
      setCurrentTab('bookings');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Gagal membuat reservasi baru.');
    }
  };

  // 7. Toggle Member Access Block/Unblock
  const handleToggleUserBlock = async (id: string) => {
    try {
      await apiClient.patch(`/users/${id}/toggle-status`);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? { ...u, status: u.status === 'aktif' ? 'diblokir' : 'aktif' }
            : u
        )
      );

      const targetUser = users.find((u) => u.id === id);
      if (!targetUser) return;

      const isBlocking = targetUser.status === 'aktif';
      const newAct: Activity = {
        id: 'act-' + Date.now(),
        type: 'user',
        title: isBlocking ? `Akses User Diblokir` : `Akses User Dipulihkan`,
        desc: `${targetUser.name} (${targetUser.email})`,
        time: 'BARU SAJA',
      };
      setActivities((prev) => [newAct, ...prev]);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Gagal mengubah status user.');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface font-sans animate-in fade-in duration-500 ease-out">
      {/* SideNavBar - responsive, has drawer logic built in */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onNewReservation={() => setShowReservationModal(true)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* TopAppBar component with search input hooks */}
        <Header
          onToggleSidebar={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder={
            currentTab === 'room-types'
              ? 'Cari tipe kamar...'
              : currentTab === 'rooms'
              ? 'Cari nomor kamar...'
              : currentTab === 'bookings'
              ? 'Cari tamu atau ID pesanan...'
              : currentTab === 'users'
              ? 'Cari nama atau email member...'
              : 'Cari transaksi, tamu, atau kamar...'
          }
        />

        {/* Scrollable Page Content Container */}
        <main className="flex-1 overflow-y-auto px-6 py-8 md:p-10 bg-surface-container-lowest">
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* Conditional Tab Rendering */}
                {currentTab === 'overview' && (
              <Overview
                rooms={rooms}
                bookings={bookings}
                activities={activities}
                revenueToday={revenueToday}
                onNavigateToTab={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === 'hotels' && <AdminHotels hotels={hotels} onRefresh={() => {
              apiClient.get<any[]>('/hotels').then(res => setHotels(Array.isArray(res) ? res : [])).catch(() => {});
            }} />}

            {currentTab === 'room-types' && (
              <RoomTypes
                hotels={hotels}
                roomTypes={roomTypes}
                rooms={rooms}
                onSaveRoomType={handleSaveRoomType}
                onDeleteRoomType={handleDeleteRoomType}
                searchQuery={searchQuery}
              />
            )}

            {currentTab === 'rooms' && (
              <Rooms
                hotels={hotels}
                rooms={rooms}
                roomTypes={roomTypes}
                onAddRoom={handleAddRoom}
                onUpdateRoomStatus={handleUpdateRoomStatus}
                searchQuery={searchQuery}
              />
            )}

            {currentTab === 'bookings' && (
              <Bookings
                bookings={bookings}
                onCancelBooking={handleCancelBooking}
                onActivateBooking={handleActivateBooking}
                onCheckInBooking={handleCheckInBooking}
                onCompleteBooking={handleCompleteBooking}
                onAddBooking={(b) => setBookings((prev) => [b, ...prev])}
                searchQuery={searchQuery}
              />
            )}

            {currentTab === 'reviews' && (
              <AdminReviews />
            )}

            {currentTab === 'users' && (
              <Users
                users={users}
                onToggleUserBlock={handleToggleUserBlock}
                searchQuery={searchQuery}
              />
            )}

            {currentTab === 'financials' && (
              <Financials
                transactions={transactions}
                searchQuery={searchQuery}
                onNavigateToTab={setCurrentTab}
              />
            )}

            {currentTab === 'promos' && (
              <AdminPromos />
            )}

            {/* Custom crafted Settings template */}
            {currentTab === 'settings' && (
              <div className="space-y-8 animate-fade-in select-none max-w-3xl">
                <div>
                  <h2 className="font-display text-3xl font-bold text-primary">Konfigurasi Sistem</h2>
                  <p className="text-body-lg text-on-surface-variant mt-2">
                    Sesuaikan peraturan umum reservasi, tarif dasar, dan identitas properti GRANDSTARIND.
                  </p>
                </div>

                <div className="glass-panel p-6 md:p-8 rounded-24 border border-outline-variant/20 shadow-sm space-y-6 bg-white">
                  <h3 className="text-lg font-bold text-primary border-b border-gray-100 pb-3">Profil Properti</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-xs font-bold text-on-surface-variant uppercase">Nama Hotel</span>
                      <p className="font-semibold text-primary mt-1">GRANDSTARIND HOTEL &amp; RESORT INDONESIA</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-on-surface-variant uppercase">ID Klien</span>
                      <p className="font-mono text-primary font-semibold mt-1">GSHR-ELITE-99</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-on-surface-variant uppercase">Mata Uang</span>
                      <p className="font-semibold text-primary mt-1">Rupiah (IDR)</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-on-surface-variant uppercase">Bahasa Default</span>
                      <p className="font-semibold text-primary mt-1">Bahasa Indonesia</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => alert('Konfigurasi berhasil disimpan!')}
                      className="px-6 py-2.5 bg-primary text-white font-bold rounded-full text-xs hover:bg-primary/95 shadow-md cursor-pointer"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Custom crafted Support template */}
            {currentTab === 'support' && (
              <div className="space-y-8 animate-fade-in select-none max-w-3xl">
                <div>
                  <h2 className="font-display text-3xl font-bold text-primary">Bantuan &amp; Panduan</h2>
                  <p className="text-body-lg text-on-surface-variant mt-2">
                    Layanan concierge eksklusif, dokumentasi admin console, dan pusat panggilan darurat.
                  </p>
                </div>

                <div className="glass-panel p-6 md:p-8 rounded-24 border border-outline-variant/20 shadow-sm space-y-4 bg-white">
                  <h3 className="text-lg font-bold text-primary border-b border-gray-100 pb-2">Kontak Concierge Support</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Jika Anda mengalami kendala teknis atau masalah sinkronisasi kamar, silakan hubungi tim IT Administrator melalui saluran komunikasi di bawah ini:
                  </p>
                  <div className="space-y-3 pt-2 text-sm font-semibold text-primary">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-gray-500">mail</span>
                      <span>it-support@grandstarind-resort.id</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-gray-500">phone_iphone</span>
                      <span>+62 (21) 500-999-00 (Ext. 24)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
            )}
          </div>
        </main>
      </div>

      {/* NEW RESERVATION MODAL POPUP */}
      {showReservationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleNewReservationSubmit}
            className="bg-white rounded-24 shadow-2xl border border-outline-variant/20 w-full max-w-lg overflow-hidden animate-scale-up select-none"
          >
            {/* Header */}
            <div className="bg-primary text-white px-6 py-5 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#ffe084]">Tambah Manual</span>
                <h4 className="font-display font-extrabold text-2xl mt-0.5">Reservasi Baru</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowReservationModal(false)}
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Form Fields */}
            <div className="p-6 space-y-4 text-sm font-semibold text-on-surface-variant">
              {/* Guest Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider font-bold" htmlFor="guest_name">
                  Nama Tamu <span className="text-error font-bold">*</span>
                </label>
                <input
                  id="guest_name"
                  type="text"
                  required
                  placeholder="Contoh: Andi Pratama"
                  className="w-full bg-white px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  value={newResGuestName}
                  onChange={(e) => setNewResGuestName(e.target.value)}
                />
              </div>

              {/* Guest Contact */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider font-bold" htmlFor="guest_contact">
                  Nomor Kontak / WhatsApp
                </label>
                <input
                  id="guest_contact"
                  type="text"
                  placeholder="Contoh: +62 812-3456-7890"
                  className="w-full bg-white px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  value={newResContact}
                  onChange={(e) => setNewResContact(e.target.value)}
                />
              </div>

              {/* Select Room Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider font-bold" htmlFor="guest_room_type">
                  Pilih Kategori Kamar <span className="text-error font-bold">*</span>
                </label>
                <div className="relative">
                  <select
                    id="guest_room_type"
                    required
                    className="w-full bg-white px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface font-medium focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer outline-none appearance-none"
                    value={newResRoomTypeId}
                    onChange={(e) => {
                      setNewResRoomTypeId(e.target.value);
                      setNewResRoomId('');
                    }}
                  >
                    <option value="" disabled>Pilih kategori kamar...</option>
                    {roomTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} - Rp {type.price.toLocaleString('id-ID')}/malam
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Select Specific Room */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider font-bold" htmlFor="guest_room_id">
                  Pilih Nomor Kamar
                </label>
                <div className="relative">
                  <select
                    id="guest_room_id"
                    disabled={!newResRoomTypeId || !newResCheckIn || !newResCheckOut}
                    className={`w-full bg-white px-4 py-2.5 rounded-xl border border-outline-variant font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none ${!newResRoomTypeId ? 'text-on-surface-variant/60 cursor-not-allowed bg-surface-container/50' : 'text-on-surface cursor-pointer'}`}
                    value={newResRoomId}
                    onChange={(e) => setNewResRoomId(e.target.value)}
                  >
                    {!newResRoomTypeId || !newResCheckIn || !newResCheckOut ? (
                      <option value="" disabled>Pilih tanggal dan tipe kamar terlebih dahulu...</option>
                    ) : availableRoomsForSelection.length === 0 ? (
                      <option value="" disabled className="text-error font-bold">Tidak ada kamar tersedia pada tanggal tersebut</option>
                    ) : (
                      <>
                        <option value="" disabled>Pilih nomor kamar (Opsional)</option>
                        {availableRoomsForSelection.map((room) => (
                          <option key={room.id} value={room.id}>
                            {room.roomNumber} - Lantai {room.floor}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Check in & out Date representation */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-bold" htmlFor="guest_check_in">Check In</label>
                   <input
                    id="guest_check_in"
                    type="datetime-local"
                    className="w-full bg-white px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    value={newResCheckIn}
                    onChange={(e) => setNewResCheckIn(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-bold" htmlFor="guest_check_out">Check Out</label>
                   <input
                    id="guest_check_out"
                    type="datetime-local"
                    className="w-full bg-white px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    value={newResCheckOut}
                    onChange={(e) => setNewResCheckOut(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="bg-surface px-6 py-4 flex justify-end gap-3 border-t border-outline-variant/10">
              <button
                type="button"
                onClick={() => setShowReservationModal(false)}
                className="px-5 py-2.5 border border-primary text-primary font-bold rounded-full text-xs hover:bg-primary/5 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary text-white font-bold rounded-full text-xs hover:bg-primary/95 transition-all cursor-pointer shadow-sm"
              >
                Buat Reservasi
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
