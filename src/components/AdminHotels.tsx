import React, { useState } from 'react';
import AddHotel from './AddHotel';

interface AdminHotelsProps {
  hotels: any[];
  onRefresh: () => void;
}

export default function AdminHotels({ hotels, onRefresh }: AdminHotelsProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState<any>(null);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Manajemen Hotel</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola data properti hotel yang tersedia</p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Tambah Hotel
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hotel</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Lokasi</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bintang</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Harga/Malam</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {hotels.map((hotel) => (
                <tr key={hotel.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {hotel.thumbnailUrl ? (
                        <img src={hotel.thumbnailUrl} alt={hotel.name} className="w-12 h-12 rounded-xl object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                          <span className="material-symbols-outlined">apartment</span>
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100">{hotel.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{hotel.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 max-w-[200px]">
                      {hotel.location}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-[#f59e0b]">
                      <span className="material-symbols-outlined text-sm font-fill">star</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{hotel.stars}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Rp {Number(hotel.pricePerNight).toLocaleString('id-ID')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setEditingHotel(hotel)}
                      className="text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors p-2"
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  </td>
                </tr>
              ))}
              
              {hotels.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-4xl mb-3 opacity-50">apartment</span>
                    <p>Belum ada data hotel.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(showAddModal || editingHotel) && (
        <AddHotel
          initialData={editingHotel}
          onSuccess={() => {
            setShowAddModal(false);
            setEditingHotel(null);
            onRefresh();
          }}
          onCancel={() => {
            setShowAddModal(false);
            setEditingHotel(null);
          }}
        />
      )}
    </div>
  );
}
