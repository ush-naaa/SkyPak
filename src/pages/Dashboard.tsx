import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../App';
import { AstronomyService } from '../services/astronomyService';
import { AstroEvent } from '../types';
import { motion } from 'motion/react';
import { Clock, Eye, MapPin, Wind, Share2, Zap } from 'lucide-react';
import { format, differenceInSeconds } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { city, lang, setCurrentPage } = useApp();
  const astro = useMemo(() => new AstronomyService(city), [city]);
  const [nextEvent, setNextEvent] = useState<AstroEvent | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, min: number, sec: number } | null>(null);

  const moonData = useMemo(() => astro.getCurrentMoonPhase(), [astro]);

  useEffect(() => {
    astro.getEventsForYear(new Date().getFullYear()).then(events => {
      const now = new Date();
      // Find the first event that hasn't finished yet
      const future = events.find(e => {
        const endTime = e.endTime || new Date(e.date.getTime() + 1000 * 60 * 60 * 2); // Default 2h duration
        return endTime > now;
      });
      if (future) setNextEvent(future);
    });
  }, [astro]);

  useEffect(() => {
    if (!nextEvent) return;
    const interval = setInterval(() => {
      const now = new Date();
      const seconds = differenceInSeconds(nextEvent.date, now);
      const endTime = nextEvent.endTime || new Date(nextEvent.date.getTime() + 1000 * 60 * 60 * 2);
      
      if (now > endTime) {
        setNextEvent(null);
        return;
      }
      
      if (seconds > 0) {
        setTimeLeft({
          days: Math.floor(seconds / (3600 * 24)),
          hours: Math.floor((seconds % (3600 * 24)) / 3600),
          min: Math.floor((seconds % 3600) / 60),
          sec: seconds % 60
        });
      } else {
        setTimeLeft(null); // It's occurring now
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [nextEvent]);

  const isVisibleTonight = useMemo(() => {
    if (city.pollution === 'High') return 'MAYBE';
    return (nextEvent && nextEvent.visibility === 'Excellent') || city.pollution === 'Low' ? 'YES' : 'FAIR';
  }, [city, nextEvent]);

  return (
    <div className="space-y-12">
      {/* Visibility Hero */}
      <section className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-white/5 border border-white/5 rounded-[40px] backdrop-blur-2xl" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-celestial-blue/5 blur-[100px] -z-10 group-hover:bg-celestial-blue/10 transition-all" />
        
        <div className="relative p-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
              <span className={`px-4 py-1.5 ${city.pollution === 'Low' ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'bg-stardust-gold/10 text-stardust-gold border-stardust-gold/20 shadow-[0_0_15px_rgba(254,211,48,0.1)]'} text-[10px] font-black tracking-[0.3em] uppercase rounded-full border`}>
                {lang === 'ur' ? (city.pollution === 'Low' ? 'آسمان مکمل صاف ہے' : 'آسمان کسی حد تک صاف ہے') : `Sky Condition: ${city.pollution}`}
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter leading-tight cosmic-text">
              {lang === 'ur' ? 'کیا میں دیکھ سکتا ہوں؟' : 'Can I see it tonight?'}
            </h2>
            <p className="mt-4 text-moon-white/60 max-w-lg mx-auto md:mx-0 font-medium">
              {lang === 'ur' 
                ? (city.pollution === 'Low' 
                   ? 'آج رات آسمان ستاروں کے مشاہدے کے لیے بہترین ہے۔' 
                   : 'آسمان میں کچھ روشنی کی آلودگی ہے لیکن اہم اجسام دیکھے جا سکتے ہیں۔') 
                : (city.pollution === 'Low' 
                   ? 'Pristine conditions detected. The core of the Milky Way will be visible at midnight.' 
                   : 'Urban light pollution detected. Stick to bright planets and the Moon for best results.')}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-celestial-blue animate-pulse" />
              <span className="text-[8px] font-black tracking-[0.2em] opacity-40 ml-1 uppercase">Stellar Link: Solid</span>
            </div>
            <div className={`w-32 h-32 md:w-44 md:h-44 rounded-full bg-space-void border-2 ${isVisibleTonight === 'YES' ? 'border-celestial-blue shadow-[0_0_60px_rgba(56,103,214,0.2)]' : 'border-stardust-gold shadow-[0_0_60px_rgba(254,211,48,0.1)]'} flex items-center justify-center relative`}>
              <div className={`absolute inset-0 rounded-full border-2 ${isVisibleTonight === 'YES' ? 'border-celestial-blue/20' : 'border-stardust-gold/20'} animate-ping opacity-10`} />
              <span className={`text-4xl md:text-6xl font-black tracking-tighter ${isVisibleTonight === 'YES' ? 'text-moon-white' : 'text-stardust-gold'}`}>{isVisibleTonight}</span>
            </div>
            {timeLeft && (
              <div className="mt-4 font-mono text-[10px] opacity-40 bg-white/5 px-4 py-2 rounded-full border border-white/5 uppercase">
                PEAK: {timeLeft.hours}h {timeLeft.min}m {timeLeft.sec}s
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Moon Phase Strip */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Lunar Chronology • {moonData.name}</h3>
          <span className="text-[10px] font-black uppercase tracking-widest text-celestial-blue">{Math.round(moonData.phase * 100 / 360)}% Illuminated</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'].map((m, i) => {
            const isActive = Math.floor(moonData.phase / 45) === i;
            return (
              <div 
                key={i}
                className={`flex-1 min-w-[70px] h-24 glass rounded-3xl flex items-center justify-center text-3xl transition-all duration-500 ${
                  isActive ? 'bg-celestial-blue/10 border-celestial-blue/50 shadow-[0_0_30px_rgba(56,103,214,0.2)]' : 'opacity-40 hover:opacity-100 border-white/5'
                }`}
              >
                {m}
              </div>
            )
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Observing Forecast Card */}
        <div className="glass p-8 relative overflow-hidden group border-white/5">
          <div className="absolute top-0 right-0 p-6 flex gap-1">
             {[1,2,3,4,5].map(i => (
               <div key={i} className={`w-1 h-4 rounded-full transition-all duration-500 ${i <= (city.pollution === 'Low' ? 5 : city.pollution === 'Moderate' ? 3 : 1) ? 'bg-celestial-blue shadow-[0_0_10px_rgba(56,103,214,0.5)]' : 'bg-white/5'}`} />
             ))}
          </div>
          <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">Astrographic Forecast • {city.name}</h4>
          <div className="space-y-4">
            <div className="text-5xl font-black uppercase text-moon-white">
              {city.pollution === 'Low' ? 'Pristine' : city.pollution === 'Moderate' ? 'Balanced' : 'Limited'}
            </div>
            <p className="text-xs text-moon-white/50 leading-relaxed uppercase font-black tracking-wider">
              {city.pollution === 'Low' 
                ? "Optimal observational window. Nebula and distant clusters fully resolvable." 
                : city.pollution === 'Moderate' 
                ? "Sub-optimal clarity. Lunar and planetary detail remains high." 
                : "Atmospheric interference detected. Target solar system bodies exclusively."}
            </p>
          </div>
        </div>

        {/* Next Event Card */}
        <div className="glass p-8 border-l-4 border-nebula-purple overflow-hidden group border-white/5 bg-nebula-purple/5">
          <div className="flex justify-between mb-4 items-center">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{lang === 'ur' ? 'اگلا بڑا واقعہ' : 'Celestial Event Update'}</span>
              <div className="flex gap-4 items-center">
                <button 
                  onClick={() => setCurrentPage('calendar')}
                  className="text-[9px] font-black uppercase tracking-widest text-nebula-purple hover:text-white transition-colors border-b border-nebula-purple/30 pb-0.5"
                >
                  {lang === 'ur' ? 'کیلنڈر دیکھیں' : 'Full Chronology'}
                </button>
                <Share2 size={14} className="text-white/20 hover:text-white cursor-pointer transition-colors" />
              </div>
           </div>
           {nextEvent ? (
             <>
               <h4 className="text-4xl font-display font-black uppercase mb-4 text-nebula-purple leading-none tracking-tight">
                  {lang === 'ur' ? nextEvent.nameUrdu : nextEvent.name}
               </h4>
               <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-[10px] mb-2 font-black opacity-60">
                       <span className="tracking-widest">MAGNITUDE / ALT</span>
                       <span className="text-nebula-purple">{nextEvent.altitude}° ELEVATION</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(nextEvent.altitude / 90) * 100}%` }}
                         className="h-full bg-gradient-to-r from-celestial-blue to-nebula-purple"
                       />
                    </div>
                 </div>
                 <div className="flex gap-8">
                    <div>
                       <span className="text-[9px] opacity-30 uppercase block mb-1 font-black tracking-tighter">Observability</span>
                       <div className="flex gap-1.5">
                          {[1,2,3,4,5].map(dot => (
                            <div key={dot} className={`w-2 h-2 rounded-full transition-all ${dot <= (nextEvent.visibility === 'Excellent' ? 5 : 3) ? 'bg-stardust-gold shadow-[0_0_8px_rgba(254,211,48,0.5)]' : 'bg-white/5'}`} />
                          ))}
                       </div>
                    </div>
                    <div>
                       <span className="text-[9px] opacity-30 uppercase block mb-1 font-black tracking-tighter">Peak Chrono</span>
                       <span className="text-xs font-black text-moon-white">
                         {differenceInSeconds(nextEvent.date, new Date()) <= 0 
                           ? (lang === 'ur' ? 'اب ہو رہا ہے' : 'TRANSITING NOW')
                           : format(nextEvent.peakTime, 'HH:mm') === '00:00' 
                             ? (lang === 'ur' ? 'پوری رات' : 'FULL NIGHT') 
                             : `${format(nextEvent.peakTime, 'HH:mm')} PKT`
                         }
                       </span>
                    </div>
                 </div>
               </div>
             </>
           ) : (
             <div className="h-full flex items-center justify-center text-moon-white/20 text-xs font-black uppercase tracking-widest">
               {lang === 'ur' ? 'خلا خاموش ہے' : 'Void Detected // No Signals'}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
