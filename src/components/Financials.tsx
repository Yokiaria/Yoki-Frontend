import React, { useState, useMemo } from 'react';
import { Transaction } from './types';

interface FinancialsProps {
  transactions: Transaction[];
}

export default function Financials({ transactions }: FinancialsProps) {
  const [dateFilter, setDateFilter] = useState<'harian' | 'mingguan' | 'bulanan'>('mingguan');
  const [exportingType, setExportingType] = useState<string | null>(null);

  // Dynamic values depending on selected Date Filter
  const financialSummary = useMemo(() => {
    switch (dateFilter) {
      case 'harian':
        return {
          revenue: 124500000,
          growth: '+4.2% vs kemarin',
          transactionsCount: 84,
          successRate: '100% tingkat keberhasilan'
        };
      case 'bulanan':
        return {
          revenue: 1850000000,
          growth: '+18.7% vs bulan lalu',
          transactionsCount: 5410,
          successRate: '99.2% tingkat keberhasilan'
        };
      case 'mingguan':
      default:
        return {
          revenue: 425500000,
          growth: '+12.5% vs minggu lalu',
          transactionsCount: 1248,
          successRate: '98% tingkat keberhasilan'
        };
    }
  }, [dateFilter]);

  // Handle export trigger feedback animation
  const handleExport = (type: 'Excel' | 'PDF') => {
    setExportingType(type);
    setTimeout(() => {
      setExportingType(null);
      alert(`Laporan Keuangan berhasil diekspor sebagai dokumen ${type}!`);
    }, 1500);
  };

  // Let's format money in Indonesian Rupiah
  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Dynamic values for bar chart heights based on active filter
  const barHeights = useMemo(() => {
    if (dateFilter === 'harian') {
      return [
        { day: '08:00', val: '20M', heightClass: 'h-[20%]' },
        { day: '10:00', val: '45M', heightClass: 'h-[45%]' },
        { day: '12:00', val: '90M', heightClass: 'h-[90%]' },
        { day: '14:00', val: '65M', heightClass: 'h-[65%]' },
        { day: '16:00', val: '30M', heightClass: 'h-[30%]' },
        { day: '18:00', val: '55M', heightClass: 'h-[55%]' },
        { day: '20:00', val: '10M', heightClass: 'h-[10%]' },
      ];
    } else if (dateFilter === 'bulanan') {
      return [
        { day: 'Jan', val: '350M', heightClass: 'h-[35%]' },
        { day: 'Feb', val: '420M', heightClass: 'h-[42%]' },
        { day: 'Mar', val: '580M', heightClass: 'h-[58%]' },
        { day: 'Apr', val: '610M', heightClass: 'h-[61%]' },
        { day: 'Mei', val: '790M', heightClass: 'h-[79%]' },
        { day: 'Jun', val: '950M', heightClass: 'h-[95%]' },
        { day: 'Jul', val: '880M', heightClass: 'h-[88%]' },
      ];
    } else {
      // Mingguan
      return [
        { day: 'Sen', val: '30M', heightClass: 'h-[30%]' },
        { day: 'Sel', val: '45M', heightClass: 'h-[45%]' },
        { day: 'Rab', val: '60M', heightClass: 'h-[60%]' },
        { day: 'Kam', val: '40M', heightClass: 'h-[40%]' },
        { day: 'Jum', val: '80M', heightClass: 'h-[80%]' },
        { day: 'Sab', val: '95M', heightClass: 'h-[95%]', highlight: true },
        { day: 'Min', val: '75M', heightClass: 'h-[75%]' },
      ];
    }
  }, [dateFilter]);

  return (
    <div className="space-y-8 animate-fade-in pb-12 select-none">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold text-primary">Laporan Keuangan</h2>
          <p className="text-body-lg text-on-surface-variant mt-1">
            Ringkasan transaksi pendapatan, performa finansial, dan audit log.
          </p>
        </div>

        {/* Filters and Exports */}
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          {/* Date range selection filter */}
          <div className="glass-panel flex p-1 rounded-xl border border-outline-variant/20 shadow-sm w-full sm:w-auto">
            <button
              onClick={() => setDateFilter('harian')}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold tracking-wider uppercase rounded-lg transition-all cursor-pointer ${
                dateFilter === 'harian'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/50'
              }`}
            >
              Harian
            </button>
            <button
              onClick={() => setDateFilter('mingguan')}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold tracking-wider uppercase rounded-lg transition-all cursor-pointer ${
                dateFilter === 'mingguan'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/50'
              }`}
            >
              Mingguan
            </button>
            <button
              onClick={() => setDateFilter('bulanan')}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold tracking-wider uppercase rounded-lg transition-all cursor-pointer ${
                dateFilter === 'bulanan'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/50'
              }`}
            >
              Bulanan
            </button>
          </div>

          {/* Export triggers */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => handleExport('Excel')}
              className="bg-primary text-white h-11 px-4 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-primary/90 transition-all shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">description</span>
              Excel
            </button>
            <button
              onClick={() => handleExport('PDF')}
              className="bg-primary text-white h-11 px-4 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-primary/90 transition-all shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Export Loader Overlay */}
      {exportingType && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4 border border-outline-variant/30">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="font-bold text-primary text-sm">Sedang mengekspor sebagai dokumen {exportingType}...</p>
          </div>
        </div>
      )}

      {/* Bento Grid Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Total Revenue Highlight Card */}
        <div className="col-span-1 md:col-span-7 glass-panel rounded-xl p-8 flex flex-col justify-between border border-outline-variant/20 shadow-sm relative overflow-hidden group bg-gradient-to-br from-white to-secondary-container/5 select-none">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-on-surface-variant mb-3">
              <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                Total Pendapatan ({dateFilter})
              </span>
            </div>
            <div className="font-display text-4xl font-extrabold text-primary transition-all">
              {formatRupiah(financialSummary.revenue)}
            </div>
            <div className="flex items-center gap-1.5 mt-3.5 text-on-tertiary-container bg-[#e2f9ec] inline-flex px-3 py-1.5 rounded-full select-none">
              <span className="material-symbols-outlined text-xs font-bold">trending_up</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">{financialSummary.growth}</span>
            </div>
          </div>

          {/* Sparkline miniature bars */}
          <div className="h-14 mt-8 flex items-end gap-1.5 w-full relative z-10 select-none">
            {[35, 50, 45, 60, 55, 80, 75, 90, 85, 100].map((val, idx) => (
              <div
                key={idx}
                className="w-full bg-primary/15 rounded-t-sm transition-all duration-500 hover:bg-primary/40 cursor-pointer"
                style={{ height: `${val}%` }}
                title={`M${idx+1}: ${val}%`}
              />
            ))}
          </div>
        </div>

        {/* Transaction Volume Card */}
        <div className="col-span-1 md:col-span-5 glass-panel rounded-xl p-8 flex flex-col justify-center border border-outline-variant/20 shadow-sm relative overflow-hidden bg-white select-none">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-on-surface-variant mb-4">
              <span className="material-symbols-outlined text-xl">receipt_long</span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                Volume Transaksi
              </span>
            </div>
            <div className="font-display text-4xl font-extrabold text-primary leading-tight">
              {financialSummary.transactionsCount.toLocaleString('id-ID')}{' '}
              <span className="text-sm font-normal text-on-surface-variant block mt-1">transaksi sukses diarsip</span>
            </div>
            <p className="text-xs font-bold text-[#00a858] mt-4 flex items-center gap-1 bg-[#e2f9ec] px-3 py-1.5 rounded-full w-fit uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00a858]" />
              {financialSummary.successRate}
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Trend Visualizer Card */}
      <div className="glass-panel rounded-xl p-6 md:p-8 border border-outline-variant/20 shadow-sm bg-white">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-display text-lg font-bold text-primary">Tren Keuangan Operasional</h3>
          <button className="text-on-surface-variant p-2 hover:bg-surface-container hover:text-primary rounded-full transition-colors cursor-pointer">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>

        {/* Custom CSS Based Bar Chart Grid */}
        <div className="h-64 w-full flex items-end justify-between gap-4 px-2 pb-6 border-b border-outline-variant/30 relative">
          {/* Y Axis Grid lines */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider pb-6 w-12 text-right pr-2 select-none pointer-events-none">
            <span>100M</span>
            <span>75M</span>
            <span>50M</span>
            <span>25M</span>
          </div>
          
          <div className="w-12 shrink-0 select-none pointer-events-none" />

          {/* Chart Bars */}
          {barHeights.map((bar, idx) => (
            <div key={idx} className="w-full flex-1 flex flex-col items-center group relative cursor-pointer">
              {/* Bar line */}
              <div
                className={`w-1/2 md:w-2/3 rounded-t-md transition-all duration-300 relative ${bar.heightClass} ${
                  bar.highlight
                    ? 'bg-secondary-container hover:bg-secondary-container/90'
                    : 'bg-primary/25 hover:bg-primary'
                }`}
              >
                {/* Float tag on Hover */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 select-none pointer-events-none">
                  {bar.val}
                </div>
              </div>
              <span className={`text-[11px] font-bold tracking-wider mt-4 ${bar.highlight ? 'text-primary' : 'text-on-surface-variant'}`}>
                {bar.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions List Table */}
      <div className="glass-panel rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden bg-white">
        <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface/20">
          <h3 className="font-display text-lg font-bold text-primary">Daftar Transaksi Terakhir</h3>
          <span className="text-xs font-semibold text-primary hover:underline cursor-pointer">Lihat Semua</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container/20 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="p-6">ID Booking</th>
                <th className="p-6">Pelanggan</th>
                <th className="p-6">Tipe Kamar</th>
                <th className="p-6 text-right">Jumlah</th>
                <th className="p-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-sm font-medium">
              {transactions.map((t) => {
                let badge = (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e2f9ec] text-[#00a858] text-[10px] font-bold uppercase tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00a858]" />
                    Selesai
                  </span>
                );

                if (t.status === 'proses') {
                  badge = (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff4d8] text-secondary text-[10px] font-bold uppercase tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      Proses
                    </span>
                  );
                } else if (t.status === 'gagal') {
                  badge = (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-error text-[10px] font-bold uppercase tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-error" />
                      Gagal
                    </span>
                  );
                }

                return (
                  <tr key={t.id} className="hover:bg-surface-container/20 transition-colors">
                    <td className="p-6 font-bold text-primary">#{t.id}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden shrink-0 shadow-inner border border-gray-100 flex items-center justify-center font-bold text-xs text-primary">
                          {t.profileUrl ? (
                            <img alt={t.name} className="w-full h-full object-cover" src={t.profileUrl} />
                          ) : (
                            t.initials || 'US'
                          )}
                        </div>
                        <span className="text-on-surface font-semibold">{t.name}</span>
                      </div>
                    </td>
                    <td className="p-6 text-on-surface-variant font-semibold">{t.roomType}</td>
                    <td className="p-6 font-mono font-bold text-primary text-right">{formatRupiah(t.amount)}</td>
                    <td className="p-6 text-center">{badge}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
