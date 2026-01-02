
import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  Key, 
  Globe, 
  Database, 
  HelpCircle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Search
} from 'lucide-react';

interface TourStep {
  target: string;
  title: string;
  content: string;
  icon: React.ReactNode;
  position: 'right' | 'left' | 'top' | 'bottom' | 'center';
  requireSidebar?: boolean;
  requireView?: 'vault' | 'portals';
  clearSelection?: boolean;
}

interface InteractiveTourProps {
  isActive: boolean;
  onClose: () => void;
  setSidebarOpen: (open: boolean) => void;
  setView: (view: 'vault' | 'portals') => void;
  setSelectedCategory: (id: string | null) => void;
}

const InteractiveTour: React.FC<InteractiveTourProps> = ({ 
  isActive, 
  onClose, 
  setSidebarOpen, 
  setView, 
  setSelectedCategory 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});
  const [arrowDirection, setArrowDirection] = useState<'up' | 'down' | 'left' | 'right'>('up');
  const [isReady, setIsReady] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const requestRef = useRef<number>(null);
  const lastX = useRef(0);
  
  const tourSteps: TourStep[] = [
    {
      target: 'center',
      title: 'Selamat Datang!',
      content: 'Izinkan saya memandu Anda mengamankan data rahasia dalam 6 langkah cepat. Selesaikan tour ini untuk mulai menggunakan aplikasi.',
      icon: <ShieldCheck className="text-blue-500" size={24} />,
      position: 'center'
    },
    {
      target: '[data-tour="sidebar-area"]',
      title: 'Navigasi Utama',
      content: 'Gunakan panel ini untuk berpindah antara Dashboard Brankas dan Web Portal.',
      icon: <Globe className="text-indigo-400" size={24} />,
      position: 'right',
      requireSidebar: true
    },
    {
      target: '[data-tour="add-folder-btn"]',
      title: 'Kelola Kategori',
      content: 'Buat folder kustom untuk memisahkan data Pekerjaan, Pribadi, atau Sosial Media.',
      icon: <Database className="text-purple-400" size={24} />,
      position: 'right',
      requireSidebar: true
    },
    {
      target: '[data-tour="add-entry-btn"]',
      title: 'Simpan Rahasia',
      content: 'Gunakan tombol ini untuk menyimpan Password, PIN, atau Pola. Semua data akan terenkripsi aman.',
      icon: <Key className="text-blue-500" size={24} />,
      position: 'bottom',
      requireView: 'vault',
      clearSelection: true
    },
    {
      target: '[data-tour="search-bar"]',
      title: 'Cari Apapun',
      content: 'Ketik nama akun atau judul data Anda di sini untuk menemukannya secara instan.',
      icon: <Search className="text-slate-400" size={24} />,
      position: 'bottom'
    },
    {
      target: '[data-tour="backup-area"]',
      title: 'Backup & Restore',
      content: 'Sangat penting! Selalu ekspor data Anda ke file JSON secara berkala agar tidak hilang jika perangkat bermasalah.',
      icon: <Database className="text-emerald-500" size={24} />,
      position: 'right',
      requireSidebar: true
    }
  ];

  const updatePosition = () => {
    if (!isActive) return;

    const step = tourSteps[currentStep];
    if (step.target === 'center') {
      setCoords(null);
      setTooltipPos({ top: 0, left: 0 });
      requestRef.current = requestAnimationFrame(updatePosition);
      return;
    }

    const el = document.querySelector(step.target);
    if (el) {
      const rect = el.getBoundingClientRect();
      
      // Stability check for sliding animations
      if (Math.abs(rect.left - lastX.current) > 0.5) {
        lastX.current = rect.left;
        requestRef.current = requestAnimationFrame(updatePosition);
        return;
      }

      if (rect.width === 0 || rect.height === 0 || rect.left < -150) {
        requestRef.current = requestAnimationFrame(updatePosition);
        return;
      }

      setCoords({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });

      const isMobile = window.innerWidth < 1024;
      const cardWidth = isMobile ? Math.min(260, window.innerWidth - 40) : 350;
      const cardHeight = isMobile ? 180 : 240; 
      const offset = isMobile ? 24 : 30;
      
      let tTop = 0;
      let tLeft = 0;
      let finalDir: 'up' | 'down' | 'left' | 'right' = 'up';
      
      const spaceBelow = window.innerHeight - (rect.top + rect.height);
      const spaceAbove = rect.top;
      const spaceRight = window.innerWidth - (rect.left + rect.width);
      const spaceLeft = rect.left;

      let preferredPos = step.position;

      // Smart Collision for Mobile
      if (isMobile) {
        if (preferredPos === 'right' || preferredPos === 'left') {
           // On mobile sidebar items, usually we want it bottom or top if space is tight
           if (spaceRight < cardWidth + offset && spaceLeft < cardWidth + offset) {
             preferredPos = spaceBelow > spaceAbove ? 'bottom' : 'top';
           }
        } else if (preferredPos === 'bottom' && spaceBelow < cardHeight + offset) {
           preferredPos = 'top';
        } else if (preferredPos === 'top' && spaceAbove < cardHeight + offset) {
           preferredPos = 'bottom';
        }
      }

      switch (preferredPos) {
        case 'right':
          tTop = rect.top + (rect.height / 2) - (cardHeight / 2);
          tLeft = rect.left + rect.width + offset;
          finalDir = 'left';
          break;
        case 'bottom':
          tTop = rect.top + rect.height + offset;
          tLeft = rect.left + (rect.width / 2) - (cardWidth / 2);
          finalDir = 'up';
          break;
        case 'top':
          tTop = rect.top - cardHeight - offset;
          tLeft = rect.left + (rect.width / 2) - (cardWidth / 2);
          finalDir = 'down';
          break;
        case 'left':
          tTop = rect.top + (rect.height / 2) - (cardHeight / 2);
          tLeft = rect.left - cardWidth - offset;
          finalDir = 'right';
          break;
      }

      // Clamping modal inside screen
      const screenPadding = 12;
      const finalLeft = Math.max(screenPadding, Math.min(tLeft, window.innerWidth - cardWidth - screenPadding));
      const finalTop = Math.max(screenPadding, Math.min(tTop, window.innerHeight - cardHeight - screenPadding - 10));

      setTooltipPos({ top: finalTop, left: finalLeft });
      setArrowDirection(finalDir);

      // Arrow position relative to modal
      const arrowStyleObj: React.CSSProperties = {};
      const arrowSize = isMobile ? 22 : 32;
      const arrowVisualGap = 8;

      if (finalDir === 'up') {
        arrowStyleObj.top = -arrowSize - arrowVisualGap;
        arrowStyleObj.left = (rect.left + rect.width / 2) - finalLeft - (arrowSize / 2);
        arrowStyleObj.left = Math.max(15, Math.min(arrowStyleObj.left as number, cardWidth - arrowSize - 15));
      } else if (finalDir === 'down') {
        arrowStyleObj.bottom = -arrowSize - arrowVisualGap;
        arrowStyleObj.left = (rect.left + rect.width / 2) - finalLeft - (arrowSize / 2);
        arrowStyleObj.left = Math.max(15, Math.min(arrowStyleObj.left as number, cardWidth - arrowSize - 15));
      } else if (finalDir === 'left') {
        arrowStyleObj.left = -arrowSize - arrowVisualGap;
        arrowStyleObj.top = (rect.top + rect.height / 2) - finalTop - (arrowSize / 2);
        arrowStyleObj.top = Math.max(15, Math.min(arrowStyleObj.top as number, cardHeight - arrowSize - 15));
      } else if (finalDir === 'right') {
        arrowStyleObj.right = -arrowSize - arrowVisualGap;
        arrowStyleObj.top = (rect.top + rect.height / 2) - finalTop - (arrowSize / 2);
        arrowStyleObj.top = Math.max(15, Math.min(arrowStyleObj.top as number, cardHeight - arrowSize - 15));
      }

      setArrowStyle(arrowStyleObj);
    }
    
    requestRef.current = requestAnimationFrame(updatePosition);
  };

  useEffect(() => {
    if (!isActive) return;

    const step = tourSteps[currentStep];
    setIsReady(false);

    if (step.requireSidebar) {
      setSidebarOpen(true);
      setTimeout(() => {
        const el = document.querySelector(step.target);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
    } else if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }

    if (step.requireView) {
      setView(step.requireView);
    }

    if (step.clearSelection) {
      setSelectedCategory(null);
    }

    const delay = window.innerWidth < 1024 ? 900 : 500;
    const timer = setTimeout(() => {
      setIsReady(true);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(updatePosition);
    }, delay);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      clearTimeout(timer);
    };
  }, [currentStep, isActive, setSidebarOpen, setView, setSelectedCategory]);

  if (!isActive) return null;

  const step = tourSteps[currentStep];
  const isMobile = window.innerWidth < 1024;

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <div 
      className="fixed inset-0 z-[300] overflow-hidden pointer-events-auto cursor-default"
      onClick={handleOverlayClick}
    >
      {/* Dynamic Backdrop Hole */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] transition-all duration-300 ease-out"
        style={{
          clipPath: coords ? `polygon(
            0% 0%, 
            0% 100%, 
            ${coords.left}px 100%, 
            ${coords.left}px ${coords.top}px, 
            ${coords.left + coords.width}px ${coords.top}px, 
            ${coords.left + coords.width}px ${coords.top + coords.height}px, 
            ${coords.left}px ${coords.top + coords.height}px, 
            ${coords.left}px 100%, 
            100% 100%, 
            100% 0%
          )` : 'none'
        }}
      />

      {/* Target Highlight Ring */}
      {coords && (
        <div 
          className="absolute border-2 border-blue-500 rounded-xl shadow-[0_0_40px_rgba(59,130,246,0.3)] z-10 pointer-events-none transition-all duration-300"
          style={{
            top: coords.top - 6,
            left: coords.left - 6,
            width: coords.width + 12,
            height: coords.height + 12
          }}
        >
           <div className="absolute inset-0 border border-blue-400/30 rounded-xl animate-ping" />
        </div>
      )}

      {/* Modal Tooltip */}
      <div 
        className={`
          absolute pointer-events-none transition-all duration-500 ease-out z-20
          w-full px-4 sm:px-0
          ${step.position === 'center' ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : ''}
        `}
        style={step.position !== 'center' ? {
          top: tooltipPos.top,
          left: tooltipPos.left,
          maxWidth: isMobile ? '260px' : '350px'
        } : {
          maxWidth: isMobile ? '280px' : '400px'
        }}
      >
        <div 
          className={`
            pointer-events-auto bg-slate-900 border border-slate-700 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.8)]
            transition-all duration-500 transform-gpu
            ${!isReady ? 'opacity-0 scale-90 translate-y-6' : 'opacity-100 scale-100 translate-y-0'}
            ${isShaking ? 'animate-shake-card' : ''}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Arrow Icon */}
          {coords && isReady && (
            <div 
              className="absolute pointer-events-none animate-bounce"
              style={arrowStyle}
            >
              {arrowDirection === 'up' && <ArrowUp className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" size={isMobile ? 22 : 32} />}
              {arrowDirection === 'down' && <ArrowDown className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" size={isMobile ? 22 : 32} />}
              {arrowDirection === 'left' && <ArrowLeft className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" size={isMobile ? 22 : 32} />}
              {arrowDirection === 'right' && <ArrowRight className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" size={isMobile ? 22 : 32} />}
            </div>
          )}

          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-2.5 bg-blue-600/10 rounded-xl text-blue-500 ring-1 ring-blue-500/20 shrink-0">
              {React.cloneElement(step.icon as React.ReactElement, { size: isMobile ? 16 : 24 })}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[11px] sm:text-base font-black text-white leading-tight mb-1 truncate">{step.title}</h4>
              <div className="flex gap-1">
                {tourSteps.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all duration-500 ${i === currentStep ? 'w-5 sm:w-10 bg-blue-500' : 'w-1 bg-slate-800'}`} 
                  />
                ))}
              </div>
            </div>
          </div>

          <p className="text-[10px] sm:text-sm text-slate-400 leading-relaxed mb-6 sm:mb-10 font-medium">
            {step.content}
          </p>

          <div className="flex items-center justify-between">
            <button 
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="flex items-center gap-1 text-[9px] sm:text-[11px] font-black text-slate-500 uppercase tracking-widest hover:text-white disabled:opacity-0 transition-all py-1 px-2"
            >
              <ChevronLeft size={14} /> Kembali
            </button>
            
            <button 
              onClick={() => {
                if (currentStep < tourSteps.length - 1) {
                  setCurrentStep(prev => prev + 1);
                } else {
                  onClose();
                }
              }}
              className="px-4 sm:px-7 py-2.5 sm:py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-[9px] sm:text-[11px] font-black uppercase tracking-widest rounded-xl sm:rounded-2xl shadow-xl shadow-blue-900/40 transition-all flex items-center gap-2 active:scale-95"
            >
              {currentStep === tourSteps.length - 1 ? 'Mulai' : 'Lanjut'} <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake-card {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px) rotate(-1deg); }
          40% { transform: translateX(4px) rotate(1deg); }
          60% { transform: translateX(-4px) rotate(-1deg); }
          80% { transform: translateX(4px) rotate(1deg); }
        }
        .animate-shake-card {
          animation: shake-card 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default InteractiveTour;
