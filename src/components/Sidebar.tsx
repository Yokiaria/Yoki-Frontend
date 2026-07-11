import React from 'react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onNewReservation: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  onNewReservation,
  isOpen = false,
  onClose,
  onLogout,
}: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'hotels', label: 'Hotels', icon: 'apartment' },
    { id: 'room-types', label: 'Room Types', icon: 'category' },
    { id: 'rooms', label: 'Rooms', icon: 'bed' },
    { id: 'bookings', label: 'Bookings', icon: 'calendar_month' },
    { id: 'reviews', label: 'Reviews', icon: 'star' },
    { id: 'users', label: 'Users', icon: 'group' },
    { id: 'financials', label: 'Financials', icon: 'payments' },
    { id: 'promos', label: 'Promos', icon: 'local_offer' },
  ];

  const footerItems = [
    { id: 'settings', label: 'Settings', icon: 'settings' },
    { id: 'support', label: 'Support', icon: 'help' },
  ];

  const content = (
    <div className="flex flex-col h-full py-8 px-4 bg-primary dark:bg-on-background border-r border-outline-variant/10 text-white select-none">
      {/* Brand Header */}
      <div className="mb-10 px-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight uppercase">GRANDSTARIND</h1>
          <p className="font-mono text-[10px] tracking-widest text-[#ffe084] mt-1 uppercase">Admin Console</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-white/70 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95">
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>

      {/* CTA Button */}
      <div className="mb-8 px-2">
        <button
          onClick={onNewReservation}
          className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-4 rounded-xl border border-white/20 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Reservation
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentTab(item.id);
                if (onClose) onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer text-left ${
                isActive
                  ? 'bg-white/20 text-white font-bold shadow-sm'
                  : 'text-[#b6c6f0] hover:text-white hover:bg-[#1a2b4c]'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Links */}
      <div className="mt-auto pt-6 border-t border-outline-variant/10 space-y-2 pr-2">
        {footerItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentTab(item.id);
                if (onClose) onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer text-left ${
                isActive
                  ? 'bg-white/20 text-white font-bold shadow-sm'
                  : 'text-[#b6c6f0] hover:text-white hover:bg-[#1a2b4c]'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer text-left text-red-300 hover:text-red-100 hover:bg-red-900/30 mt-2"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-bold">Logout</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-screen w-72 rounded-r-24 overflow-hidden shadow-xl shrink-0">
        {content}
      </aside>

      {/* Mobile drawer backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Mobile drawer panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 bg-primary z-50 md:hidden transition-transform duration-300 rounded-r-24 overflow-hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </aside>
    </>
  );
}
