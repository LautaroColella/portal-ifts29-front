import React from 'react';
import { Search, Bell, ChevronDown, Moon, Sun } from 'lucide-react';

export const Topbar = ({ toggleDarkMode, isDarkMode }) => {
  return (
    <header className="h-16 bg-brand-blue text-white flex items-center justify-between px-6 transition-colors duration-300">
      <div className="flex-1 flex items-center gap-4 max-w-2xl">
        <div className="relative w-full flex items-center text-text-main">
          {/* <Search className="absolute left-3 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Buscar reclamos, usuarios, categorías..."
            className="w-full pl-10 pr-4 py-2 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50 text-sm"
          /> */}
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button onClick={toggleDarkMode} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          {isDarkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
        </button>
        {/* <button className="relative p-2 hover:bg-white/10 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-state-pending rounded-full border border-brand-blue"></span>
        </button> */}
        <div className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">
            JP
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold leading-none">Juan Pérez</p>
            <p className="text-xs text-white/70 mt-1">Administrador</p>
          </div>
          <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
        </div>
      </div>
    </header>
  );
};
