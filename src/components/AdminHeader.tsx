import React from 'react';

interface HeaderProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
}

export default function Header({
  onToggleSidebar,
  searchQuery,
  setSearchQuery,
  placeholder = 'Search...'
}: HeaderProps) {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center flex-1">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden mr-4"
        >
          <span className="material-symbols-rounded">menu</span>
        </button>
        <div className="relative w-full max-w-md hidden sm:block">
          <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all text-slate-800 dark:text-slate-100"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 relative">
          <span className="material-symbols-rounded">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-sm cursor-pointer border-2 border-white dark:border-slate-800">
          A
        </div>
      </div>
    </header>
  );
}
