import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../App';
import { AstronomyService } from '../services/astronomyService';
import { AstroEvent } from '../types';
import { motion } from 'motion/react';
import { Compass as CompassIcon, Navigation, Telescope } from 'lucide-react';
import { format } from 'date-fns';

export const CanISeeIt: React.FC = () => {
  const { city, lang } = useApp();
  const astro = useMemo(() => new AstronomyService(city), [city]);
  const [tonightEvents, setTonightEvents] = useState<AstroEvent[]>([]);
  const [visibleObjects, setVisibleObjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    astro.getEventsForYear(new Date().getFullYear()).then(events => {
      const now = new Date();
      const tonight = events.filter(e => {
        const diff = Math.abs(e.date.getTime() - now.getTime());
        return diff < 1000 * 60 * 60 * 24;
      });
      setTonightEvents(tonight);
      
      const visible = astro.getCelestialBodies(now).filter(b => b.visible);
      setVisibleObjects(visible);
      
      setLoading(false);
    });
  }, [astro]);

  if (loading) return <div className="text-center py-20 animate-pulse text-celestial-blue font-black tracking-widest uppercase">Scanning celestial coordinates...</div>;

  const hasSomethingToSee = tonightEvents.length > 0 || visibleObjects.length > 0;

  return (
    <div className="space-y-8 py-10">
      <div className="text-center space-y-2">
        <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none cosmic-text">
          {lang === 'ur' ? 'کیا آج میں اسے دیکھ سکتا ہوں؟' : 'Can I See It Tonight?'}
        </h2>
        <p className="text-moon-white/30 font-mono text-xs uppercase tracking-[0.3em] font-black">
           Station Analysis: {city.name}, PK
        </p>
      </div>

      {hasSomethingToSee ? (
        <div className="space-y-8">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-12 bg-celestial-blue/5 border border-celestial-blue/20 rounded-[40px] text-center relative overflow-hidden backdrop-blur-3xl group shadow-[0_0_50px_rgba(56,103,214,0.1)]"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-celestial-blue/10 blur-[100px] -z-10 group-hover:bg-celestial-blue/20 transition-all duration-700" />
            <h3 className="text-8xl font-black text-moon-white uppercase tracking-tighter mb-4 opacity-90">VISIBLE</h3>
            <p className="text-xl font-bold text-moon-white/60 max-w-md mx-auto leading-relaxed">
              {lang === 'ur' 
                ? 'تیار ہو جائیں! آج رات آسمان میں بہت کچھ دیکھنے کو ہے۔' 
                : "Exceptional transparency detected. Grab your stellar gear."}
            </p>
          </motion.div>

          {tonightEvents.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 px-2">Primary Event Streams</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tonightEvents.map(event => (
                  <div key={event.id} className="glass p-8 border-l-4 border-nebula-purple bg-nebula-purple/5 transition-all hover:bg-nebula-purple/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-3xl font-black text-nebula-purple uppercase tracking-tighter mb-1 leading-none">{lang === 'ur' ? event.nameUrdu : event.name}</h4>
                        <p className="text-[10px] font-mono font-black opacity-30 uppercase tracking-widest">{format(event.date, 'hh:mm aaa')} PKT</p>
                      </div>
                      <Telescope className="text-nebula-purple" size={24} />
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-3 text-[10px] uppercase font-black tracking-widest">
                      <div className="bg-white/5 p-3 rounded-2xl border border-white/5 opacity-60">ELEVATION {Math.round(event.altitude)}°</div>
                      <div className="bg-white/5 p-3 rounded-2xl border border-white/5 opacity-60 text-center">ACTIVE</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visibleObjects.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 px-2">Real-time Targets</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {visibleObjects.map(obj => (
                  <div key={obj.name} className="glass p-6 border border-white/5 hover:border-celestial-blue/30 transition-all hover:scale-[1.02]">
                    <div className="flex justify-between items-center mb-6">
                       <span className="text-xs font-black uppercase tracking-widest" style={{ color: obj.color }}>{obj.name}</span>
                       <div className="w-1.5 h-1.5 rounded-full bg-celestial-blue shadow-[0_0_8px_#3867d6] animate-pulse" />
                    </div>
                    <div className="space-y-2">
                       <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-celestial-blue opacity-30" 
                            style={{ width: `${(obj.altitude / 90) * 100}%` }}
                          />
                       </div>
                      <div className="flex justify-between text-[8px] font-black opacity-30 uppercase tracking-widest">
                        <span>Horizon Dist.</span>
                        <span>{Math.round(obj.altitude)}°</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-12 bg-white/[0.02] border border-white/5 rounded-[40px] text-center"
          >
            <h3 className="text-8xl font-black text-white uppercase opacity-10 tracking-tighter mb-4">INERT</h3>
            <p className="text-xl font-bold text-moon-white/30 max-w-md mx-auto">
              {lang === 'ur' 
                ? 'آج رات کوئی غیر معمولی واقعہ نہیں ہے۔ لیکن افق پر نظر رکھیں!' 
                : "No major events tonight. Keep your eyes on the horizon for the next one!"}
            </p>
          </motion.div>
          
          <div className="glass p-10 text-center border border-white/5 opacity-40">
             <Navigation className="mx-auto mb-6 text-celestial-blue animate-bounce" />
             <p className="font-mono text-[10px] font-black uppercase tracking-[0.4em]">Propagating Signal... Waiting for next window</p>
          </div>
        </div>
      )}
      
      <div className="glass p-6 text-center italic text-sm text-moon-white/70">
        "The cosmos is within us. We are made of star-stuff. We are a way for the cosmos to know itself." — Carl Sagan
      </div>
    </div>
  );
};
