import React, { useState, useMemo, useEffect } from 'react';
import { Booking } from './types';
import { apiClient } from '../api/apiClient';

interface BookingsProps {
  bookings: Booking[];
  onCancelBooking: (id: string) => void;
  onActivateBooking: (id: string) => void;
  onCheckInBooking: (id: string) => void;
  onCompleteBooking: (id: string) => void;
  onAddBooking: (newBooking: Booking) => void;
  searchQuery: string;
}

export default function Bookings({
  bookings,
  onCancelBooking,
  onActivateBooking,
  onCheckInBooking,
  onCompleteBooking,
  onAddBooking,
  searchQuery,
}: BookingsProps) {
  const [activeFilter, setActiveFilter] = useState<'semua' | 'hari-ini' | 'butuh-tindakan'>('semua');
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (activeFilter === 'hari-ini') {
      apiClient.get<any[]>('/bookings?status=today')
        .then(res => {
          const normalizedBookings: Booking[] = (Array.isArray(res) ? res : []).map((b: any) => ({
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
          }));
          setTodayBookings(normalizedBookings);
        })
        .catch(err => console.error(err));
    }
  }, [activeFilter]);
  
  // Modal State for Viewing Details
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Dynamic state filters
  const filteredBookings = useMemo(() => {
    let result = activeFilter === 'hari-ini' ? [...todayBookings] : [...bookings];

    // Search query matching
    if (searchQuery && searchQuery.trim() !== '') {
      result = result.filter((b) =>
        b.guestName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.roomTypeName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Tab Filters
    if (activeFilter === 'hari-ini') {
      // Sudah terfilter dari Backend
    } else if (activeFilter === 'butuh-tindakan') {
      // Pending or non-completed items
      result = result.filter((b) => b.status === 'tentative' || b.status === 'confirmed');
    }

    return result;
  }, [bookings, activeFilter, searchQuery, todayBookings]);

  return (
    <div className="space-y-8 animate-fade-in pb-12 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold text-primary">Manajemen Reservasi</h2>
          <p className="text-body-lg text-on-surface-variant mt-2">
            Tinjau, kelola, dan perbarui status pesanan tamu Anda.
          </p>
        </div>

        {/* Quick Tabs */}
        <div className="flex bg-surface-container-low rounded-xl p-1 border border-outline-variant/20 shadow-sm self-start sm:self-auto select-none">
          <button
            onClick={() => setActiveFilter('semua')}
            className={`px-4 py-2 rounded-lg font-medium text-xs tracking-wider uppercase transition-all cursor-pointer ${
              activeFilter === 'semua'
                ? 'bg-primary text-white shadow-sm font-bold'
                : 'text-on-surface-variant hover:text-primary hover:bg-white/50'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setActiveFilter('hari-ini')}
            className={`px-4 py-2 rounded-lg font-medium text-xs tracking-wider uppercase transition-all cursor-pointer ${
              activeFilter === 'hari-ini'
                ? 'bg-primary text-white shadow-sm font-bold'
                : 'text-on-surface-variant hover:text-primary hover:bg-white/50'
            }`}
          >
            Masuk Hari Ini
          </button>
          <button
            onClick={() => setActiveFilter('butuh-tindakan')}
            className={`px-4 py-2 rounded-lg font-medium text-xs tracking-wider uppercase transition-all cursor-pointer ${
              activeFilter === 'butuh-tindakan'
                ? 'bg-primary text-white shadow-sm font-bold'
                : 'text-on-surface-variant hover:text-primary hover:bg-white/50'
            }`}
          >
            Butuh Tindakan
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="glass-panel p-4 rounded-24 shadow-sm border border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          {/* Using global search from AdminHeader */}
        </div>
        <div className="text-xs text-on-surface-variant font-semibold">
          Daftar diperbarui secara berkala
        </div>
      </div>

      {/* Presentation Table Container */}
      <div className="bg-white rounded-24 shadow-sm border border-outline-variant/20 overflow-hidden flex flex-col">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-5 bg-surface-container-low/50 border-b border-outline-variant/20 font-bold uppercase tracking-wider text-[11px] text-on-surface-variant select-none">
          <div className="col-span-2">ID Pesanan</div>
          <div className="col-span-3">Tamu &amp; Kontak</div>
          <div className="col-span-3">Jadwal Menginap</div>
          <div className="col-span-2">Status Pesanan</div>
          <div className="col-span-2 text-right">Aksi</div>
        </div>

        {/* Data List rows */}
        <div className="flex flex-col divide-y divide-outline-variant/10">
          {filteredBookings.length === 0 ? (
            <div className="p-16 text-center text-on-surface-variant font-medium">
              Tidak ada data reservasi yang sesuai.
            </div>
          ) : (
            filteredBookings.map((b) => {
              // Status Styling
              let statusLabel = 'Dibayar';
              let statusClass = 'bg-[#e2f9ec] text-[#00a858]';
              let statusDot = 'bg-[#00a858]';

              if (b.status === 'selesai') {
                statusLabel = 'Selesai';
                statusClass = 'bg-surface-container-highest text-on-surface-variant';
                statusDot = 'bg-on-surface-variant';
              } else if (b.status === 'tentative') {
                statusLabel = 'Menunggu Bayar';
                statusClass = 'bg-[#fff4d8] text-secondary';
                statusDot = 'bg-secondary';
              } else if (b.status === 'batal') {
                statusLabel = 'Dibatalkan';
                statusClass = 'bg-error-container text-error';
                statusDot = 'bg-error';
              } else if (b.status === 'confirmed') {
                statusLabel = 'Terkonfirmasi';
                statusClass = 'bg-[#e2f9ec] text-[#00a858]';
                statusDot = 'bg-[#00a858]';
              } else if (b.status === 'check_in') {
                statusLabel = 'Check-in';
                statusClass = 'bg-[#e0f2fe] text-[#0284c7]';
                statusDot = 'bg-[#0284c7]';
              }

              return (
                <div
                  key={b.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 md:px-8 py-6 hover:bg-surface-bright transition-colors items-center group relative"
                >
                  {/* Booking ID & Time ago */}
                  <div className="col-span-2 flex flex-col">
                    <span className="font-display font-extrabold text-xl text-primary">{b.id}</span>
                    <span className="text-[10px] font-semibold text-gray-400 mt-1 uppercase tracking-wider">
                      {b.timeCreated}
                    </span>
                  </div>

                  {/* Guest details */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary-fixed/20 flex items-center justify-center text-secondary font-extrabold shadow-sm select-none">
                      {b.guestName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-on-surface text-sm truncate">{b.guestName}</span>
                      <span className="text-xs text-on-surface-variant truncate mt-0.5">{b.guestContact}</span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="col-span-3 flex flex-col">
                    <div className="flex items-center gap-2 text-xs font-semibold text-on-surface">
                      <span className="material-symbols-outlined text-[15px] text-gray-400">login</span>
                      {b.checkInDate ? new Date(b.checkInDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : b.checkIn}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant mt-1.5">
                      <span className="material-symbols-outlined text-[15px] text-gray-400">logout</span>
                      {b.checkOutDate ? new Date(b.checkOutDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : b.checkOut}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${statusClass}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                      {statusLabel}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                      title="Lihat Detail"
                    >
                      <span className="material-symbols-outlined">visibility</span>
                    </button>
                    {String(b.status).toUpperCase() === 'BOOKED' && (
                      <button
                        onClick={() => onCheckInBooking(b.id)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-outline hover:text-green-600 hover:bg-green-50 transition-colors cursor-pointer"
                        title="Klaim Kamar / Check-In"
                      >
                        <span className="material-symbols-outlined">how_to_reg</span>
                      </button>
                    )}
                    {(String(b.status).toUpperCase() === 'CHECK_IN' || String(b.status).toUpperCase() === 'CHECKED_IN') && (
                      <button
                        onClick={() => onCompleteBooking(b.id)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-outline hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                        title="Check-out (Kasir)"
                      >
                        <span className="material-symbols-outlined">logout</span>
                      </button>
                    )}
                    {(String(b.status).toUpperCase() === 'BOOKED' || String(b.status).toUpperCase() === 'PENDING') && (
                      <button
                        onClick={() => onCancelBooking(b.id)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-outline hover:text-error hover:bg-error/5 transition-colors cursor-pointer"
                        title="Batalkan Reservasi"
                      >
                        <span className="material-symbols-outlined">cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="bg-surface-container-lowest border-t border-outline-variant/20 px-8 py-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface-variant">
            Menampilkan 1-{filteredBookings.length} dari {filteredBookings.length} pesanan aktif
          </span>
          <div className="flex gap-1.5">
            <button className="w-8 h-8 rounded-lg border border-outline-variant/30 flex items-center justify-center text-outline hover:bg-surface-container transition-colors disabled:opacity-50">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded-lg border border-outline-variant/30 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Beautiful Modal Component for Viewing Guest Booking Details */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-24 shadow-2xl border border-outline-variant/20 w-full max-w-lg overflow-hidden animate-scale-up select-none">
            {/* Header */}
            <div className="bg-primary text-white px-6 py-5 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#ffe084]">Reservasi Detail</span>
                <h4 className="font-display font-extrabold text-2xl mt-0.5">{selectedBooking.id}</h4>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Guest Profile Summary */}
              <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                  {selectedBooking.guestName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h5 className="font-bold text-primary text-base">{selectedBooking.guestName}</h5>
                  <p className="text-sm text-on-surface-variant mt-0.5">{selectedBooking.guestContact}</p>
                </div>
              </div>

              {/* Detail list Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs font-bold tracking-wider text-on-surface-variant uppercase">Check In</span>
                  <p className="font-semibold text-primary mt-1">{selectedBooking.checkIn}</p>
                </div>
                <div>
                  <span className="text-xs font-bold tracking-wider text-on-surface-variant uppercase">Check Out</span>
                  <p className="font-semibold text-primary mt-1">{selectedBooking.checkOut}</p>
                </div>
                <div>
                  <span className="text-xs font-bold tracking-wider text-on-surface-variant uppercase">Tipe Kamar Pilihan</span>
                  <p className="font-semibold text-primary mt-1">{selectedBooking.roomTypeName}</p>
                </div>
                <div>
                  <span className="text-xs font-bold tracking-wider text-on-surface-variant uppercase">Status Saat Ini</span>
                  <div className="mt-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize bg-primary/10 text-primary">
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Friendly message */}
              <div className="text-xs text-on-surface-variant bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 italic leading-relaxed">
                "Tamu ini berhak mendapatkan layanan prioritas concierge. Pastikan check-in berlangsung dengan ramah sesuai standar GrandStarInd."
              </div>
            </div>

            {/* Actions */}
            <div className="bg-surface px-6 py-4 flex justify-end gap-3 border-t border-outline-variant/10">
              {selectedBooking.status === 'tentative' && (
                <>
                  <button
                    onClick={() => {
                      onCancelBooking(selectedBooking.id);
                      setSelectedBooking(null);
                    }}
                    className="px-5 py-2.5 bg-error text-white font-bold rounded-full text-xs hover:bg-error/90 transition-all cursor-pointer shadow-sm"
                  >
                    Batalkan Pesanan
                  </button>
                  <button
                    onClick={() => {
                      onActivateBooking(selectedBooking.id);
                      setSelectedBooking(null);
                    }}
                    className="px-5 py-2.5 bg-primary text-white font-bold rounded-full text-xs hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
                  >
                    ✅ Konfirmasi Pembayaran
                  </button>
                </>
              )}
              
              {selectedBooking.status === 'confirmed' && (
                <button
                  onClick={() => {
                    onCheckInBooking(selectedBooking.id);
                    setSelectedBooking(null);
                  }}
                  className="px-5 py-2.5 bg-secondary text-white font-bold rounded-full text-xs hover:bg-secondary/90 transition-all cursor-pointer shadow-sm"
                >
                  🔑 Proses Check-In
                </button>
              )}

              {selectedBooking.status === 'check_in' && (
                <button
                  onClick={() => {
                    onCompleteBooking(selectedBooking.id);
                    setSelectedBooking(null);
                  }}
                  className="px-5 py-2.5 bg-primary text-white font-bold rounded-full text-xs hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
                >
                  🏁 Selesai / Check-out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
