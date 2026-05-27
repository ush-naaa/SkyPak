import React, { useMemo, useState, useEffect } from 'react';

export const StarField: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const layers = useMemo(() => {
    return [
      {
        count: 100,
        parallax: 0.2,
        size: [0.5, 1],
        opacity: 0.3,
      },
      {
        count: 70,
        parallax: 0.5,
        size: [1, 1.5],
        opacity: 0.5,
      },
      {
        count: 30,
        parallax: 1.2,
        size: [1.5, 2.5],
        opacity: 0.8,
      },
    ].map((layer, layerIdx) => ({
      ...layer,
      stars: Array.from({ length: layer.count }).map((_, i) => ({
        id: `${layerIdx}-${i}`,
        left: `${Math.random() * 105 - 2.5}%`,
        top: `${Math.random() * 105 - 2.5}%`,
        size: Math.random() * (layer.size[1] - layer.size[0]) + layer.size[0],
        duration: `${Math.random() * 4 + 3}s`,
        delay: `${Math.random() * 10}s`,
      })),
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#06060f]">
      {/* Static Noise / Grain */}
      <div className="absolute inset-0 opacity-[0.03] z-[1]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Ffilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/feTurbulence%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      {/* Nebula Layers */}
      <div className="nebula-glow top-[-20%] right-[-10%] w-[600px] h-[600px] bg-glitch-cyan/10" />
      <div className="nebula-glow bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-glitch-magenta/5" />
      <div className="nebula-glow top-[30%] left-[20%] w-[400px] h-[400px] bg-glitch-yellow/5" />

      {/* Static Starfield Grid Mockup for depth */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(white_1px,transparent_1px)] bg-[length:50px_50px]" />
      
      {layers.map((layer, idx) => (
        <div
          key={idx}
          className="absolute inset-0 transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${-mousePos.x * layer.parallax}px, ${-mousePos.y * layer.parallax}px)`,
          }}
        >
          {layer.stars.map((star) => (
            <div
              key={star.id}
              className="star"
              style={{
                left: star.left,
                top: star.top,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: layer.opacity,
                // @ts-ignore
                '--duration': star.duration,
                '--delay': star.delay,
              } as any}
            />
          ))}
        </div>
      ))}
      
      <div className="absolute inset-0 crt-lines" />
    </div>
  );
};
