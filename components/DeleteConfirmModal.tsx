
import React, { useState } from 'react';
import { AlertTriangle, ChevronDown } from 'lucide-react';
import { Category } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (targetId?: string) => void;
  title: string;
  message: string;
  itemCount: number;
  availableCategories: Category[];
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  itemCount,
  availableCategories
}) => {
  // Pilih 'uncategorized' secara default jika ada
  const systemCat = availableCategories.find(c => c.id === 'uncategorized');
  const [targetId, setTargetId] = useState<string>(systemCat?.id || availableCategories[0]?.id || '');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          
          <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            {message}
          </p>

          {itemCount > 0 && (
            <div className="mb-8 text-left bg-slate-800/50 p-5 rounded-2xl border border-slate-700">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                Pindahkan {itemCount} data ke folder khusus:
              </label>
              <div className="relative">
                <select 
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all cursor-pointer"
                >
                  {availableCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.id === 'uncategorized' ? `📥 ${cat.name}` : cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
              </div>
              <p className="mt-3 text-[10px] text-amber-500/80 italic leading-snug">
                * Item akan dipindahkan ke folder yang Anda pilih agar tidak terhapus secara permanen.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition-colors"
            >
              Batal
            </button>
            <button 
              onClick={() => onConfirm(itemCount > 0 ? targetId : undefined)}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-red-900/20 active:scale-95"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
