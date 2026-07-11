import React, { useState, useMemo, useEffect } from 'react';
import { Room, RoomType } from './types';
import { apiClient } from '../api/apiClient';

interface RoomsProps {
  hotels: any[];
  rooms: Room[];
  roomTypes: RoomType[];
  onAddRoom: (newRoom: Room) => void;
  onUpdateRoomStatus: (roomNumber: string, newStatus: Room['status']) => void;
  searchQuery: string;
}

export default function Rooms({
  hotels,
  rooms,
  roomTypes,
  onAddRoom,
  onUpdateRoomStatus,
  searchQuery,
}: RoomsProps) {
  const [viewState, setViewState] = useState<'list' | 'add'>('list');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'occupied' | 'maintenance'>('all');
  const [sortOption, setSortOption] = useState<'high' | 'asc'>('asc');

  // Form Field States
  const [formHotelId, setFormHotelId] = useState('');
  const [formNumber, setFormNumber] = useState('');
  const [formRoomTypeId, setFormRoomTypeId] = useState('');
  const [formStatus, setFormStatus] = useState<Room['status']>('available');
  
  const [filteredRoomTypes, setFilteredRoomTypes] = useState<RoomType[]>([]);

  useEffect(() => {
    if (formHotelId) {
      apiClient.get<RoomType[]>('/rooms/types?hotelId=' + formHotelId)
        .then(res => setFilteredRoomTypes(res || []))
        .catch(() => setFilteredRoomTypes([]));
    } else {
      setFilteredRoomTypes([]);
      setFormRoomTypeId('');
    }
  }, [formHotelId]);

  const handleResetForm = () => {
    setFormHotelId('');
    setFormNumber('');
    setFormRoomTypeId('');
    setFormStatus('available');
    setViewState('list');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formHotelId || !formNumber || !formRoomTypeId) {
      alert('Mohon isi kolom wajib (*) terlebih dahulu.');
      return;
    }

    const selectedType = filteredRoomTypes.find((t) => t.id === formRoomTypeId);
    if (!selectedType) return;

    // Determine floor based on first character of room number
    const firstDigit = formNumber.trim().charAt(0);
    const floor = isNaN(Number(firstDigit)) ? 'Lantai 1' : `Lantai ${firstDigit}`;

    const newRoom: Room = {
      number: formNumber.trim(),
      hotelId: formHotelId,
      roomTypeId: formRoomTypeId,
      roomTypeName: selectedType.name,
      floor: floor,
      status: formStatus,
      bedType: selectedType.bedType,
      smoking: false,
    };

    onAddRoom(newRoom);
    handleResetForm();
  };

  // Filter & Sort Rooms list
  const processedRooms = useMemo(() => {
    let result = [...rooms];

    // Search Filter
    if (searchQuery && searchQuery.trim() !== '') {
      result = result.filter((r) =>
        r.number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.roomTypeName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((r) => r.status === statusFilter);
    }

    // Sort options
    result.sort((a, b) => {
      if (sortOption === 'high') {
        // Higher floors first (comparing strings/numbers)
        return b.floor.localeCompare(a.floor) || b.number.localeCompare(a.number);
      } else {
        // Floor and number ascending
        return a.number.localeCompare(b.number);
      }
    });

    return result;
  }, [rooms, searchQuery, statusFilter, sortOption]);

  // Quick edit status dropdown toggler for instant inline editing!
  const [activeStatusEditNum, setActiveStatusEditNum] = useState<string | null>(null);

  return (
    <div className="space-y-8 animate-fade-in pb-12 select-none">
      {/* View Switch: Add Form */}
      {viewState === 'add' ? (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Form Header */}
          <div>
            <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-2">
              <button
                onClick={() => setViewState('list')}
                className="hover:text-primary transition-colors cursor-pointer font-medium"
              >
                Rooms
              </button>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <span className="text-on-surface font-bold">Tambah Unit</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-primary">Tambah Unit Kamar</h2>
            <p className="text-on-surface-variant mt-2">
              Masukkan detail spesifik untuk unit kamar fisik baru di properti hotel Anda.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informasi Dasar */}
            <section className="glass-panel rounded-24 p-6 md:p-8 shadow-sm border border-outline-variant/20">
              <h3 className="font-display text-xl font-bold text-primary mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary-container bg-primary p-2 rounded-xl" data-weight="fill">
                  info
                </span>
                Informasi Dasar
              </h3>

              <div className="flex flex-col gap-6">
                {/* Field: Hotel */}
                <div className="flex flex-col gap-2">
                  <label className="block text-xs font-bold tracking-wider uppercase text-on-surface-variant" htmlFor="hotel_select">
                    Pilih Hotel <span className="text-error font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="hotel_select"
                      className="w-full bg-white px-4 py-3 rounded-xl border border-outline-variant text-on-surface font-medium focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer outline-none appearance-none"
                      required
                      value={formHotelId}
                      onChange={(e) => setFormHotelId(e.target.value)}
                    >
                      <option value="" disabled>Pilih lokasi hotel...</option>
                      {hotels.map((h) => (
                        <option key={h.id} value={h.id}>{h.name}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Field: Tipe Kamar */}
                <div className="flex flex-col gap-2">
                  <label className="block text-xs font-bold tracking-wider uppercase text-on-surface-variant" htmlFor="room_type_select">
                    Pilih Tipe Kamar <span className="text-error font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="room_type_select"
                      className="w-full bg-white px-4 py-3 rounded-xl border border-outline-variant text-on-surface font-medium focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer outline-none appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      required
                      value={formRoomTypeId}
                      onChange={(e) => setFormRoomTypeId(e.target.value)}
                      disabled={!formHotelId}
                    >
                      <option value="" disabled>Pilih tipe dari katalog...</option>
                      {filteredRoomTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name} (Rp {type.price.toLocaleString('id-ID')})
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                      expand_more
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Tipe kamar menentukan harga dasar dan kapasitas standar kamar.
                  </p>
                </div>

                {/* Field: Nomor Kamar */}
                <div className="flex flex-col gap-2">
                  <label className="block text-xs font-bold tracking-wider uppercase text-on-surface-variant" htmlFor="room_number">
                    Nomor Kamar <span className="text-error font-bold">*</span>
                  </label>
                  <input
                    id="room_number"
                    className="w-full bg-white px-4 py-3 rounded-xl border border-outline-variant text-on-surface font-medium placeholder-gray-400 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="Contoh: 101, 102A"
                    type="text"
                    required
                    value={formNumber}
                    onChange={(e) => setFormNumber(e.target.value)}
                  />
                  <p className="text-xs text-on-surface-variant mt-1">
                    Gunakan format alfanumerik jika diperlukan (maks 10 karakter).
                  </p>
                </div>
              </div>
            </section>

            {/* Ketersediaan */}
            <section className="glass-panel rounded-24 p-6 md:p-8 shadow-sm border border-outline-variant/20">
              <h3 className="font-display text-xl font-bold text-primary mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary-container bg-primary p-2 rounded-xl" data-weight="fill">
                  event_available
                </span>
                Ketersediaan
              </h3>

              <div className="flex flex-col gap-2">
                <label className="block text-xs font-bold tracking-wider uppercase text-on-surface-variant" htmlFor="initial_status">
                  Status Awal <span className="text-error font-bold">*</span>
                </label>
                <div className="relative">
                  <select
                    id="initial_status"
                    className="w-full bg-white px-4 py-3 rounded-xl border border-outline-variant text-on-surface font-medium focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer outline-none appearance-none"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as Room['status'])}
                  >
                    <option value="available">Tersedia (Ready for Sale)</option>
                    <option value="maintenance">Dalam Perawatan (Maintenance)</option>
                    <option value="booked">Terisi (Occupied)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="flex flex-col-reverse md:flex-row justify-end gap-4 md:pt-4">
              <button
                type="button"
                onClick={handleResetForm}
                className="w-full md:w-auto px-8 py-3.5 rounded-full border border-primary text-primary font-bold hover:bg-primary/5 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3.5 rounded-full bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined">save</span>
                Simpan Unit Kamar
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* List View */
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold text-primary">Manajemen Unit Kamar</h2>
              <p className="text-body-md text-on-surface-variant mt-2">
                Kelola status, ketersediaan, dan detail fisik setiap unit kamar di properti Anda.
              </p>
            </div>
            <button
              onClick={() => setViewState('add')}
              className="inline-flex bg-primary text-white h-12 px-6 rounded-full font-bold items-center gap-2 hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg cursor-pointer select-none"
            >
              <span className="material-symbols-outlined">add</span>
              Tambah Kamar
            </button>
          </div>

          {/* Filters & Toolbar Bento Card */}
          <div className="glass-panel rounded-24 p-6 shadow-sm border border-outline-variant/20 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
              {/* Using global search from AdminHeader */}              {/* Filter Status select */}
              <div className="relative w-full sm:w-56">
                <select
                  className="w-full pl-4 pr-10 py-3 appearance-none rounded-xl bg-white border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary font-medium text-sm text-on-surface cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                  <option value="all">Semua Status</option>
                  <option value="available">Tersedia</option>
                  <option value="occupied">Terisi</option>
                  <option value="maintenance">Dalam Perawatan</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Sorting controller */}
            <div className="flex items-center gap-2 text-on-surface-variant text-sm w-full md:w-auto justify-end">
              <span className="material-symbols-outlined text-[20px]">sort</span>
              <span>Urutkan:</span>
              <select
                className="bg-transparent border-none font-bold text-primary focus:ring-0 cursor-pointer p-0 appearance-none pr-4 relative"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
              >
                <option value="asc">Nomor Kamar (Asc)</option>
                <option value="high">Lantai Tertinggi</option>
              </select>
              <span className="material-symbols-outlined text-primary text-sm -ml-4 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Rooms Table Card */}
          <div className="glass-panel rounded-24 shadow-sm border border-outline-variant/20 overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar-dark">
              {processedRooms.length === 0 ? (
                <div className="text-center py-16 text-on-surface-variant font-medium">
                  Tidak ada unit kamar terdaftar yang memenuhi kriteria pencarian.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant/20 bg-surface-container-low/30 text-on-surface-variant text-[11px] font-bold tracking-wider uppercase">
                      <th className="py-5 px-6 w-24">Nomor</th>
                      <th className="py-5 px-6">Tipe Kamar</th>
                      <th className="py-5 px-6">Lantai</th>
                      <th className="py-5 px-6 w-56">Status Saat Ini</th>
                      <th className="py-5 px-6 text-right w-24">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {processedRooms.map((room) => {


                      const isEditingThis = activeStatusEditNum === room.number;

                      return (
                        <tr key={room.number} className="hover:bg-surface-container-low/50 transition-colors group">
                          {/* Room Number */}
                          <td className="py-4 px-6">
                            <span className="font-display font-extrabold text-primary text-xl">{room.number}</span>
                          </td>

                          {/* Room Type info */}
                          <td className="py-4 px-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-on-surface text-sm">{room.roomTypeName}</span>
                              <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mt-0.5">
                                {room.bedType}
                              </span>
                            </div>
                          </td>

                          {/* Floor info */}
                          <td className="py-4 px-6">
                            <span className="text-sm font-semibold text-on-surface-variant">{room.floor}</span>
                          </td>

                          {/* Status and quick dropdown editor */}
                          <td className="py-4 px-6">
                            {isEditingThis ? (
                              <div className="flex items-center gap-2">
                                <select
                                  className="px-2.5 py-1 text-xs border border-outline rounded-lg bg-white font-medium text-primary cursor-pointer"
                                  value={room.status}
                                  onChange={(e) => {
                                    onUpdateRoomStatus(room.number, e.target.value as Room['status']);
                                    setActiveStatusEditNum(null);
                                  }}
                                  onBlur={() => setTimeout(() => setActiveStatusEditNum(null), 200)}
                                  autoFocus
                                >
                                  <option value="available">Tersedia</option>
                                  <option value="booked">Terisi</option>
                                  <option value="maintenance">Perawatan</option>
                                </select>
                                <button
                                  onClick={() => setActiveStatusEditNum(null)}
                                  className="text-xs text-on-surface-variant hover:text-primary cursor-pointer underline"
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <div 
                                className="flex items-center gap-2 cursor-pointer" 
                                onClick={() => setActiveStatusEditNum(room.number)}
                                title="Klik untuk mengubah status"
                              >
                                {(() => {
                                  const currentStatus = String(room.status).toUpperCase();
                                  if (currentStatus === 'OCCUPIED' || currentStatus === 'TERISI' || currentStatus === 'BOOKED') {
                                    return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">• TERISI</span>;
                                  } else if (currentStatus === 'MAINTENANCE') {
                                    return (
                                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff4d8] text-secondary text-[11px] font-bold uppercase tracking-wide">
                                        <span className="material-symbols-outlined text-[13px] font-bold">build</span>
                                        Perawatan
                                      </div>
                                    );
                                  }
                                  return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">• TERSEDIA</span>;
                                })()}
                              </div>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => setActiveStatusEditNum(isEditingThis ? null : room.number)}
                              className="p-2 text-outline hover:text-primary hover:bg-surface-container-high rounded-full transition-colors cursor-pointer"
                              title="Ubah Status"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit_square</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Table Pagination Footer */}
            <div className="border-t border-outline-variant/20 px-6 py-4 flex items-center justify-between">
              <p className="text-xs font-semibold text-on-surface-variant">
                Menampilkan 1-{processedRooms.length} dari {processedRooms.length} Kamar
              </p>
              <div className="flex items-center gap-1.5">
                <button className="p-2 rounded-xl border border-outline-variant/50 text-gray-400 bg-white" disabled>
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button className="w-9 h-9 rounded-xl bg-primary text-white font-bold flex items-center justify-center text-xs">
                  1
                </button>
                <button className="w-9 h-9 rounded-xl hover:bg-surface-container text-on-surface flex items-center justify-center transition-colors text-xs cursor-pointer">
                  2
                </button>
                <button className="p-2 rounded-xl border border-outline-variant/50 text-on-surface hover:bg-surface-container transition-colors bg-white cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
