
import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface PatternGridProps {
  value: string; // Stored as "0,1,2,5"
  onChange: (val: string) => void;
  readOnly?: boolean;
}

const PatternGrid: React.FC<PatternGridProps> = ({ value, onChange, readOnly = false }) => {
  const points = value ? value.split(',').filter(p => p !== '').map(Number) : [];
  const [playbackIndex, setPlaybackIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = (idx: number) => {
    if (readOnly || isPlaying) return;
    
    if (points.includes(idx)) {
      if (points[points.length - 1] === idx) {
        const newPoints = points.slice(0, -1);
        onChange(newPoints.join(','));
      }
      return;
    }
    
    const newPoints = [...points, idx];
    onChange(newPoints.join(','));
  };

  const handleReset = () => {
    if (isPlaying) return;
    onChange('');
    setPlaybackIndex(null);
  };

  const playPattern = () => {
    if (points.length === 0 || isPlaying) return;
    setIsPlaying(true);
    setPlaybackIndex(-1);

    let current = 0;
    const interval = setInterval(() => {
      setPlaybackIndex(current);
      current++;
      if (current >= points.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsPlaying(false);
          setPlaybackIndex(null);
        }, 800);
      }
    }, 450);
  };

  /**
   * Menggunakan ViewBox 300x300 untuk koordinat integer bulat.
   * Titik-titik berada pada: 50, 150, 250.
   * Menghindari angka desimal (seperti 16.67) mencegah glitch rendering sub-pixel.
   */
  const getCoords = (idx: number) => {
    const row = Math.floor(idx / 3);
    const col = idx % 3;
    const vals = [50, 150, 250]; 
    return { x: vals[col], y: vals[row] };
  };

  const generatePathData = () => {
    const activePoints = isPlaying 
      ? points.slice(0, (playbackIndex ?? -1) + 1)
      : points;

    if (activePoints.length === 0) return "";
    
    return activePoints.map((p, i) => {
      const { x, y } = getCoords(p);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[280px]">
      <div 
        ref={containerRef}
        className="relative aspect-square w-full p-0 bg-slate-950 rounded-[2.5rem] border border-slate-800/50 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden"
      >
        {/* 
          SVG Layer: Menggunakan 3 layer path alih-alih filter.
          Filter SVG sering kali memiliki glitch rendering pada path yang panjang atau kompleks.
          Layering manual menjamin ketebalan visual yang konsisten 100%.
        */}
        <svg 
          viewBox="0 0 300 300" 
          className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
          style={{ shapeRendering: 'geometricPrecision' }}
        >
          {points.length > 1 && (
            <g className="transition-opacity duration-300">
              {/* Layer 1: Outer Glow (Sangat Lebar & Transparan) */}
              <path
                d={generatePathData()}
                fill="none"
                stroke="#1d4ed8"
                strokeWidth="24"
                strokeOpacity="0.08"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Layer 2: Inner Glow (Sedang) */}
              <path
                d={generatePathData()}
                fill="none"
                stroke="#2563eb"
                strokeWidth="12"
                strokeOpacity="0.15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Layer 3: Main Line (Garis Inti - Tebal Konsisten) */}
              <path
                d={generatePathData()}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}
        </svg>

        {/* Dots Grid Overlay */}
        <div className="grid grid-cols-3 grid-rows-3 h-full w-full relative z-20">
          {[...Array(9)].map((_, i) => {
            const order = points.indexOf(i);
            const isActive = order !== -1;
            const isCurrentlyPlaying = isPlaying && points[playbackIndex!] === i;
            const isLast = !isPlaying && points.length > 0 && points[points.length - 1] === i;
            
            return (
              <div key={i} className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleToggle(i)}
                  className="group relative w-16 h-16 flex items-center justify-center outline-none"
                >
                  {/* Dot Visual - Dibuat lebih kontras dengan background gelap */}
                  <div className={`
                    w-2.5 h-2.5 rounded-full transition-all duration-300 relative z-10
                    ${isActive 
                      ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                      : 'bg-slate-800 group-hover:bg-slate-700'}
                    ${isCurrentlyPlaying ? 'scale-150 ring-4 ring-blue-500/20 bg-blue-400' : ''}
                  `} />
                  
                  {/* Step Order Number */}
                  {isActive && !isPlaying && (
                    <span className="absolute bottom-2 text-[8px] font-bold text-slate-500 uppercase tracking-tighter">
                      {order + 1}
                    </span>
                  )}

                  {/* Pulsing Aura for Undo Target */}
                  {isLast && !readOnly && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 rounded-full border border-blue-500/10 animate-pulse bg-blue-500/5" />
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 w-full px-1">
        <button 
          type="button" 
          onClick={playPattern}
          disabled={isPlaying || points.length < 2}
          className="flex-1 flex items-center justify-center gap-3 py-3.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-400 hover:text-blue-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-800"
        >
          {isPlaying ? 'PLAYING...' : <><Play size={12} fill="currentColor" /> Playback</>}
        </button>
        
        {!readOnly && (
          <button 
            type="button" 
            onClick={handleReset}
            disabled={isPlaying || points.length === 0}
            className="px-5 py-3.5 bg-slate-900 hover:bg-red-950/30 text-slate-600 hover:text-red-500 rounded-2xl transition-all border border-slate-800 disabled:opacity-20"
          >
            <RotateCcw size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default PatternGrid;
