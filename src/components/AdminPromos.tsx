import React, { useState, useEffect } from 'react';
import { Promo } from '../types';
import { apiClient } from '../api/apiClient';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';

export default function AdminPromos() {
    const [promos, setPromos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        code: '',
        title: '',
        category: 'flash_sale',
        discountType: 'percentage',
        discountValue: 0,
        expiryDate: '',
        description: '',
        isActive: true,
    });

    const fetchPromos = async () => {
        setIsLoading(true);
        try {
            const data = await apiClient.get<any[]>('/promos/admin');
            setPromos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Gagal mengambil data promo admin:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPromos();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.post('/promos', {
                ...formData,
                discountValue: Number(formData.discountValue),
            });
            setIsModalOpen(false);
            setFormData({
                code: '',
                title: '',
                category: 'flash_sale',
                discountType: 'percentage',
                discountValue: 0,
                expiryDate: '',
                description: '',
                isActive: true,
            });
            fetchPromos(); // Refresh table
        } catch (error) {
            console.error("Gagal menyimpan promo:", error);
            alert("Gagal menyimpan promo. Coba lagi.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus promo ini?")) return;
        try {
            await apiClient.delete(`/promos/${id}`);
            fetchPromos();
        } catch (error) {
            console.error("Gagal menghapus promo:", error);
        }
    };

    const filteredPromos = promos.filter(p => 
        (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.code || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="font-display text-2xl font-bold text-[#031636] dark:text-white uppercase tracking-tight">Manajemen Promo</h2>
                    <p className="font-body-md text-sm text-gray-500 dark:text-gray-400">Atur kode promosi dan diskon untuk pelanggan.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#031636] hover:bg-[#1a2b4c] dark:bg-[#fed023] dark:hover:bg-[#eec209] text-white dark:text-[#031636] px-5 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 active:scale-95 shadow-md"
                >
                    <Plus className="w-4 h-4" /> Tambah Promo
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-h2 text-lg font-bold text-gray-800 dark:text-white">Daftar Promo Aktif</h3>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari promo..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-full text-sm bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-[#031636] dark:focus:border-[#fed023] w-64 transition-colors"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                                <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kode</th>
                                <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Judul Promo</th>
                                <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kategori</th>
                                <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nilai Diskon</th>
                                <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valid Sampai</th>
                                <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-400">Memuat data...</td>
                                </tr>
                            ) : filteredPromos.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-400">Tidak ada promo ditemukan.</td>
                                </tr>
                            ) : (
                                filteredPromos.map((promo) => (
                                    <tr key={promo.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="p-4">
                                            <span className="font-mono text-sm font-bold text-[#031636] dark:text-[#fed023] bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                                                {promo.code}
                                            </span>
                                        </td>
                                        <td className="p-4 font-semibold text-gray-800 dark:text-white text-sm">{promo.title}</td>
                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-300 uppercase text-[11px] tracking-wider font-bold">{promo.category.replace('_', ' ')}</td>
                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                                            {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `Rp ${promo.discountValue.toLocaleString('id-ID')}`}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{promo.expiryDate || 'Tanpa Batas'}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleDelete(promo.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors cursor-pointer" title="Hapus">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Tambah Promo */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-up">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-h2 text-lg font-bold text-gray-800 dark:text-white">Tambah Promo Baru</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Judul Promo</label>
                                    <input 
                                        required type="text" 
                                        value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#031636] dark:focus:ring-[#fed023]/50 transition-all"
                                        placeholder="Contoh: Diskon Liburan Lebaran"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Kode Promo</label>
                                    <input 
                                        required type="text" 
                                        value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 font-mono font-bold text-[#00a858] focus:outline-none focus:ring-2 focus:ring-[#031636] dark:focus:ring-[#fed023]/50 transition-all uppercase"
                                        placeholder="LEBARAN2024"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Kategori</label>
                                    <select 
                                        value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#031636] dark:focus:ring-[#fed023]/50 transition-all"
                                    >
                                        <option value="flash_sale">Flash Sale</option>
                                        <option value="tiket_pesawat">Tiket Pesawat</option>
                                        <option value="spa">Spa</option>
                                        <option value="transfer">Transfer</option>
                                        <option value="staycation">Staycation</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Tipe Diskon</label>
                                    <select 
                                        value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#031636] dark:focus:ring-[#fed023]/50 transition-all"
                                    >
                                        <option value="percentage">Persentase (%)</option>
                                        <option value="fixed">Nominal (Rp)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Nilai Diskon</label>
                                    <input 
                                        required type="number" min="0" 
                                        value={formData.discountValue} onChange={e => setFormData({...formData, discountValue: Number(e.target.value)})}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#031636] dark:focus:ring-[#fed023]/50 transition-all"
                                        placeholder={formData.discountType === 'percentage' ? "Contoh: 15" : "Contoh: 50000"}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Berlaku Sampai</label>
                                    <input 
                                        required type="date" 
                                        value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#031636] dark:focus:ring-[#fed023]/50 transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-full font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Batal</button>
                                <button type="submit" className="bg-[#031636] hover:bg-[#1a2b4c] dark:bg-[#fed023] dark:hover:bg-[#eec209] text-white dark:text-[#031636] px-6 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all active:scale-95">Simpan Promo</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
