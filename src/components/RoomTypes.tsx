import React, { useState, useMemo } from 'react';
import { RoomType, Room } from './types';

interface RoomTypesProps {
  roomTypes: RoomType[];
  rooms: Room[];
  onAddRoomType: (newType: RoomType) => void;
  onDeleteRoomType: (id: string) => void;
}

export default function RoomTypes({
  roomTypes,
  rooms,
  onAddRoomType,
  onDeleteRoomType,
}: RoomTypesProps) {
  const [viewState, setViewState] = useState<'list' | 'add'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  // Form Fields State
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState<number | ''>('');
  const [formCapacity, setFormCapacity] = useState<number>(2);
  const [formSize, setFormSize] = useState<number | ''>('');
  const [formBedType, setFormBedType] = useState('1 King Bed');
  const [formFacilities, setFormFacilities] = useState<string[]>(['wifi', 'ac']);
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');

  // Simple hardcoded fallback image options for simplicity and high performance
  const preloadedImages = [
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=400&q=80',
  ];

  // Pick random image from list for new additions if none specified
  const getPlaceholderImage = () => {
    return preloadedImages[Math.floor(Math.random() * preloadedImages.length)];
  };

  // Facilities definitions
  const facilityOptions = [
    { id: 'wifi', label: 'Free WiFi', icon: 'wifi' },
    { id: 'tv', label: 'Smart TV', icon: 'tv' },
    { id: 'ac', label: 'AC', icon: 'ac_unit' },
    { id: 'bathtub', label: 'Bathtub', icon: 'bathtub' },
    { id: 'minibar', label: 'Mini Bar', icon: 'kitchen' },
    { id: 'safe', label: 'Brankas', icon: 'lock' },
    { id: 'view', label: 'Balkon / View', icon: 'balcony' },
    { id: 'coffee', label: 'Coffee Maker', icon: 'coffee_maker' },
  ];

  const handleFacilityToggle = (id: string) => {
    if (formFacilities.includes(id)) {
      setFormFacilities(formFacilities.filter((f) => f !== id));
    } else {
      setFormFacilities([...formFacilities, id]);
    }
  };

  const handleResetForm = () => {
    setFormName('');
    setFormPrice('');
    setFormCapacity(2);
    setFormSize('');
    setFormBedType('1 King Bed');
    setFormFacilities(['wifi', 'ac']);
    setFormDescription('');
    setFormImage('');
    setViewState('list');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice) {
      alert('Mohon isi kolom wajib (*) terlebih dahulu.');
      return;
    }

    const newRoomType: RoomType = {
      id: 'rt-' + Date.now(),
      name: formName,
      unitsAvailable: 10, // Default allocation
      price: Number(formPrice),
      capacity: `${formCapacity} Dewasa`,
      capacityNum: formCapacity,
      size: formSize ? Number(formSize) : 32,
      bedType: formBedType,
      facilities: formFacilities,
      imageUrl: formImage || getPlaceholderImage(),
      description: formDescription || 'Kamar nyaman terkonfigurasi dengan fasilitas unggulan.',
    };

    onAddRoomType(newRoomType);
    handleResetForm();
  };

  // Filtered room types list
  const filteredRoomTypes = useMemo(() => {
    return roomTypes.filter((type) =>
      type.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [roomTypes, searchQuery]);

  // Total rooms counts derived dynamically
  const totalAllocatedRooms = rooms.length; // standard fallback
  
  // Let's format money in Indonesian Rupiah
  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Get Facility icon
  const getFacilityIcon = (facilityId: string) => {
    const found = facilityOptions.find((o) => o.id === facilityId);
    return found ? found.icon : 'star';
  };

  const getFacilityLabel = (facilityId: string) => {
    const found = facilityOptions.find((o) => o.id === facilityId);
    return found ? found.label : facilityId;
  };

  if (viewState === 'add') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-24 select-none">
        {/* Navigation Breadcrumb */}
        <div>
          <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-2">
            <button
              onClick={() => setViewState('list')}
              className="hover:text-primary transition-colors cursor-pointer font-medium"
            >
              Room Types
            </button>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-on-surface font-bold">Tambah Tipe Kamar</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-primary">Tambah Tipe Kamar</h2>
          <p className="text-on-surface-variant mt-2">
            Buat konfigurasi tipe kamar baru untuk properti hotel Anda.
          </p>
        </div>

        {/* Add Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section: Basic Info */}
          <section className="glass-panel rounded-24 p-6 md:p-8 shadow-sm border border-outline-variant/20">
            <h3 className="font-display text-xl font-bold text-primary mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary-container bg-primary p-2 rounded-xl" data-weight="fill">
                info
              </span>
              Informasi Dasar
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama Tipe Kamar */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-bold tracking-wider uppercase text-on-surface-variant mb-2" htmlFor="room_name">
                  Nama Tipe Kamar <span className="text-error font-bold">*</span>
                </label>
                <input
                  id="room_name"
                  className="w-full bg-white px-4 py-3 rounded-xl border border-outline-variant text-on-surface font-medium placeholder-gray-400 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  placeholder="Contoh: Deluxe Suite, Superior Room"
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>

              {/* Harga Per Malam */}
              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-on-surface-variant mb-2" htmlFor="price">
                  Harga Per Malam (Rp) <span className="text-error font-bold">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant select-none">
                    Rp
                  </span>
                  <input
                    id="price"
                    className="w-full bg-white pl-12 pr-4 py-3 rounded-xl border border-outline-variant text-primary font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="850.000"
                    type="number"
                    min="0"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Kapasitas */}
              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-on-surface-variant mb-2" htmlFor="capacity">
                  Kapasitas (Orang) <span className="text-error font-bold">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">
                    person
                  </span>
                  <input
                    id="capacity"
                    className="w-full bg-white pl-12 pr-4 py-3 rounded-xl border border-outline-variant text-on-surface font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Ukuran Kamar */}
              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-on-surface-variant mb-2" htmlFor="size">
                  Ukuran Kamar (m²)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">
                    square_foot
                  </span>
                  <input
                    id="size"
                    className="w-full bg-white pl-12 pr-4 py-3 rounded-xl border border-outline-variant text-on-surface font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="32"
                    type="number"
                    min="1"
                    value={formSize}
                    onChange={(e) => setFormSize(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Tipe Tempat Tidur */}
              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-on-surface-variant mb-2" htmlFor="bed_type">
                  Tipe Tempat Tidur
                </label>
                <div className="relative">
                  <select
                    id="bed_type"
                    className="w-full bg-white px-4 py-3 rounded-xl border border-outline-variant text-on-surface font-medium focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer outline-none appearance-none"
                    value={formBedType}
                    onChange={(e) => setFormBedType(e.target.value)}
                  >
                    <option value="1 King Bed">1 King Bed</option>
                    <option value="1 Queen Bed">1 Queen Bed</option>
                    <option value="2 Twin Beds">2 Twin Beds</option>
                    <option value="1 Double Bed">1 Double Bed</option>
                    <option value="1 King Bed & Sofa Bed">1 King Bed &amp; Sofa Bed</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Facilities */}
          <section className="glass-panel rounded-24 p-6 md:p-8 shadow-sm border border-outline-variant/20">
            <h3 className="font-display text-xl font-bold text-primary mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary-container bg-primary p-2 rounded-xl" data-weight="fill">
                chair
              </span>
              Fasilitas Kamar
            </h3>
            <p className="text-sm text-on-surface-variant mb-6">Pilih fasilitas dasar yang tersedia untuk kategori tipe kamar ini.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {facilityOptions.map((option) => {
                const isChecked = formFacilities.includes(option.id);
                return (
                  <label key={option.id} className="cursor-pointer group relative block select-none">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isChecked}
                      onChange={() => handleFacilityToggle(option.id)}
                    />
                    <div className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 h-28 text-center ${
                      isChecked
                        ? 'bg-primary border-primary text-white shadow-sm'
                        : 'bg-white border-outline-variant/60 hover:border-primary text-on-surface'
                    }`}>
                      <span className={`material-symbols-outlined text-3xl mb-2 transition-colors ${
                        isChecked ? 'text-white' : 'text-on-surface-variant group-hover:text-primary'
                      }`}>
                        {option.icon}
                      </span>
                      <span className={`text-[11px] font-bold tracking-wider uppercase ${
                        isChecked ? 'text-white' : 'text-on-surface'
                      }`}>
                        {option.label}
                      </span>
                    </div>
                    {isChecked && (
                      <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[13px] text-white font-bold">check</span>
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
          </section>

          {/* Section: Custom Image URL */}
          <section className="glass-panel rounded-24 p-6 md:p-8 shadow-sm border border-outline-variant/20">
            <h3 className="font-display text-xl font-bold text-primary mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary-container bg-primary p-2 rounded-xl" data-weight="fill">
                image
              </span>
              Foto Kamar
            </h3>
            
            <div className="space-y-4">
              <label className="block text-xs font-bold tracking-wider uppercase text-on-surface-variant" htmlFor="img_url">
                Tautan Gambar Foto Kamar (Opsional)
              </label>
              <input
                id="img_url"
                className="w-full bg-white px-4 py-3 rounded-xl border border-outline-variant text-on-surface font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="Masukkan URL foto (atau kosongkan untuk menggunakan gambar template otomatis)"
                type="text"
                value={formImage}
                onChange={(e) => setFormImage(e.target.value)}
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {preloadedImages.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setFormImage(img)}
                    className={`relative rounded-xl overflow-hidden aspect-video bg-surface-container-high border cursor-pointer group transition-all ${
                      formImage === img ? 'ring-2 ring-primary scale-[1.02]' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`Template ${i}`} />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section: Description */}
          <section className="glass-panel rounded-24 p-6 md:p-8 shadow-sm border border-outline-variant/20">
            <h3 className="font-display text-xl font-bold text-primary mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary-container bg-primary p-2 rounded-xl" data-weight="fill">
                description
              </span>
              Deskripsi
            </h3>
            <div>
              <label className="block text-xs font-bold tracking-wider uppercase text-on-surface-variant mb-2" htmlFor="description">
                Deskripsi Lengkap
              </label>
              <textarea
                id="description"
                className="w-full bg-white px-4 py-3 rounded-xl border border-outline-variant text-on-surface font-medium focus:ring-2 focus:ring-primary/20 transition-all resize-y outline-none"
                placeholder="Jelaskan kenyamanan, pemandangan, dan suasana istimewa tipe kamar ini..."
                rows={5}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>
          </section>

          {/* Form Actions */}
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
              Simpan Tipe Kamar
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-primary">Manajemen Tipe Kamar</h2>
          <p className="text-body-lg text-on-surface-variant mt-1">
            Kelola kategori kamar, fasilitas, dan harga per malam.
          </p>
        </div>
        <button
          onClick={() => setViewState('add')}
          className="inline-flex items-center justify-center bg-primary text-white h-12 px-6 rounded-full font-bold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg whitespace-nowrap gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Tambah Tipe Kamar
        </button>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-24 p-6 shadow-sm border border-outline-variant/20 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary shadow-inner">
            <span className="material-symbols-outlined">category</span>
          </div>
          <div>
            <p className="text-on-surface-variant text-[10px] font-bold tracking-wider uppercase mb-0.5">Total Tipe</p>
            <p className="font-display text-2xl font-bold text-primary">{roomTypes.length} Kategori</p>
          </div>
        </div>

        <div className="bg-white rounded-24 p-6 shadow-sm border border-outline-variant/20 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shadow-inner">
            <span className="material-symbols-outlined">bed</span>
          </div>
          <div>
            <p className="text-on-surface-variant text-[10px] font-bold tracking-wider uppercase mb-0.5">Total Kamar Terdaftar</p>
            <p className="font-display text-2xl font-bold text-primary">
              {totalAllocatedRooms} Unit Fisik
            </p>
          </div>
        </div>

        <div className="bg-white rounded-24 p-6 shadow-sm border border-outline-variant/20 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed shadow-inner">
            <span className="material-symbols-outlined">trending_up</span>
          </div>
          <div>
            <p className="text-on-surface-variant text-[10px] font-bold tracking-wider uppercase mb-0.5">Tipe Terpopuler</p>
            <p className="font-display text-2xl font-bold text-primary">Deluxe Suite</p>
          </div>
        </div>
      </div>

      {/* Table Card Container */}
      <div className="bg-white rounded-24 shadow-sm border border-outline-variant/20 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface/50">
          <div className="relative w-full sm:w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
            <input
              className="w-full h-12 pl-12 pr-4 bg-white border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm"
              placeholder="Cari tipe kamar..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 text-on-surface hover:text-primary transition-colors border border-outline-variant/50 rounded-xl bg-white font-bold text-sm cursor-pointer shadow-sm">
            <span className="material-symbols-outlined text-[20px]">filter_list</span>
            Filter
          </button>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          {filteredRoomTypes.length === 0 ? (
            <div className="text-center py-16 text-on-surface-variant font-medium">
              Tidak ada tipe kamar yang cocok dengan pencarian Anda.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-[11px] font-bold tracking-wider uppercase border-b border-outline-variant/20">
                  <th className="p-6 w-1/3">Tipe Kamar</th>
                  <th className="p-6">Fasilitas Utama</th>
                  <th className="p-6 w-32">Kapasitas</th>
                  <th className="p-6 w-48 text-right">Harga / Malam</th>
                  <th className="p-6 w-28 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filteredRoomTypes.map((type) => (
                  <tr key={type.id} className="hover:bg-surface-bright transition-colors group">
                    {/* Tipe Kamar Name & Image */}
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 bg-surface-container rounded-lg overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                          <img
                            alt={type.name}
                            className="w-full h-full object-cover select-none"
                            src={type.imageUrl}
                          />
                        </div>
                        <div>
                          <p className="font-display font-bold text-primary text-[16px]">{type.name}</p>
                          <p className="text-on-surface-variant text-xs mt-0.5">{type.unitsAvailable} Unit Tersedia</p>
                        </div>
                      </div>
                    </td>

                    {/* Amenities / Facilities */}
                    <td className="p-6">
                      <div className="flex flex-wrap gap-1.5 max-w-[280px]">
                        {type.facilities.slice(0, 4).map((f) => (
                          <span
                            key={f}
                            className="px-2.5 py-1 bg-surface-container-low rounded-full text-[11px] text-on-surface-variant flex items-center gap-1 font-semibold"
                          >
                            <span className="material-symbols-outlined text-[13px]">{getFacilityIcon(f)}</span>
                            {getFacilityLabel(f)}
                          </span>
                        ))}
                        {type.facilities.length > 4 && (
                          <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold">
                            +{type.facilities.length - 4} Lainnya
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Capacity */}
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-on-surface-variant text-sm font-semibold">
                        <span className="material-symbols-outlined text-[18px]">person</span>
                        <span>{type.capacity}</span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-6 text-right">
                      <p className="font-mono font-bold text-[16px] text-[#00a858]">{formatRupiah(type.price)}</p>
                    </td>

                    {/* Actions */}
                    <td className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setFormName(type.name);
                            setFormPrice(type.price);
                            setFormCapacity(type.capacityNum);
                            setFormSize(type.size);
                            setFormBedType(type.bedType);
                            setFormFacilities(type.facilities);
                            setFormDescription(type.description);
                            setFormImage(type.imageUrl);
                            setViewState('add');
                          }}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => onDeleteRoomType(type.id)}
                          className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Table Footer / Pagination */}
        <div className="p-6 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between text-on-surface-variant bg-surface/30 gap-4">
          <span className="text-xs font-semibold">
            Menampilkan 1-{filteredRoomTypes.length} dari {filteredRoomTypes.length} tipe kamar
          </span>
          <div className="flex gap-1.5">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center border border-outline-variant/50 text-gray-400 bg-white" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary text-white font-bold shadow-sm text-xs">
              1
            </button>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center border border-outline-variant/50 hover:bg-surface-container transition-colors text-on-surface bg-white text-xs cursor-pointer">
              2
            </button>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center border border-outline-variant/50 hover:bg-surface-container transition-colors text-on-surface bg-white text-xs cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
