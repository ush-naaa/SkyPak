import React from 'react';
import { useApp } from '../App';
import { PAKISTANI_DARK_SKY_SITES } from '../data/darkSkySites';
import { MapPin, Star, Shield, Info } from 'lucide-react';
import { motion } from 'motion/react';

export const DarkSkyExplorer: React.FC = () => {
  const { lang, city } = useApp();

  return (
    <div className="space-y-12 pb-12">
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-celestial-blue/10 flex items-center justify-center border border-celestial-blue/20">
            <Shield className="text-celestial-blue" size={24} />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter cosmic-text">
            {lang === 'ur' ? 'ڈارک اسکائی ایکسپلورر' : 'Sanctuary Explorer'}
          </h2>
        </div>
        <p className="text-moon-white/40 max-w-2xl font-medium leading-relaxed">
          {lang === 'ur' 
            ? 'پاکستان کے بہترین مقامات تلاش کریں جہاں سے آپ بالکل صاف آسمان اور کہکشاں دیکھ سکتے ہیں۔'
            : 'Cataloging Pakistan\'s most pristine celestial sanctuaries. Sites where the cosmic horizon remains untouched by industrial illumination.'}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {PAKISTANI_DARK_SKY_SITES.map((site, idx) => (
            <motion.div
              key={site.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-8 group hover:border-white/20 transition-all cursor-default relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-celestial-blue/5 blur-[60px] pointer-events-none group-hover:bg-celestial-blue/10 transition-all" />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white group-hover:text-celestial-blue transition-colors">
                    {lang === 'ur' ? site.nameUrdu : site.name}
                  </h3>
                  <div className="flex items-center gap-3 text-[10px] font-black text-celestial-blue/50 uppercase tracking-widest mt-1">
                    <MapPin size={12} />
                    {site.region} • {site.lat}°N, {site.lng}°E
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-[9px] font-black uppercase opacity-20 tracking-widest">Bortle Class</div>
                  <div className={`text-4xl font-black leading-none mt-1 ${site.bortle <= 2 ? 'text-green-400' : 'text-stardust-gold'}`}>
                    {site.bortle}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-moon-white/50 leading-relaxed mb-8 font-medium">
                {site.description}
              </p>

              <div className="grid grid-cols-2 gap-6 border-t border-white/5 pt-6">
                 <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase opacity-20 tracking-widest">Transparency</span>
                    <span className="text-xs font-black uppercase tracking-wider text-white/70">{site.bortle === 1 ? 'Pristine' : site.bortle === 2 ? 'Truly Dark' : 'Rural'}</span>
                 </div>
                 <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase opacity-20 tracking-widest">Primary Targets</span>
                    <span className="text-xs font-black uppercase tracking-wider text-white/70">Zodiacal Light, DSOs</span>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-8">
          <div className="glass p-10 bg-celestial-blue/5 border border-celestial-blue/20 rounded-[40px]">
            <h4 className="text-xl font-black uppercase mb-8 flex items-center gap-3 cosmic-text">
              <Star size={24} className="text-stardust-gold animate-pulse" />
              {lang === 'ur' ? 'بورتل اسکیل کیا ہے؟' : 'The Bortle Protocol'}
            </h4>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-black border border-green-500/30 flex items-center justify-center font-black text-xl text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]">1</div>
                <div className="space-y-1">
                  <div className="font-black text-sm uppercase tracking-wider">Absolute Void</div>
                  <p className="text-xs opacity-40 leading-relaxed font-medium">Pristine sky. The Milky Way casts shadows. Airglow is readily visible. Andromeda is a brilliant naked-eye target.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-black border border-celestial-blue/30 flex items-center justify-center font-black text-xl text-celestial-blue shadow-[0_0_20px_rgba(56,103,214,0.1)]">4</div>
                <div className="space-y-1">
                  <div className="font-black text-sm uppercase tracking-wider">Rural Transition</div>
                  <p className="text-xs opacity-40 leading-relaxed font-medium">Common for Ziarat or Shogran. Light pollution domes visible at horizon. Milky Way detailed but lacks structured shadows.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-black border border-red-500/30 flex items-center justify-center font-black text-xl text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]">8+</div>
                <div className="space-y-1">
                  <div className="font-black text-sm uppercase tracking-wider">Metropolitan Saturated</div>
                  <p className="text-xs opacity-40 leading-relaxed font-medium">Karachi/Lahore centers. Sky is gray/orange. Only the Moon and planets transcend the light veil.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-10 relative overflow-hidden group rounded-[40px] border-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-celestial-blue/5 via-transparent to-transparent pointer-events-none" />
            <h4 className="text-xl font-black uppercase mb-6 flex items-center gap-3">
              <Info size={24} className="text-celestial-blue" />
              {lang === 'ur' ? 'مشاہدے کے لیے تجاویز' : 'Expedition Protocol'}
            </h4>
            <ul className="text-xs space-y-4 font-black tracking-widest opacity-40 uppercase list-none">
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-celestial-blue rounded-full" /> RED LIGHTS ONLY</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-celestial-blue rounded-full" /> LUNAR CALENDAR SYNC REQUIRED</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-celestial-blue rounded-full" /> 30-MIN ADAPTATION PERIOD</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-celestial-blue rounded-full" /> CACHED CARTOGRAPHY FOR OFF-GRID SITES</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
