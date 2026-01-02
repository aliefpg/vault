
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
  Lock
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

  return (
    <div className="bg-slate-900/40 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 transition-all group shadow-sm flex flex-col h-fit">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700">
            {getIcon()}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-100 leading-tight truncate">{entry.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap">{entry.type}</span>
              <span className={`w-1 h-1 rounded-full bg-slate-800`} />
              <span className={`text-[9px] font-black uppercase tracking-widest truncate ${category?.color.replace('bg-', 'text-') || 'text-slate-500'}`}>
                {category?.name || 'Uncategorized'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={onEdit} className="p-2 text-slate-600 hover:text-blue-400 hover:bg-blue-400/5 rounded-xl transition-all">
            <Edit3 size={15} />
          </button>
          <button onClick={onDelete} className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {/* TAMPILAN USERNAME UNTUK PASSWORD */}
        {entry.type === EntryType.PASSWORD && entry.username && (
          <div className="bg-slate-950/30 border border-slate-800/50 rounded-xl px-3 py-2 flex items-center justify-between group/user">
            <div className="flex items-center gap-2 min-w-0 overflow-hidden">
              <User size={12} className="text-slate-600 shrink-0" />
              <span className="text-xs text-slate-400 truncate">{entry.username}</span>
            </div>
            <button onClick={handleCopyUsername} className="p-1 text-slate-700 hover:text-blue-400 transition-colors">
              {userCopied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
            </button>
          </div>
        )}

        {/* TAMPILAN NILAI UTAMA (PASSWORD/PIN/ETC) */}
        {(entry.type === EntryType.PATTERN || entry.type === EntryType.SEED_PHRASE) ? (
          <div className="space-y-3 pt-1">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs text-slate-500 hover:text-blue-400 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Eye size={14} />
                <span>{isExpanded ? 'Sembunyikan' : `Lihat ${entry.type}`}</span>
              </div>
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {isExpanded && (
              <div className="animate-in slide-in-from-top-2 duration-200">
                {entry.type === EntryType.PATTERN ? (
                  <div className="py-2 flex justify-center bg-slate-950/40 rounded-2xl border border-slate-800/50">
                    <PatternGrid value={entry.value} onChange={() => {}} readOnly={true} />
                  </div>
                ) : (
                  renderSeedPhrase()
                )}
                
                <button 
                  onClick={handleCopyValue}
                  className="w-full mt-3 py-2.5 bg-slate-800/50 hover:bg-slate-800 rounded-xl text-[10px] font-bold text-slate-400 flex items-center justify-center gap-2 transition-all border border-slate-700/50"
                >
                  {copied ? <><Check size={12} className="text-green-500" /> Tersalin!</> : <><Copy size={12} /> Salin Semua Kata</>}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="relative bg-slate-950/50 border border-slate-800 rounded-xl p-3 flex items-center justify-between group/val">
            <div className="flex-1 truncate mr-2 flex items-center gap-2">
              <Lock size={12} className="text-slate-700 shrink-0" />
              {showValue ? (
                <span className="text-sm font-mono text-blue-300 break-all">{entry.value}</span>
              ) : (
                <span className="text-slate-700 tracking-[0.3em] text-xs">••••••••••••</span>
              )}
            </div>
            
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => setShowValue(!showValue)} className="p-1.5 text-slate-600 hover:text-slate-300 transition-colors">
                {showValue ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button onClick={handleCopyValue} className="p-1.5 text-slate-600 hover:text-blue-400 transition-colors">
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        )}
      </div>

      {entry.notes && (
        <p className="text-[10px] text-slate-500 italic mt-3 bg-slate-800/20 p-2.5 rounded-xl border border-slate-800/40 line-clamp-2 leading-relaxed">
          {entry.notes}
        </p>
      )}

      <div className="flex items-center justify-between text-[9px] text-slate-600 font-bold mt-4 pt-4 border-t border-slate-800/50 uppercase tracking-tighter">
        <span className="flex items-center gap-1">
          <Calendar size={10} /> {new Date(entry.createdAt).toLocaleDateString()}
        </span>
        {entry.lastModified !== entry.createdAt && <span className="text-blue-500/50 italic text-[8px]">Updated</span>}
      </div>
    </div>
  );
};

export default EntryCard;
