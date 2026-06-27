import React from 'react';
import { Booking, Activity, Room } from './types';

interface OverviewProps {
  rooms: Room[];
  bookings: Booking[];
  activities: Activity[];
  revenueToday: number;
  onNavigateToTab: (tab: string) => void;
}

export default function Overview({
  rooms,
  bookings,
  activities,
  revenueToday,
  onNavigateToTab,
}: OverviewProps) {
  // Compute numbers
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === 'terisi').length;
  const availableRooms = rooms.filter((r) => r.status === 'tersedia').length;
  const maintenanceRooms = rooms.filter((r) => r.status === 'perawatan').length;

  // Let's format money in Indonesian Rupiah
  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div>
        <h2 className="font-display text-3xl font-bold text-primary">Overview Dashboard</h2>
        <p className="text-body-lg text-on-surface-variant mt-2">
          Selamat datang kembali. Berikut adalah ringkasan operasional hotel Anda hari ini.
        </p>
      </div>

      {/* Statistics Cards Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Occupied Rooms */}
        <div 
          onClick={() => onNavigateToTab('rooms')}
          className="bg-surface-container-lowest rounded-24 p-6 border border-outline-variant/20 shadow-sm relative overflow-hidden group hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[28px]">bed</span>
            </div>
            <span className="bg-secondary-fixed/20 text-on-secondary-fixed-variant px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]" data-weight="fill">trending_up</span> +12%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-on-surface-variant mb-1">Kamar Terisi (Occupied)</p>
            <h3 className="font-display text-4xl font-extrabold text-primary">{occupiedRooms} <span className="text-sm font-normal text-on-surface-variant">dari {totalRooms} unit</span></h3>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></div>
        </div>

        {/* Card 2: Total Bookings */}
        <div 
          onClick={() => onNavigateToTab('bookings')}
          className="bg-surface-container-lowest rounded-24 p-6 border border-outline-variant/20 shadow-sm relative overflow-hidden group hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-full bg-secondary-fixed/20 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[28px]">calendar_add_on</span>
            </div>
            <span className="bg-secondary-fixed/20 text-on-secondary-fixed-variant px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]" data-weight="fill">trending_up</span> +5%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-on-surface-variant mb-1">Total Reservasi Aktif</p>
            <h3 className="font-display text-4xl font-extrabold text-primary">
              {bookings.filter((b) => b.status === 'dibayar').length} <span className="text-sm font-normal text-on-surface-variant">Unit</span>
            </h3>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></div>
        </div>

        {/* Card 3: Available Rooms */}
        <div 
          onClick={() => onNavigateToTab('rooms')}
          className="bg-surface-container-lowest rounded-24 p-6 border border-outline-variant/20 shadow-sm relative overflow-hidden group hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[28px]">meeting_room</span>
            </div>
            <span className="bg-[#e2f9ec] text-[#00a858] px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
              Real-time
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-on-surface-variant mb-1">Kamar Tersedia (Available)</p>
            <h3 className="font-display text-4xl font-extrabold text-primary">{availableRooms} <span className="text-sm font-normal text-on-surface-variant">unit</span></h3>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></div>
        </div>

        {/* Card 4: Daily Revenue */}
        <div 
          onClick={() => onNavigateToTab('financials')}
          className="bg-primary text-white rounded-24 p-6 shadow-md relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer hover:-translate-y-0.5"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-secondary-fixed">
              <span className="material-symbols-outlined text-[28px]">payments</span>
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-primary-fixed-dim mb-1">Estimasi Pendapatan Hari Ini</p>
            <h3 className="font-display text-3xl font-extrabold text-white">
              {formatRupiah(revenueToday)}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Content Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section (Spans 2 columns) */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-24 p-6 md:p-8 border border-outline-variant/20 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-display text-xl font-bold text-primary">Tren Pendapatan Bulanan</h3>
              <p className="text-sm text-on-surface-variant mt-1">Performa operasional 30 hari terakhir</p>
            </div>
            <button className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors cursor-pointer">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
          
          {/* Custom SVG Line Chart */}
          <div className="flex-1 w-full bg-surface-container-low/30 rounded-xl relative min-h-[300px] overflow-hidden border border-outline-variant/10 flex flex-col justify-end p-4">
            <div className="absolute inset-0 p-6 flex flex-col justify-between select-none pointer-events-none">
              {/* Grid Y lines & labels */}
              {[120, 90, 60, 30].map((val) => (
                <div key={val} className="flex items-center w-full text-[10px] text-gray-400">
                  <span className="w-10 text-right pr-2">{val}jt</span>
                  <div className="flex-1 border-t border-dashed border-gray-200" />
                </div>
              ))}
            </div>

            {/* SVG Path */}
            <svg className="w-full h-48 relative z-10" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#031636" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#031636" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Filled Area */}
              <path
                d="M 0,200 L 0,160 Q 100,100 200,120 T 400,60 T 600,30 L 600,200 Z"
                fill="url(#chartGrad)"
              />
              {/* Spline stroke */}
              <path
                d="M 0,160 Q 100,100 200,120 T 400,60 T 600,30"
                fill="none"
                stroke="#031636"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Highlight Nodes */}
              <circle cx="200" cy="120" r="5" fill="#fed023" stroke="#031636" strokeWidth="2" />
              <circle cx="400" cy="60" r="5" fill="#fed023" stroke="#031636" strokeWidth="2" />
              <circle cx="600" cy="30" r="5" fill="#00a858" stroke="#031636" strokeWidth="2" />
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between text-[11px] text-on-surface-variant font-medium mt-4 px-2 relative z-10 border-t border-gray-200 pt-2">
              <span>Minggu 1</span>
              <span>Minggu 2</span>
              <span>Minggu 3</span>
              <span>Minggu 4</span>
              <span>Hari Ini (M5)</span>
            </div>
          </div>
        </div>

        {/* Recent Activities Panel (Spans 1 column) */}
        <div className="lg:col-span-1 bg-surface-container-lowest rounded-24 p-6 md:p-8 border border-outline-variant/20 shadow-sm flex flex-col h-[420px] lg:h-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display text-xl font-bold text-primary">Aktivitas Terbaru</h3>
            <span className="text-xs font-semibold text-primary-container bg-primary/10 px-2.5 py-1 rounded-full uppercase">Live</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-6 custom-scrollbar-dark select-none">
            {activities.length === 0 ? (
              <p className="text-sm text-on-surface-variant text-center py-12">Belum ada aktivitas terbaru.</p>
            ) : (
              activities.map((act) => {
                let icon = 'info';
                let iconBg = 'bg-surface-container text-primary';
                if (act.type === 'booking') {
                  icon = 'verified';
                  iconBg = 'bg-[#e2f9ec] text-[#00a858]';
                } else if (act.type === 'cleaning') {
                  icon = 'cleaning_services';
                  iconBg = 'bg-[#e2eff9] text-primary';
                } else if (act.type === 'cancel') {
                  icon = 'cancel';
                  iconBg = 'bg-error-container text-error';
                } else if (act.type === 'user') {
                  icon = 'person_add';
                  iconBg = 'bg-[#fdf3d8] text-secondary';
                }

                return (
                  <div key={act.id} className="flex gap-4 items-start hover:bg-gray-50/50 p-2 rounded-xl transition-colors">
                    <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center shrink-0 mt-0.5 shadow-sm`}>
                      <span className="material-symbols-outlined text-[18px]">{icon}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-primary truncate leading-snug">{act.title}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5 truncate">{act.desc}</p>
                      <p className="font-mono text-[9px] tracking-wider text-gray-400 mt-1.5 uppercase">{act.time}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
