import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../App';
import { AstronomyService } from '../services/astronomyService';
import { AstroEvent } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Telescope, Eye, Moon, Zap, Circle, Star } from 'lucide-react';
import { translations } from '../translations';

const getEventMeta = (event: AstroEvent, lang: 'en' | 'ur') => {
  const t = translations[lang];
  const isLunar = event.name.toLowerCase().includes('lunar eclipse');

  const base = {
    Eclipse: { desc: t.descEclipse, equipment: t.noEquipment, equipBadge: 'badge-red', icon: <Circle size={13} />, color: 'text-red-400', border: 'border-l-red-500/70', bg: 'rgba(239,68,68,0.05)' },
    'Lunar Eclipse': { desc: t.descLunarEclipse, equipment: t.noEquipment, equipBadge: 'badge-green', icon: <Moon size={13} />, color: 'text-orange-400', border: 'border-l-orange-500/70', bg: 'rgba(249,115,22,0.05)' },
    'Meteor Shower': { desc: t.descMeteorShower, equipment: t.noEquipment, equipBadge: 'badge-green', icon: <Zap size={13} />, color: 'text-purple-400', border: 'border-l-purple-500/70', bg: 'rgba(168,85,247,0.05)' },
    Moon: { desc: t.descMoon, equipment: t.noEquipment, equipBadge: 'badge-green', icon: <Moon size={13} />, color: 'text-blue-300', border: 'border-l-blue-400/70', bg: 'rgba(147,197,253,0.04)' },
    Planet: { desc: t.descPlanet, equipment: 'Binoculars', equipBadge: 'badge-cyan', icon: <Star size={13} />, color: 'text-cyan-400', border: 'border-l-cyan-500/70', bg: 'rgba(34,211,238,0.04)' },
    Other: { desc: t.descOther, equipment: t.noEquipment, equipBadge: 'badge-blue', icon: <Star size={13} />, color: 'text-white/40', border: 'border-l-white/20', bg: 'rgba(255,255,255,0.02)' },
  };

  if (isLunar) return base['Lunar Eclipse'];
  return base[event.type as keyof typeof base] || base['Other'];
};

export const Calendar: React.FC = () => {
  const { city, lang, navigateTo } = useApp();
  const t = translations[lang];
  const astro = useMemo(() => new AstronomyService(city), [city]);
  const [events, setEvents] = useState<AstroEvent[]>([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    astro.getEventsForYear(new Date().getFullYear()).then(evts => {
      setEvents(evts.filter(e => e.date >= new Date()));
      setLoading(false);
    });
  }, [astro]);

  const filtered = useMemo(() => {
    if (filter === 'All') return events;
    if (filter === 'Eclipse') return events.filter(e => e.type === 'Eclipse');
    if (filter === 'Meteor Shower') return events.filter(e => e.type === 'Meteor Shower');
    if (filter === 'Moon') return events.filter(e => e.type === 'Moon');
    return events;
  }, [events, filter]);

  const filters = [
    { key: 'All', label: t.all },
    { key: 'Eclipse', label: t.eclipse },
    { key: 'Meteor Shower', label: t.meteorShower },
    { key: 'Moon', label: t.moonFilter },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="pt-4 space-y-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-void-cyan/60">
          {city.name} · Pakistan · {new Date().getFullYear()}
        </p>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
          <span className="cosmic-text">{lang === 'ur' ? 'پاکستان' : 'Pakistan'}</span>{' '}
          <span className="text-white/80">{lang === 'ur' ? 'آسمانی واقعات' : 'Sky Events'}</span>
        </h1>
        <p className="text-white/30 text-sm pt-1">{t.eventsSubtitle}</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
              filter === f.key
                ? 'bg-celestial-blue border-celestial-blue text-white'
                : 'bg-white/4 border-white/8 text-white/40 hover:text-white hover:border-white/20'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-20 text-white/20 text-xs font-black uppercase tracking-widest animate-pulse">
          {t.computingEvents} {city.name}...
        </div>
      )}

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((event, idx) => {
            const meta = getEventMeta(event, lang);
            const visColor = event.visibility === 'Excellent' ? 'badge-green' : event.visibility === 'Good' ? 'badge-gold' : 'badge-red';

            return (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ delay: idx * 0.03 }}
                className={`event-card border-l-4 ${meta.border}`}
                style={{ background: `linear-gradient(135deg, ${meta.bg} 0%, rgba(255,255,255,0.015) 100%)` }}
              >
                <div className="p-5 md:p-6">
                  <div className="flex flex-col md:flex-row gap-5">

                    {/* Left: type + name + date */}
                    <div className="md:w-48 shrink-0">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className={meta.color}>{meta.icon}</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/25">{event.type}</span>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-stardust-gold/70 mb-1">
                        {format(event.date, 'MMM dd, yyyy')}
                      </p>
                      <h2 className="text-xl font-black uppercase leading-tight tracking-tight text-white">
                        {lang === 'ur' ? event.nameUrdu : event.name}
                      </h2>
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/25 mt-2">
                        {t.bestViewing}: {format(event.peakTime, 'hh:mm aa')}
                      </p>
                    </div>

                    {/* Middle: description + badges + bar */}
                    <div className="flex-1 space-y-3">
                      <p className="text-white/45 text-sm leading-relaxed">{meta.desc}</p>

                      <div className="text-[9px] font-black uppercase tracking-widest">
                        <span className="text-white/25">{t.bestViewing} · </span>
                        <span className="text-void-cyan">
                          {format(event.startTime, 'hh:mm aa')} – {format(event.endTime, 'hh:mm aa')}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        <span className={`badge ${visColor}`}>
                          <Eye size={7} /> {event.visibility}
                        </span>
                        <span className={`badge ${meta.equipBadge}`}>{meta.equipment}</span>
                        <span className={`badge ${event.moonInterference ? 'badge-red' : 'badge-green'}`}>
                          <Moon size={7} /> {event.moonInterference ? t.moonInterference : t.darkSky}
                        </span>
                      </div>

                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/20">
                          <span>{t.height}</span>
                          <span className={meta.color}>{event.altitude}°</span>
                        </div>
                        <div className="w-full h-px bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(0, (event.altitude / 90) * 100)}%` }}
                            transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.03 }}
                            className="h-full bg-gradient-to-r from-celestial-blue to-nebula-purple"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right: Navigate */}
                    <div className="flex md:flex-col items-center justify-end border-t md:border-t-0 md:border-l border-white/5 pt-3 md:pt-0 md:pl-5 shrink-0">
                      <button
                        onClick={() => navigateTo('can-i-see-it', event)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all bg-celestial-blue/10 hover:bg-celestial-blue/25 border border-celestial-blue/25 hover:border-celestial-blue/50 text-celestial-blue group"
                      >
                        <Telescope size={13} className="group-hover:scale-110 transition-transform" />
                        {t.navigate}
                      </button>
                    </div>

                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-white/15 text-xs font-black uppercase tracking-widest">
            No events found
          </div>
        )}
      </div>
    </div>
  );
};
