import React, { useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Loader2, 
  AlertCircle, 
  X, 
  ShieldCheck,
  FileJson,
  Database,
  SearchCheck,
  LayoutDashboard
} from 'lucide-react';

interface ImportStatusModalProps {
  status: {
    isActive: boolean;
    step: number;
    message: string;
    isError: boolean;
    logs: string[];
  };
  onClose: () => void;
}

const ImportStatusModal: React.FC<ImportStatusModalProps> = ({ status, onClose }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [status.logs]);

  const steps = [
    { id: 1, label: 'Membaca File', icon: <FileJson size={18} /> },
    { id: 2, label: 'Parsing Struktur', icon: <SearchCheck size={18} /> },
    { id: 3, label: 'Validasi Item', icon: <ShieldCheck size={18} /> },
    { id: 5, label: 'Update Brankas', icon: <Database size={18} /> },
    { id: 7, label: 'Selesai', icon: <LayoutDashboard size={18} /> }
  ];

  const progressPercentage = Math.min((status.step / 7) * 100, 100);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${status.isError ? 'bg-red-500/10 text-red-500' : 'bg-blue-600/10 text-blue-500'}`}>
              {status.isError ? <AlertCircle size={24} /> : <Loader2 size={24} className="animate-spin" />}
            </div>
            <div>
              <h2 className="text-xl font-black text-white leading-tight">Proses Impor Data</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Status: {status.isError ? 'Gagal' : 'Berjalan'}</p>
            </div>
          </div>
          {(status.isError || status.step === 7) && (
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-500">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-8 space-y-8">
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Kemajuan Keseluruhan</span>
              <span className="text-sm font-black text-white">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div 
                className={`h-full transition-all duration-500 ease-out ${status.isError ? 'bg-red-600' : 'bg-gradient-to-r from-blue-600 to-indigo-500'}`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Steps Visualizer */}
          <div className="grid grid-cols-5 gap-2 relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-800 -z-10 mx-6" />
            {steps.map((step) => {
              const isCompleted = status.step > step.id || (status.step === 7 && step.id === 7);
              const isActive = status.step === step.id;
              
              return (
                <div key={step.id} className="flex flex-col items-center gap-3">
                  <div className={`
                    w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300
                    ${isCompleted ? 'bg-green-500 text-white scale-90' : isActive ? 'bg-blue-600 text-white ring-4 ring-blue-500/20' : 'bg-slate-800 text-slate-600'}
                  `}>
                    {isCompleted ? <CheckCircle2 size={20} /> : step.icon}
                  </div>
                  <span className={`text-[8px] font-black uppercase text-center leading-tight tracking-tighter ${isActive ? 'text-white' : 'text-slate-600'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Console Log */}
          <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Log Aktivitas Sistem</p>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 h-40 overflow-y-auto custom-scrollbar font-mono text-[11px] space-y-2">
              {status.logs.map((log, i) => (
                <div key={i} className={`flex gap-3 ${i === status.logs.length - 1 ? 'animate-pulse text-white' : 'text-slate-500'}`}>
                  <span className="text-slate-700 font-bold">[{new Date().toLocaleTimeString('id-ID', { hour12: false })}]</span>
                  <span className="break-all">{log}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>

          {/* Action Footer inside Modal */}
          {status.isError ? (
            <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-2xl flex items-start gap-4 animate-in slide-in-from-bottom-2">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
              <div className="space-y-1">
                <p className="text-xs font-bold text-red-500 uppercase tracking-wide">Terjadi Masalah</p>
                <p className="text-xs text-slate-400 leading-relaxed">{status.message}</p>
                <button 
                  onClick={onClose}
                  className="mt-4 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase rounded-xl transition-all"
                >
                  Tutup & Perbaiki
                </button>
              </div>
            </div>
          ) : status.step === 7 ? (
            <div className="bg-green-500/5 border border-green-500/20 p-5 rounded-2xl flex items-start gap-4 animate-in slide-in-from-bottom-2">
              <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={18} />
              <div className="space-y-1">
                <p className="text-xs font-bold text-green-500 uppercase tracking-wide">Impor Berhasil</p>
                <p className="text-xs text-slate-400 leading-relaxed">Seluruh data telah diverifikasi dan masuk ke brankas Anda.</p>
                <button 
                  onClick={onClose}
                  className="mt-4 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase rounded-xl transition-all shadow-lg shadow-blue-900/20"
                >
                  Lihat Dashboard
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-[10px] text-slate-600 italic">Harap tunggu, sistem sedang memverifikasi data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportStatusModal;