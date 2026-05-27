import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../App';
import { AstronomyService } from '../services/astronomyService';
import { AstroEvent } from '../types';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Filter, Bell, Share2, Info, Zap, MessageCircle } from 'lucide-react';
import { gemini } from '../services/geminiService';

export const Calendar: React.FC = () => {
  const { city, lang } = useApp();
  const astro = useMemo(() => new AstronomyService(city), [city]);
  const [events, setEvents] = useState<AstroEvent[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});

  useEffect(() => {
    astro.getEventsForYear(new Date().getFullYear()).then(setEvents);
  }, [astro]);

  const filteredEvents = useMemo(() => {
    if (filter === 'All') return events;
    return events.filter(e => e.type === filter);
  }, [events, filter]);

  const loadDescription = async (eventName: string, id: string) => {
    if (descriptions[id]) return;
    const desc = await gemini.getEventDescription(eventName, city.name);
    setDescriptions(prev => ({ ...prev, [id]: desc }));
  };

  const handleShare = (event: AstroEvent) => {
    const text = `${lang === 'ur' ? '🌙' : '🌕'} ${event.name} visible from ${city.name} on ${format(event.date, 'MMMM dd')} at ${format(event.date, 'HH:mm')} PKT! #SkyPak #Pakistan`;
    const url = `whatsapp://send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const setReminder = (event: AstroEvent) => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          alert(`Reminder set for ${event.name}!`);
        }
      });
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h2 className="text-4xl font-display font-black uppercase tracking-tighter flex items-center gap-3 cosmic-text">
          <CalendarIcon className="text-celestial-blue" />
          {lang === 'ur' ? 'فلکیاتی کیلنڈر' : 'Astro Events 2026'}
        </h2>
        
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
          {['All', 'Eclipse', 'Meteor Shower', 'Planet', 'Moon'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap border ${
                filter === f 
                ? 'bg-celestial-blue border-celestial-blue text-white shadow-[0_0_20px_rgba(56,103,214,0.4)]' 
                : 'bg-white/5 border-white/5 hover:bg-white/10 opacity-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredEvents.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ delay: idx * 0.05 }}
              className={`glass p-8 group hover:border-white/20 transition-all duration-500 border-l-4 celestial-border ${
                event.type === 'Eclipse' ? 'border-l-red-500/50' : 
                event.type === 'Meteor Shower' ? 'border-l-nebula-purple/50' : 
                event.type === 'Planet' ? 'border-l-celestial-blue/50' : 'border-l-moon-white/30'
              }`}
            >
              <div className="flex flex-col md:flex-row gap-10">
                <div className="md:w-64 shrink-0">
                  <div className="text-stardust-gold text-[10px] font-black tracking-[0.3em] uppercase mb-3 opacity-80">
                    {format(event.date, 'MMMM dd, yyyy')}
                  </div>
                  <h3 className="text-4xl font-display font-black uppercase leading-none tracking-tight group-hover:text-celestial-blue transition-colors">
                    {lang === 'ur' ? event.nameUrdu : event.name}
                  </h3>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-full font-mono text-[9px] font-black uppercase tracking-widest opacity-60">
                       {event.type}
                    </span>
                    <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-full font-mono text-[9px] font-black uppercase tracking-widest opacity-60">
                       {format(event.peakTime, 'HH:mm')} PKT
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-8">
                  {/* Altitude Bar */}
                  <div>
                    <div className="flex justify-between text-[9px] font-black tracking-[0.4em] uppercase mb-2">
                       <span className="opacity-30">Orbital Elevation</span>
                       <span className="text-celestial-blue font-black">{event.altitude}°</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(event.altitude / 90) * 100}%` }}
                         transition={{ duration: 1, ease: 'easeOut' }}
                         className="h-full bg-gradient-to-r from-celestial-blue to-nebula-purple shadow-[0_0_15px_rgba(56,103,214,0.3)]"
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                       <span className="text-[9px] opacity-30 uppercase font-black tracking-widest">Observability</span>
                       <div className="flex gap-1.5">
                          {[1,2,3,4,5].map(dot => (
                            <div key={dot} className={`w-2 h-2 rounded-full transition-all ${dot <= 3 ? 'bg-stardust-gold shadow-[0_0_8px_rgba(254,211,48,0.3)]' : 'bg-white/5'}`} />
                          ))}
                       </div>
                    </div>
                    <div>
                       <span className="text-[9px] opacity-30 uppercase font-black block mb-2 tracking-widest">Target Azimuth</span>
                       <span className="text-xs font-black uppercase tracking-widest text-moon-white/80">{event.azimuth}° NE</span>
                    </div>
                    <div>
                       <span className="text-[9px] opacity-30 uppercase font-black block mb-2 tracking-widest">Quality</span>
                       <span className={`text-xs font-black uppercase tracking-widest ${event.visibility === 'Excellent' ? 'text-green-400' : 'text-stardust-gold'}`}>
                          {event.visibility}
                       </span>
                    </div>
                    <div>
                       <span className="text-[9px] opacity-30 uppercase font-black block mb-2 tracking-widest">Lunar Sync</span>
                       <span className={`text-xs font-black uppercase tracking-widest ${event.moonInterference ? 'text-red-400' : 'text-celestial-blue'}`}>
                        {event.moonInterference ? 'ACTIVE' : 'NOMINAL'}
                       </span>
                    </div>
                  </div>

                  <div className="relative">
                    {!descriptions[event.id] ? (
                      <button 
                        onClick={() => loadDescription(event.name, event.id)}
                        className="w-full py-3 bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white/10 transition-all flex items-center justify-center gap-3 rounded-2xl group/ai"
                      >
                         <Zap size={12} className="text-stardust-gold group-hover/ai:animate-pulse" /> Decipher Stellar Data
                      </button>
                    ) : (
                      <p className="text-sm tracking-tight leading-relaxed text-moon-white/50 p-6 bg-white/[0.02] border border-white/5 rounded-3xl italic font-medium group-hover:border-white/10 transition-all font-urdu">
                        {descriptions[event.id]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex md:flex-col gap-3 justify-end md:justify-center border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8 shrink-0">
                  <button onClick={() => setReminder(event)} className="p-4 bg-white/5 rounded-2xl hover:bg-celestial-blue/20 transition-all group/btn border border-white/5">
                    <Bell size={20} className="text-celestial-blue group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button onClick={() => handleShare(event)} className="p-4 bg-white/5 rounded-2xl hover:bg-nebula-purple/20 transition-all group/btn border border-white/5">
                    <Share2 size={20} className="text-nebula-purple group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
