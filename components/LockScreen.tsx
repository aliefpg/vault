
import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight, Eye, EyeOff, AlertCircle, KeyRound, ShieldAlert } from 'lucide-react';

interface LockScreenProps {
  onUnlock: () => void;
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [storedMasterPassword] = useState<string | null>(localStorage.getItem('vault_master_key'));
  const [input, setInput] = useState('');
  const [confirmInput, setConfirmInput] = useState('');
  const [isSettingUp] = useState(!storedMasterPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSettingUp) {
      if (input.length < 4) {
        setError('Sandi minimal 4 karakter demi keamanan.');
        triggerShake();
        return;
      }
      if (input !== confirmInput) {
        setError('Konfirmasi sandi tidak sesuai.');
        triggerShake();
        return;
      }
      localStorage.setItem('vault_master_key', input);
      onUnlock();
    } else {
      if (input === storedMasterPassword) {
        onUnlock();
      } else {
        setError('Kata sandi salah! Akses ditolak.');
        setInput('');
        triggerShake();
      }
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="fixed inset-0 z-[999] bg-slate-950 flex items-center justify-center p-6 overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />

      <div className={`
        w-full max-w-md bg-slate-900/40 border border-slate-800 p-8 sm:p-10 rounded-[3rem] backdrop-blur-xl shadow-2xl transition-transform duration-500
        ${shake ? 'animate-shake' : ''}
      `}>
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-900/40 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            {isSettingUp ? <ShieldAlert className="text-white" size={40} /> : <ShieldCheck className="text-white" size={40} />}
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-2">
            {isSettingUp ? 'Setup Vault Baru' : 'Vault Terkunci'}
          </h1>
          <p className="text-slate-400 text-sm">
            {isSettingUp 
              ? 'Tentukan kata sandi utama untuk mengamankan seluruh data Anda.' 
              : 'Masukkan sandi utama untuk membuka brankas rahasia Anda.'}
          </p>
        </div>

        <form onSubmit={handleAction} className="space-y-4">
          <div className="space-y-4">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type={showPassword ? "text" : "password"}
                autoFocus
                placeholder={isSettingUp ? "Sandi Baru" : "Masukkan Sandi"}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-center tracking-[0.2em]"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {isSettingUp && (
              <div className="relative group animate-in slide-in-from-top-2">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Konfirmasi Sandi"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-center tracking-[0.2em]"
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                />
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-2xl text-xs font-bold border border-red-400/20 animate-in fade-in zoom-in-95">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-900/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isSettingUp ? 'Buat Vault' : 'Buka Brankas'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-800/50 text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black flex items-center justify-center gap-2">
            <ShieldCheck size={12} className="text-blue-500" /> SecureVault • End-to-End Encryption
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-8px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LockScreen;
