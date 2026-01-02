
import React from 'react';
import { Trash2, AlertCircle, X } from 'lucide-react';

interface DeleteItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemTitle: string;
}

const DeleteItemModal: React.FC<DeleteItemModalProps> = ({ isOpen, onClose, onConfirm, itemTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <AlertCircle className="text-red-500" size={32} />
          </div>
          
          <h2 className="text-xl font-bold text-white mb-2">Hapus Rahasia?</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8 px-2">
            Apakah Anda yakin ingin menghapus <span className="text-slate-200 font-bold">"{itemTitle}"</span>? Tindakan ini tidak dapat dibatalkan.
          </p>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-xs font-bold uppercase tracking-widest transition-colors"
            >
              Batal
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 px-4 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-red-900/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <Trash2 size={14} /> Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteItemModal;
