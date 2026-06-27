import React, { useState } from 'react';
import { RoomType, Room, Booking, User, Activity, Transaction } from './types';
import {
  initialRoomTypes,
  initialRooms,
  initialBookings,
  initialUsers,
  initialActivities,
  initialTransactions,
} from './data';
import Sidebar from './Sidebar';
import Header from './AdminHeader';
import Overview from './Overview';
import RoomTypes from './RoomTypes';
import Rooms from './Rooms';
import Bookings from './Bookings';
import Users from './Users';
import Financials from './Financials';

interface AdminConsoleProps {
  onLogout: () => void;
}

export default function AdminConsole({ onLogout }: AdminConsoleProps) {
  // Navigation & UI States
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Data States
  const [roomTypes, setRoomTypes] = useState<RoomType[]>(initialRoomTypes);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [revenueToday, setRevenueToday] = useState<number>(124500000);

  // New Reservation Modal State
  const [showReservationModal, setShowReservationModal] = useState<boolean>(false);
  const [newResGuestName, setNewResGuestName] = useState<string>('');
  const [newResContact, setNewResContact] = useState<string>('');
  const [newResCheckIn, setNewResCheckIn] = useState<string>('15 Okt 2023, 14:00');
  const [newResCheckOut, setNewResCheckOut] = useState<string>('18 Okt 2023, 12:00');
  const [newResRoomTypeId, setNewResRoomTypeId] = useState<string>('');

  // 1. Add Room Type Handler
  const handleAddRoomType = (newType: RoomType) => {
    setRoomTypes((prev) => [newType, ...prev]);
    
    // Add activity
    const newAct: Activity = {
      id: 'act-' + Date.now(),
      type: 'user',
      title: 'Tipe Kamar Baru Ditambahkan',
      desc: `${newType.name} dengan tarif Rp ${newType.price.toLocaleString('id-ID')}`,
      time: 'BARU SAJA',
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  // 2. Delete Room Type Handler
  const handleDeleteRoomType = (id: string) => {
    setRoomTypes((prev) => prev.filter((t) => t.id !== id));
  };

  // 3. Add Physical Room Handler
  const handleAddRoom = (newRoom: Room) => {
    setRooms((prev) => [newRoom, ...prev]);
    
    // Add activity
    const newAct: Activity = {
      id: 'act-' + Date.now(),
      type: 'cleaning',
      title: 'Kamar Fisik Ditambahkan',
      desc: `Kamar nomor ${newRoom.number} (${newRoom.roomTypeName}) disiapkan`,
      time: 'BARU SAJA',
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  // 4. Update Room Status Handler
  const handleUpdateRoomStatus = (roomNumber: string, newStatus: Room['status']) => {
    setRooms((prev) =>
      prev.map((r) => (r.number === roomNumber ? { ...r, status: newStatus } : r))
    );

    // Add activity
    const newAct: Activity = {
      id: 'act-' + Date.now(),
      type: 'cleaning',
      title: `Status Kamar ${roomNumber} Diubah`,
      desc: `Status kamar nomor ${roomNumber} kini: ${newStatus.toUpperCase()}`,
      time: 'BARU SAJA',
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  // 5. Cancel Booking Handler
  const handleCancelBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'batal' as const } : b))
    );

    const booking = bookings.find((b) => b.id === id);
    if (!booking) return;

    // Add activity
    const newAct: Activity = {
      id: 'act-' + Date.now(),
      type: 'cancel',
      title: `Reservasi ${id} Dibatalkan`,
      desc: `Tamu: ${booking.guestName} (${booking.roomTypeName})`,
      time: 'BARU SAJA',
    };
    setActivities((prev) => [newAct, ...prev]);

    // Record cancelled transaction
    const newTrans: Transaction = {
      id: 'GS-TR-' + Date.now().toString().slice(-4),
      name: booking.guestName,
      roomType: booking.roomTypeName,
      amount: -1200000, // Refund amount representation
      status: 'gagal',
    };
    setTransactions((prev) => [newTrans, ...prev]);
  };

  // 6. Add Booking Handler (New Reservation Modal)
  const handleNewReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResGuestName || !newResRoomTypeId) {
      alert('Mohon lengkapi formulir reservasi.');
      return;
    }

    const selectedType = roomTypes.find((t) => t.id === newResRoomTypeId);
    if (!selectedType) return;

    const newBookingId = 'GS-' + Math.floor(1000 + Math.random() * 9000);

    const newBooking: Booking = {
      id: newBookingId,
      guestName: newResGuestName,
      guestContact: newResContact || '+62 811-XXXX-XXXX',
      checkIn: newResCheckIn,
      checkOut: newResCheckOut,
      status: 'dibayar',
      timeCreated: 'Dipesan baru saja',
      roomTypeName: selectedType.name,
    };

    setBookings((prev) => [newBooking, ...prev]);
    setRevenueToday((prev) => prev + selectedType.price);

    // Add activity
    const newAct: Activity = {
      id: 'act-' + Date.now(),
      type: 'booking',
      title: `Booking #${newBookingId} Dibuat`,
      desc: `${selectedType.name} • Tamu: ${newResGuestName}`,
      time: 'BARU SAJA',
    };
    setActivities((prev) => [newAct, ...prev]);

    // Add Transaction
    const newTrans: Transaction = {
      id: newBookingId,
      name: newResGuestName,
      roomType: selectedType.name,
      amount: selectedType.price,
      status: 'selesai',
    };
    setTransactions((prev) => [newTrans, ...prev]);

    // Reset Form & Close Modal
    setNewResGuestName('');
    setNewResContact('');
    setNewResRoomTypeId('');
    setShowReservationModal(false);
    setCurrentTab('bookings'); // Redirect to bookings to see the new addition
  };

  // 7. Toggle Member Access Block/Unblock
  const handleToggleUserBlock = (email: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.email === email
          ? { ...u, status: u.status === 'aktif' ? 'diblokir' : 'aktif' }
          : u
      )
    );

    const targetUser = users.find((u) => u.email === email);
    if (!targetUser) return;

    // Add activity
    const isBlocking = targetUser.status === 'aktif';
    const newAct: Activity = {
      id: 'act-' + Date.now(),
      type: 'user',
      title: isBlocking ? `Akses User Diblokir` : `Akses User Dipulihkan`,
      desc: `${targetUser.name} (${email})`,
      time: 'BARU SAJA',
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface font-sans">
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

            {currentTab === 'room-types' && (
              <RoomTypes
                roomTypes={roomTypes}
                rooms={rooms}
                onAddRoomType={handleAddRoomType}
                onDeleteRoomType={handleDeleteRoomType}
              />
            )}

            {currentTab === 'rooms' && (
              <Rooms
                rooms={rooms}
                roomTypes={roomTypes}
                onAddRoom={handleAddRoom}
                onUpdateRoomStatus={handleUpdateRoomStatus}
              />
            )}

            {currentTab === 'bookings' && (
              <Bookings
                bookings={bookings}
                onCancelBooking={handleCancelBooking}
                onAddBooking={(b) => setBookings((prev) => [b, ...prev])}
              />
            )}

            {currentTab === 'users' && (
              <Users
                users={users}
                onToggleUserBlock={handleToggleUserBlock}
              />
            )}

            {currentTab === 'financials' && (
              <Financials
                transactions={transactions}
              />
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
                    onChange={(e) => setNewResRoomTypeId(e.target.value)}
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

              {/* Check in & out Date representation */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-bold" htmlFor="guest_check_in">Check In</label>
                  <input
                    id="guest_check_in"
                    type="text"
                    className="w-full bg-white px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    value={newResCheckIn}
                    onChange={(e) => setNewResCheckIn(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-bold" htmlFor="guest_check_out">Check Out</label>
                  <input
                    id="guest_check_out"
                    type="text"
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
