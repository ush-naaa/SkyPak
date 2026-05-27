import React from 'react';
import { useApp } from '../App';
import { PAKISTANI_CITIES } from '../constants';
import { Language, City } from '../types';
import { Home, Map as MapIcon, Telescope, MessageSquare, Info, Compass, Shield, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { CityOrb } from './CityOrb';

export const Nav: React.FC = () => {
  const { currentPage, setCurrentPage, city, setCity, lang, setLang } = useApp();

  const menuItems = [
    { id: 'home', icon: <Home size={18} />, label: 'Home', labelUrdu: 'ہوم' },
    { id: 'calendar', icon: <CalendarIcon size={18} />, label: 'Events', labelUrdu: 'واقعات' },
    { id: 'skymap', icon: <MapIcon size={18} />, label: 'Map', labelUrdu: 'نقشہ' },
    { id: 'can-i-see-it', icon: <Telescope size={18} />, label: 'Visible?', labelUrdu: 'دکھائی دے گا؟' },
    { id: 'compass', icon: <Compass size={18} />, label: 'Compass', labelUrdu: 'قطب نما' },
    { id: 'dark-sky', icon: <Shield size={18} />, label: 'Sites', labelUrdu: 'مقامات' },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
        {/* The New Interactive City Orb Selector */}
        <CityOrb />

        <div className="h-6 w-px bg-white/10 hidden md:block"></div>

        {/* Language Pill Switch */}
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 shrink-0 shadow-inner">
          <button 
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 text-[9px] font-black rounded-md transition-all ${lang === 'en' ? 'bg-celestial-blue text-white shadow-[0_0_15px_rgba(56,103,214,0.4)]' : 'text-white/40 hover:text-white'}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLang('ur')}
            className={`px-3 py-1.5 text-[9px] font-black rounded-md font-urdu transition-all ${lang === 'ur' ? 'bg-celestial-blue text-white shadow-[0_0_15px_rgba(56,103,214,0.4)]' : 'text-white/40 hover:text-white'}`}
          >
            اردو
          </button>
        </div>
      </div>

      {/* Main Navigation (Bottom Floating Menu) */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 glass flex items-center p-1 rounded-2xl gap-0.5 z-50 shadow-2xl border border-white/10 bg-space-void/90 backdrop-blur-2xl w-[95%] max-w-lg justify-around overflow-hidden">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id as any)}
            className={`flex flex-col items-center gap-1 flex-1 py-3 px-1 rounded-xl transition-all duration-300 relative group ${
              currentPage === item.id 
              ? 'text-celestial-blue' 
              : 'text-white/30 hover:text-white'
            }`}
          >
            {currentPage === item.id && (
              <motion.div 
                layoutId="nav-glow"
                className="absolute inset-0 bg-celestial-blue/10 rounded-xl -z-10"
              />
            )}
            <span className={`text-lg transition-transform duration-300 ${currentPage === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
              {item.icon}
            </span>
            <span className={`text-[7px] md:text-[9px] font-bold uppercase tracking-widest text-center leading-none ${lang === 'ur' ? 'font-urdu' : ''}`}>
              {lang === 'ur' ? item.labelUrdu : item.label}
            </span>
            {currentPage === item.id && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-celestial-blue shadow-[0_0_15px_#3867d6]" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};
