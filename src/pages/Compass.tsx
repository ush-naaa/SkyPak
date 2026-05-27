import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../App';
import { AstronomyService } from '../services/astronomyService';
import { AstroEvent } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Compass as CompassIcon, LocateFixed } from 'lucide-react';
import { format } from 'date-fns';

export const Compass: React.FC = () => {
  const { city, lang } = useApp();
  const astro = useMemo(() => new AstronomyService(city), [city]);
  const [events, setEvents] = useState<AstroEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<AstroEvent | null>(null);

  useEffect(() => {
    astro.getEventsForYear(new Date().getFullYear()).then(evs => {
       const future = evs.filter(e => e.date > new Date());
       setEvents(future);
       if (future.length > 0) setSelectedEvent(future[0]);
    });
  }, [astro]);

  const DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

  return (
    <div className="space-y-8 py-10 flex flex-col items-center">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter flex items-center justify-center gap-3 cosmic-text">
          <CompassIcon className="text-celestial-blue" />
          {lang === 'ur' ? 'فلکیاتی قطب نما' : 'Celestial Compass'}
        </h2>
        <p className="text-moon-white/30 font-mono text-[10px] font-black uppercase tracking-[0.3em]">
           Azimuthal Target Acquisition
        </p>
      </div>

      <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border border-white/5 bg-white/[0.02] shadow-[0_0_50px_rgba(0,0,0,0.3)]" />
        
        {/* Decorative Grid */}
        <div className="absolute inset-4 rounded-full border border-white/[0.03] border-dashed animate-[spin_60s_linear_infinite]" />

        {/* Direction Labels */}
        {DIRECTIONS.map((dir, i) => (
          <div
            key={dir}
            className="absolute font-black text-[10px] text-moon-white/20 tracking-tighter"
            style={{
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-160px) rotate(-${i * 45}deg)`
            }}
          >
            {dir}
          </div>
        ))}

        {/* The Needle/Arrow */}
        <AnimatePresence mode="wait">
          {selectedEvent && (
            <motion.div
              key={selectedEvent.id}
              initial={{ rotate: 0 }}
              animate={{ rotate: selectedEvent.azimuth }}
              transition={{ type: 'spring', stiffness: 40, damping: 20 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-1.5 h-40 bg-gradient-to-t from-transparent via-celestial-blue to-celestial-blue rounded-full relative">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-celestial-blue shadow-[0_0_20px_#3867d6] rounded-full" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inner Hub */}
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-16 h-16 glass rounded-full flex items-center justify-center border-white/10 shadow-2xl">
              <LocateFixed className="text-celestial-blue animate-pulse" size={28} />
           </div>
        </div>

        {/* Altitude Indicator */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-56 flex flex-col items-center gap-3">
           <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              {selectedEvent && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(selectedEvent.altitude / 90) * 100}%` }}
                  className="h-full bg-stardust-gold shadow-[0_0_15px_#fed330]"
                />
              )}
           </div>
           <div className="text-[10px] uppercase font-black tracking-[0.3em] text-stardust-gold/80">
              Elevation: {selectedEvent?.altitude.toFixed(1)}°
           </div>
        </div>
      </div>

      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4 mt-24">
         {events.slice(0, 4).map(event => (
           <button
             key={event.id}
             onClick={() => setSelectedEvent(event)}
             className={`p-6 glass text-left transition-all border-l-4 group ${
               selectedEvent?.id === event.id ? 'border-celestial-blue bg-celestial-blue/5' : 'border-transparent hover:border-white/10'
             }`}
           >
              <div className="text-[9px] text-moon-white/30 font-black uppercase tracking-widest">{format(event.date, 'MMMM dd')}</div>
              <div className={`font-black uppercase tracking-tighter text-lg transition-colors ${selectedEvent?.id === event.id ? 'text-moon-white' : 'text-moon-white/50 group-hover:text-moon-white/80'}`}>
                {lang === 'ur' ? event.nameUrdu : event.name}
              </div>
           </button>
         ))}
      </div>
    </div>
  );
};
