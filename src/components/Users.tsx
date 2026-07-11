import React, { useState, useMemo } from 'react';
import { User } from './types';

interface UsersProps {
  users: User[];
  onToggleUserBlock: (id: string) => void;
  searchQuery: string;
}

export default function Users({ users, onToggleUserBlock, searchQuery }: UsersProps) {

  // Let's format money in Indonesian Rupiah
  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const filteredUsers = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  return (
    <div className="space-y-8 animate-fade-in pb-12 select-none">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-primary">Manajemen Pengguna</h2>
          <p className="text-body-lg text-on-surface-variant mt-1">
            Kelola akses, saldo, dan poin pelanggan eksklusif hotel Anda.
          </p>
        </div>
      </div>

      {/* Toolbar Search bar */}
      <div className="glass-panel p-4 rounded-24 shadow-sm border border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
        </div>
        <div className="text-xs font-semibold text-on-surface-variant">
          Total Pengguna Terdaftar: {users.length} member
        </div>
      </div>

      {/* Users Data Table Card */}
      <div className="bg-white rounded-24 border border-outline-variant/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-16 text-center text-on-surface-variant font-medium">
              Tidak ada pengguna yang cocok dengan kriteria pencarian.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50 text-on-surface-variant text-[11px] font-bold tracking-wider uppercase border-b border-outline-variant/20">
                  <th className="py-5 px-6">Pengguna</th>
                  <th className="py-5 px-6">Email &amp; Kontak</th>
                  <th className="py-5 px-6 text-right">Saldo GrandWallet</th>
                  <th className="py-5 px-6 text-right">Total GrandPoin</th>
                  <th className="py-5 px-6 text-center">Status</th>
                  <th className="py-5 px-6 text-center w-36">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-sm font-medium">
                {filteredUsers.map((user) => {
                  const isBlocked = user.status === 'diblokir';

                  return (
                    <tr
                      key={user.email}
                      className="hover:bg-surface-bright transition-colors group"
                    >
                      {/* Avatar & Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-extrabold text-xs shadow-inner">
                            {user.initials}
                          </div>
                          <span className="font-bold text-primary">{user.name}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-6 text-on-surface-variant">{user.email}</td>

                      {/* Wallet Balance */}
                      <td className="py-4 px-6 text-right font-mono font-bold text-primary">
                        {formatRupiah(user.balance)}
                      </td>

                      {/* Points Balance */}
                      <td className="py-4 px-6 text-right">
                        <div className="text-secondary font-bold flex items-center justify-end gap-1">
                          {user.points.toLocaleString('id-ID')}
                          <span className="material-symbols-outlined text-sm" data-weight="fill">
                            stars
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 text-center">
                        {isBlocked ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-error-container text-on-error-container text-xs font-bold uppercase tracking-wider">
                            Diblokir
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                            Aktif
                          </span>
                        )}
                      </td>

                      {/* Toggle Block Action button */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => onToggleUserBlock(user.id)}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 ${
                            isBlocked
                              ? 'bg-primary text-white hover:bg-primary/90'
                              : 'border border-primary text-primary hover:bg-primary/5'
                          }`}
                        >
                          {isBlocked ? 'Buka Blokir' : 'Blokir'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="bg-surface-container-low/30 border-t border-outline-variant/20 px-6 py-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface-variant">
            Menampilkan 1-{filteredUsers.length} dari {filteredUsers.length} member terdaftar
          </span>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded-full border border-outline-variant/30 flex items-center justify-center text-outline hover:bg-surface-container transition-colors disabled:opacity-50" disabled>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                chevron_left
              </span>
            </button>
            <button className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-sm">
              1
            </button>
            <button className="w-8 h-8 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors text-xs font-medium cursor-pointer">
              2
            </button>
            <button className="w-8 h-8 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors text-xs font-medium cursor-pointer">
              3
            </button>
            <span className="text-on-surface-variant px-1 font-bold text-xs select-none">...</span>
            <button className="w-8 h-8 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
