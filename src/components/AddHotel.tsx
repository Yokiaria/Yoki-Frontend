import React, { useState } from 'react';
import { apiClient } from '../api/apiClient';

interface AddHotelProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: any;
}

export default function AddHotel({ onSuccess, onCancel, initialData }: AddHotelProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    location: initialData?.location || '',
    city: initialData?.city || '',
    description: initialData?.description || '',
    stars: initialData?.stars || 3,
    rating: initialData?.rating || 4.5,
    pricePerNight: initialData?.pricePerNight || 0,
    images: initialData?.images ? initialData.images.map((img: any) => typeof img === 'string' ? img : img.imageUrl).join(', ') : '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'stars' || name === 'rating' || name === 'pricePerNight' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Process comma-separated images
    const imagesArray = formData.images
      .split(',')
      .map((url: string) => url.trim())
      .filter((url: string) => url.length > 0);

    const payload = {
      ...formData,
      stars: Number(formData.stars),
      rating: Number(formData.rating),
      pricePerNight: Number(formData.pricePerNight),
      images: imagesArray,
      thumbnailUrl: imagesArray.length > 0 ? imagesArray[0] : undefined,
    };

    try {
      if (initialData?.id) {
        await apiClient.put(`/hotels/${initialData.id}`, payload);
      } else {
        await apiClient.post('/hotels', payload);
      }
      onSuccess();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Gagal menyimpan hotel baru.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {initialData ? 'Ubah Hotel' : 'Tambah Hotel Baru'}
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="add-hotel-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Hotel *</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                  placeholder="Contoh: Grand Star Resort"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Kota *</label>
                <input
                  required
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                  placeholder="Contoh: Bali"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Lokasi Lengkap *</label>
              <input
                required
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                placeholder="Alamat lengkap hotel"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Deskripsi</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white resize-none"
                placeholder="Penjelasan singkat mengenai hotel ini"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Bintang *</label>
                <select
                  name="stars"
                  value={formData.stars}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                >
                  <option value={1}>1 Bintang</option>
                  <option value={2}>2 Bintang</option>
                  <option value={3}>3 Bintang</option>
                  <option value={4}>4 Bintang</option>
                  <option value={5}>5 Bintang</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Rating Awal</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Harga per Malam (Rp) *</label>
                <input
                  required
                  type="number"
                  min="0"
                  name="pricePerNight"
                  value={formData.pricePerNight}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">URL Gambar (pisahkan dengan koma)</label>
              <textarea
                name="images"
                value={formData.images}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white resize-none"
                placeholder="https://image1.com/img.jpg, https://image2.com/img.jpg"
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700 transition-all"
          >
            Batal
          </button>
          <button
            form="add-hotel-form"
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl font-semibold text-white bg-primary-600 hover:bg-primary-700 border border-transparent shadow-sm disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {loading && <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>}
            {initialData ? 'Simpan Perubahan' : 'Simpan Hotel'}
          </button>
        </div>
      </div>
    </div>
  );
}
