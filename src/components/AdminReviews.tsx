import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';
import { Star, Trash2 } from 'lucide-react';

interface Review {
  id: string;
  rating?: number;
  ratingKebersihan?: number;
  ratingPelayanan?: number;
  ratingLokasi?: number;
  ratingFasilitas?: number;
  comment?: string;
  komentar?: string;
  createdAt: string;
  bookingId?: string;
  booking?: {
    id: string;
  };
  userName?: string;
  user?: {
    name?: string;
    namaLengkap?: string;
  };
  guestName?: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res: any = await apiClient.get('/reviews');
      // apiClient sudah parse JSON, res langsung berupa array
      const dataArray = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
      setReviews(dataArray);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus ulasan ini?')) return;
    try {
      await apiClient.delete(`/reviews/${id}`);
      setReviews(prev => prev.filter(r => r.id !== id));
      alert('Ulasan berhasil dihapus.');
    } catch (error: any) {
      console.error('Gagal menghapus ulasan:', error);
      alert(error.response?.data?.message || 'Gagal menghapus ulasan.');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Memuat data ulasan...</div>;
  }


  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Manajemen Ulasan</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-gray-50/50">
            <tr>
              <th className="px-4 py-3 font-medium">ID Reservasi</th>
              <th className="px-4 py-3 font-medium">Nama Tamu</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Komentar</th>
              <th className="px-4 py-3 font-medium">Tanggal Masuk</th>
              <th className="px-4 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500 italic">
                  Belum ada ulasan yang masuk.
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-4 py-3 font-medium text-gray-900 font-mono text-sm">
                    {review.bookingId || review.booking?.id || '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {review.userName || review.user?.name || review.user?.namaLengkap || review.guestName || 'Anonim'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <div className="flex items-center gap-1">
                      {(() => {
                        const avg = review.rating ?? Math.round((Number(review.ratingKebersihan||0) + Number(review.ratingPelayanan||0) + Number(review.ratingLokasi||0) + Number(review.ratingFasilitas||0)) / 4);
                        return (
                          <>
                            <span className="font-bold text-gray-800">{avg}</span>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < avg ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
                            ))}
                          </>
                        );
                      })()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={review.comment || review.komentar}>
                    {review.comment || review.komentar}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                      title="Hapus Ulasan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
