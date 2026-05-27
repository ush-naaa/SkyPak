import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useApp } from '../App';
import { AstronomyService } from '../services/astronomyService';
import { motion, AnimatePresence } from 'motion/react';
import { ZoomIn, ZoomOut, Maximize, Map, Info, Star, X, Zap } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { CONSTELLATIONS } from '../data/constellations';

export const SkyMap: React.FC = () => {
  const { city, lang } = useApp();
  const astro = useMemo(() => new AstronomyService(city), [city]);
  const [date, setDate] = useState(new Date());
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [selectedBody, setSelectedBody] = useState<any>(null);
  
  // Layer Toggles
  const [showConstellations, setShowConstellations] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showAtmosphere, setShowAtmosphere] = useState(true);
  
  const [todayEvents, setTodayEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    astro.getEventsForYear(date.getFullYear()).then(events => {
      setTodayEvents(events.filter(e => isSameDay(e.date, date)));
    });
  }, [date, astro]);

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  const bodies = useMemo(() => {
    const all = astro.getCelestialBodies(date);
    if (!searchQuery) return all;
    return all.filter(b => 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ((b as any).id && (b as any).id.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [city, date, astro, searchQuery]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 3));
  };

  const project = (az: number, alt: number) => {
    // Stereographic or simple polar projection
    // Center is Zenith (alt=90)
    const r = (90 - alt) / 90 * 300 * zoom; 
    const theta = (az - 90) * Math.PI / 180;
    const x = r * Math.cos(theta) + offset.x;
    const y = r * Math.sin(theta) + offset.y;
    return { x, y, r };
  };

  const sun = useMemo(() => astro.getCelestialBodies(date).find(b => b.name === 'Sun'), [date, astro]);
  const atmosphereColor = useMemo(() => {
    if (!sun || !showAtmosphere) return 'bg-space-black';
    const alt = sun.altitude;
    if (alt > 0) return 'bg-sky-500'; // Daytime
    if (alt > -6) return 'bg-orange-900/40'; // Civil twilight
    if (alt > -12) return 'bg-blue-900/40'; // Nautical twilight
    if (alt > -18) return 'bg-space-navy/40'; // Astronomical twilight
    return 'bg-space-black';
  }, [sun, showAtmosphere]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-display font-black uppercase tracking-tighter flex items-center gap-3 cosmic-text">
          <Map className="text-celestial-blue" />
          {lang === 'ur' ? 'آسمانی نقشہ' : 'Interactive Sky Map'}
        </h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ur' ? 'تلاش کریں...' : 'Search sky...'}
              className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs focus:outline-none focus:border-celestial-blue/50 w-32 md:w-48 placeholder:opacity-30"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>
          <button 
            onClick={() => setShowConstellations(!showConstellations)} 
            className={`p-2.5 glass transition-all ${showConstellations ? 'bg-celestial-blue/20 border-celestial-blue shadow-[0_0_15px_rgba(56,103,214,0.3)]' : 'hover:bg-white/10 border-white/5'}`}
            title="Toggle Constellations"
          >
            <Star size={18} className={showConstellations ? 'text-celestial-blue' : 'text-white/40'} />
          </button>
          <button 
            onClick={() => setShowGrid(!showGrid)} 
            className={`p-2.5 glass transition-all ${showGrid ? 'bg-celestial-blue/20 border-celestial-blue shadow-[0_0_15px_rgba(56,103,214,0.3)]' : 'hover:bg-white/10 border-white/5'}`}
            title="Toggle Grid"
          >
            <Zap size={18} className={showGrid ? 'text-celestial-blue' : 'text-white/40'} />
          </button>
          <button onClick={() => handleZoom(0.1)} className="p-2.5 glass hover:bg-white/10 border-white/5"><ZoomIn size={18} /></button>
          <button onClick={() => handleZoom(-0.1)} className="p-2.5 glass hover:bg-white/10 border-white/5"><ZoomOut size={18} /></button>
          <button onClick={() => { setOffset({ x: 0, y: 0 }); setZoom(1); }} className="p-2.5 glass hover:bg-white/10 border-white/5"><Maximize size={18} /></button>
        </div>
      </div>

      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative w-full aspect-square md:aspect-video min-h-[450px] ${atmosphereColor} rounded-[40px] overflow-hidden cursor-move select-none border border-white/5 shadow-2xl transition-colors duration-1000`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Galactic Plane / Milky Way Glow */}
          <div 
             className="absolute w-[150%] h-[15%] bg-gradient-to-r from-transparent via-celestial-blue/10 to-transparent blur-[100px] -rotate-45 pointer-events-none"
             style={{ transform: `translate(${offset.x}px, ${offset.y}px) rotate(-45deg)` }}
          />

          {/* Compass Ring */}
          <div 
            className="absolute rounded-full border border-white/5 flex items-center justify-center transition-transform duration-300"
            style={{ width: 610 * zoom, height: 610 * zoom, transform: `translate(${offset.x}px, ${offset.y}px)` }}
          >
            {['N', 'E', 'S', 'W'].map((d, i) => (
              <div 
                key={d} 
                className="absolute text-[10px] font-black opacity-20 tracking-widest"
                style={{ transform: `rotate(${i * 90}deg) translateY(-${305 * zoom}px)` }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Coordinate Grid Lines */}
          {showGrid && [0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
            <div 
              key={deg}
              className="absolute h-[250%] w-px bg-white/[0.03]"
              style={{ transform: `rotate(${deg}deg)` }}
            />
          ))}

          {/* Horizon Line */}
          <div
            className="absolute rounded-full border border-white/10"
            style={{
              width: 600 * zoom,
              height: 600 * zoom,
              transform: `translate(${offset.x}px, ${offset.y}px)`
            }}
          >
            {/* Azimuth Labels */}
            {showGrid && Array.from({ length: 24 }).map((_, i) => {
              const deg = i * 15;
              const r = 300 * zoom;
              const theta = (deg - 90) * Math.PI / 180;
              const x = r * Math.cos(theta);
              const y = r * Math.sin(theta);
              return (
                <div 
                  key={deg}
                  className="absolute text-[8px] opacity-10 font-mono"
                  style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: 'translate(-50%, -50%)' }}
                >
                  {deg}°
                </div>
              );
            })}
          </div>

          {/* Altitude Rings */}
          {showGrid && [30, 60, 90].map(alt => (
            <div
              key={alt}
              className="absolute rounded-full border border-white/[0.03]"
              style={{
                width: (90 - alt) / 90 * 600 * zoom,
                height: (90 - alt) / 90 * 600 * zoom,
                transform: `translate(${offset.x}px, ${offset.y}px)`
              }}
            />
          ))}

          {/* Zenith Point */}
          <div 
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
          />

          {/* Constellation Lines */}
          {showConstellations && CONSTELLATIONS.map(con => (
            <div key={con.name}>
              {con.lines.map(([s1, s2], idx) => {
                const star1 = bodies.find(b => b.name === s1);
                const star2 = bodies.find(b => b.name === s2);
                if (!star1 || !star2) return null;
                const p1 = project(star1.azimuth, star1.altitude);
                const p2 = project(star2.azimuth, star2.altitude);
                
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                return (
                  <div 
                    key={idx}
                    className="absolute bg-celestial-blue/20 pointer-events-none origin-left"
                    style={{
                      left: `calc(50% + ${p1.x}px)`,
                      top: `calc(50% + ${p1.y}px)`,
                      width: dist,
                      height: '1px',
                      transform: `rotate(${angle}deg)`,
                    }}
                  />
                );
              })}
              {/* Constellation Label */}
              {(() => {
                const centerStar = bodies.find(b => b.name === con.lines[0][0]);
                if (!centerStar) return null;
                const p = project(centerStar.azimuth, centerStar.altitude);
                return (
                  <div 
                    className="absolute text-[8px] font-black text-celestial-blue/40 tracking-[0.3em] uppercase italic pointer-events-none whitespace-nowrap"
                    style={{ left: `calc(50% + ${p.x}px)`, top: `calc(50% + ${p.y}px - 20px)`, transform: 'translateX(-50%)' }}
                  >
                    {lang === 'ur' ? con.nameUrdu : con.name}
                  </div>
                );
              })()}
            </div>
          ))}

          {/* Bodies */}
          {bodies.map((body) => {
            const { x, y } = project(body.azimuth, body.altitude);
            if (body.altitude < 0) return null;
            
            const isSelected = selectedBody?.name === body.name;
            const hasEvent = todayEvents.some(e => 
              (e.name.includes('Solar') && body.name === 'Sun') || 
              (e.name.includes('Lunar') && body.name === 'Moon')
            );

            // Enhanced styling for stars/planets
            const size = body.type === 'Planet' ? 8 : Math.max(2, 6 - (body.mag || 3));
            const glowSize = size * 3;
            
            return (
              <motion.div
                key={body.name}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  zIndex: isSelected ? 10 : 1,
                }}
                onClick={(e) => { e.stopPropagation(); setSelectedBody(body); }}
              >
                <div 
                  className={`relative flex items-center justify-center transition-all duration-300 ${isSelected ? 'scale-150' : 'hover:scale-125'}`}
                >
                  <div 
                    className={`rounded-full shadow-lg cursor-pointer ${hasEvent ? 'ring-2 ring-celestial-blue ring-offset-2 ring-offset-black' : ''}`}
                    style={{ 
                      width: size, 
                      height: size, 
                      backgroundColor: body.color,
                      boxShadow: isSelected ? `0 0 ${glowSize * 2}px ${body.color}` : `0 0 ${glowSize}px ${body.color}`
                    }}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 rounded-full border border-white/20 animate-ping" />
                    )}
                  </div>
                  {(isSelected || zoom > 2) && (
                    <span className={`absolute top-4 text-[9px] font-black uppercase whitespace-nowrap tracking-wider ${isSelected ? 'text-celestial-blue' : 'text-moon-white/60'}`}>
                      {lang === 'ur' && (body as any).nameUrdu ? (body as any).nameUrdu : body.name}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Body Info Info */}
        <AnimatePresence>
          {selectedBody && (
            <motion.div
              initial={{ x: 350 }}
              animate={{ x: 0 }}
              exit={{ x: 350 }}
              className="absolute top-0 right-0 h-full w-72 glass rounded-none border-l border-white/5 p-8 z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]"
            >
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-2xl font-display font-black uppercase text-moon-white tracking-tighter leading-none">
                  {selectedBody.name}
                </h3>
                <button onClick={() => setSelectedBody(null)} className="text-white/20 hover:text-white transition-colors p-1"><X size={20} /></button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                  <span className="text-[9px] uppercase opacity-30 font-black tracking-widest">Classification</span>
                  <div className="font-bold text-moon-white text-sm mt-1">
                    {selectedBody.type === 'DSO' ? `Messier Object (${selectedBody.id})` : selectedBody.type}
                  </div>
                </div>
                {selectedBody.description && (
                  <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                    <span className="text-[9px] uppercase opacity-30 font-black tracking-widest">Observations</span>
                    <div className="text-xs text-moon-white/60 mt-2 leading-relaxed font-medium">{selectedBody.description}</div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                    <span className="text-[9px] uppercase opacity-30 font-black tracking-widest">Altitude</span>
                    <div className="font-black text-moon-white text-lg">{Math.round(selectedBody.altitude)}°</div>
                  </div>
                  <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                    <span className="text-[9px] uppercase opacity-30 font-black tracking-widest">Azimuth</span>
                    <div className="font-black text-moon-white text-lg">{Math.round(selectedBody.azimuth)}°</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                    <span className="text-[9px] uppercase opacity-30 font-black tracking-widest">Mag.</span>
                    <div className="font-black text-stardust-gold text-lg">
                      {selectedBody.magnitude !== undefined ? selectedBody.magnitude.toFixed(2) : selectedBody.mag?.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 flex flex-col justify-center">
                    <span className="text-[9px] uppercase opacity-30 font-black tracking-widest text-center">Status</span>
                    <div className="font-black text-green-400 text-[10px] text-center mt-1">TRACKING</div>
                  </div>
                </div>

                {selectedBody.distanceEarth && (
                  <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                    <span className="text-[9px] uppercase opacity-30 font-black tracking-widest">Geocentric Distance</span>
                    <div className="font-bold text-moon-white text-xs mt-1">{selectedBody.distanceEarth.toFixed(4)} AU</div>
                  </div>
                )}
                
                <p className="text-[10px] text-moon-white/30 italic leading-relaxed pt-6 border-t border-white/5 uppercase tracking-tighter">
                  {selectedBody.type === 'Planet' 
                    ? `Current positioning suggests ${selectedBody.name} is transiting the local meridian.`
                    : `${selectedBody.name} remains a stable point of reference in the current field of view.`
                  }
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        <div className="absolute bottom-10 left-10 p-5 glass bg-black/60 border border-white/5 text-[9px] uppercase font-black tracking-[0.2em] flex flex-col gap-3 z-10 transition-all duration-500 hover:bg-black/80">
          <div className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-stardust-gold shadow-[0_0_8px_#fed330]" /> Planets</div>
          <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#fff]" /> Starfields</div>
          {showConstellations && (
            <div className="flex items-center gap-3"><div className="w-5 h-px bg-celestial-blue shadow-[0_0_8px_#3867d6]" /> Astro-Lines</div>
          )}
          {todayEvents.length > 0 && (
            <div className="flex items-center gap-3 text-celestial-blue"><Zap size={10} className="fill-celestial-blue" /> Alert Node</div>
          )}
          <div className="mt-2 pt-2 border-t border-white/5 opacity-30 font-mono">Sync: {format(date, 'HH:mm:ss')}</div>
        </div>
      </div>
      
      <div className="glass p-8 text-sm text-moon-white/50 border border-white/5 relative overflow-hidden flex items-start gap-4">
        <Info size={24} className="text-celestial-blue shrink-0" />
        <div className="space-y-1">
          <p className="font-black uppercase text-[10px] tracking-widest text-white/40">Observation Tip</p>
          <p className="font-medium text-xs leading-relaxed">Map coordinates are rendered geocentrically based on your selected station. Adjust the star field to visualize planetary retrogrades and upcoming alignments over the Pakistani horizon.</p>
        </div>
      </div>
    </div>
  );
};
