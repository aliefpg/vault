
import React, { useState } from 'react';
import { 
  Key, 
  Hash, 
  Grid, 
  Copy, 
  Eye, 
  EyeOff, 
  Trash2, 
  Calendar,
  Edit3,
  Check,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  User,
  Lock,
  KeyRound,
  Globe
} from 'lucide-react';
import { VaultEntry, EntryType, Category } from '../types.ts';
import PatternGrid from './PatternGrid.tsx';

interface EntryCardProps {
  entry: VaultEntry;
  category?: Category;
  onDelete: () => void;
  onEdit: () => void;
}

const EntryCard: React.FC<EntryCardProps> = ({ entry, category, onDelete, onEdit }) => {
  const [showValue, setShowValue] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userCopied, setUserCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getIcon = () => {
    switch (entry.type) {
      case EntryType.PASSWORD: return <Key className="text-blue-400" size={20} />;
      case EntryType.PIN: return <Hash className="text-purple-400" size={20} />;
      case EntryType.SEED_PHRASE: return <ShieldCheck className="text-amber-400" size={20} />;
      case EntryType.PATTERN: return <Grid className="text-pink-400" size={20} />;
      case EntryType.SECRET_KEY: return <KeyRound className="text-emerald-400" size={20} />;
      default: return <Key size={20} />;
    }
  };

  const handleCopyValue = () => {
    navigator.clipboard.writeText(entry.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyUsername = () => {
    if (entry.username) {
      navigator.clipboard.writeText(entry.username);
      setUserCopied(true);
      setTimeout(() => setUserCopied(false), 2000);
    }
  };

  const renderSeedPhrase = () => {
    const words = entry.value.split(' ');
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
        {words.map((word, i) => (
          <div key={i} className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-lg border border-slate-800/50">
            <span className="text-[9px] font-bold text-slate-600 w-4">{i + 1}.</span>
            <span className="text-xs font-mono text-amber-200 truncate">{word}</span>
          </div>
        ))}
      </div>
    );
  };

  // Gabungkan status sensor: Jika pola dibuka (isExpanded), maka identitas juga terbuka
  const isIdentityVisible = showValue || isExpanded;

  return (
    <div className="bg-slate-900/40 border border-slate-800 hover:border-slate-700 rounded-[2rem] p-6 transition-all group shadow-sm flex flex-col h-fit relative overflow-hidden">
      {/* HEADER KARTU */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 shadow-inner">
            {getIcon()}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-white text-base leading-tight truncate">{entry.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[9px] font-black uppercase tracking-widest truncate ${category?.color.replace('bg-', 'text-') || 'text-slate-500'}`}>
                {category?.name || 'Umum'}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{entry.type}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={onEdit} className="p-2 text-slate-600 hover:text-blue-400 hover:bg-blue-400/5 rounded-xl transition-all">
            <Edit3 size={16} />
          </button>
          <button onClick={onDelete} className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* INFORMASI IDENTITAS (DENGAN SENSOR) */}
      <div className="space-y-3 mb-4">
        {/* TAMPILAN ISSUER UNTUK SECRET KEY */}
        {entry.type === EntryType.SECRET_KEY && entry.issuer && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-3 flex flex-col gap-1 ring-1 ring-emerald-500/5 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Globe size={10} /> Layanan / Issuer
              </span>
              <button onClick={() => setShowValue(!showValue)} className="text-emerald-500 hover:text-emerald-300 transition-colors">
                {showValue ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
            </div>
            <div className="truncate py-0.5">
              {isIdentityVisible ? (
                <span className="text-sm font-bold text-emerald-200 break-all leading-tight animate-in fade-in duration-300">
                  {entry.issuer}
                </span>
              ) : (
                <span className="text-emerald-900/40 tracking-[0.4em] text-xs font-bold italic">••••••••••••</span>
              )}
            </div>
          </div>
        )}

        {/* TAMPILAN USERNAME UNTUK PASSWORD & PATTERN */}
        {(entry.type === EntryType.PASSWORD || entry.type === EntryType.PATTERN) && entry.username && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl px-4 py-3 flex flex-col gap-1 ring-1 ring-blue-500/5 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                <User size={10} /> Identitas / User
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowValue(!showValue)} className="text-blue-500 hover:text-blue-300 transition-colors p-1">
                  {showValue ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
                <button onClick={handleCopyUsername} className="text-blue-500 hover:text-blue-300 transition-colors p-1">
                  {userCopied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                </button>
              </div>
            </div>
            <div className="truncate py-0.5">
              {isIdentityVisible ? (
                <span className="text-sm font-bold text-blue-200 break-all leading-tight animate-in fade-in duration-300">
                  {entry.username}
                </span>
              ) : (
                <span className="text-blue-900/40 tracking-[0.4em] text-xs font-bold italic">••••••••••••</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* TAMPILAN NILAI RAHASIA (DI SENSOR) */}
      <div className="mt-auto">
        {(entry.type === EntryType.PATTERN || entry.type === EntryType.SEED_PHRASE) ? (
          <div className="space-y-3">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
            >
              <div className="flex items-center gap-3">
                {isExpanded ? <EyeOff size={16} className="text-blue-400" /> : <Eye size={16} className="text-blue-500" />}
                <span>{isExpanded ? 'Sembunyikan' : `Lihat ${entry.type}`}</span>
              </div>
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {isExpanded && (
              <div className="animate-in slide-in-from-top-2 duration-300 pt-1">
                {entry.type === EntryType.PATTERN ? (
                  <div className="py-4 flex justify-center bg-slate-950 rounded-3xl border border-slate-800">
                    <PatternGrid value={entry.value} onChange={() => {}} readOnly={true} />
                  </div>
                ) : (
                  renderSeedPhrase()
                )}
                
                <button 
                  onClick={handleCopyValue}
                  className="w-full mt-3 py-3.5 bg-slate-800 hover:bg-slate-700 rounded-2xl text-[10px] font-black text-white flex items-center justify-center gap-2 transition-all uppercase tracking-widest"
                >
                  {copied ? <><Check size={14} className="text-green-500" /> Tersalin!</> : <><Copy size={14} /> Salin Rahasia</>}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between group/val">
            <div className="flex-1 truncate mr-3 flex flex-col gap-1">
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                <Lock size={10} /> {entry.type === EntryType.PIN ? 'Kode Keamanan' : 'Kata Sandi'}
              </span>
              <div className="truncate py-0.5">
                {showValue ? (
                  <span className={`text-sm font-mono break-all font-bold animate-in fade-in duration-300 ${entry.type === EntryType.SECRET_KEY ? 'text-emerald-400' : 'text-blue-400'}`}>{entry.value}</span>
                ) : (
                  <span className="text-slate-700 tracking-[0.4em] text-sm">••••••••••••</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => setShowValue(!showValue)} className="p-2 text-slate-600 hover:text-slate-300 transition-colors">
                {showValue ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <button onClick={handleCopyValue} className="p-2 text-slate-600 hover:text-blue-400 transition-colors">
                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CATATAN & FOOTER */}
      {entry.notes && (
        <p className="text-[10px] text-slate-500 italic mt-4 bg-slate-800/20 p-3 rounded-xl border border-slate-800/40 line-clamp-2 leading-relaxed">
          "{entry.notes}"
        </p>
      )}

      <div className="flex items-center justify-between text-[8px] text-slate-600 font-black mt-5 pt-4 border-t border-slate-800/50 uppercase tracking-widest">
        <span className="flex items-center gap-1.5">
          <Calendar size={10} /> Dibuat: {new Date(entry.createdAt).toLocaleDateString('id-ID')}
        </span>
        {entry.lastModified !== entry.createdAt && <span className="text-blue-500/40">Diperbarui</span>}
      </div>
    </div>
  );
};

export default EntryCard;
