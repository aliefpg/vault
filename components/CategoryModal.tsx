
import React, { useState, useEffect } from 'react';
import { X, Palette } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, color: string) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-blue-500');

  // Reset form saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setName('');
      setSelectedColor('bg-blue-500');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const colors = [
    'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-red-500', 
    'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-lime-500', 
    'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500',
    'bg-indigo-500', 'bg-violet-500', 'bg-fuchsia-500', 'bg-rose-500'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim(), selectedColor);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <Palette className="text-blue-500" size={20} /> Kategori Baru
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Nama Kategori</label>
            <input 
              type="text" 
              required
              autoFocus
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
              placeholder="Misal: Belanja, Sosmed..."
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 ml-1">Warna Aksen</label>
            <div className="grid grid-cols-4 gap-3">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`
                    w-full aspect-square rounded-xl transition-all relative
                    ${color} 
                    ${selectedColor === color ? 'ring-2 ring-white ring-offset-4 ring-offset-slate-900 scale-90' : 'hover:scale-105'}
                  `}
                >
                  {selectedColor === color && (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <div className="w-1.5 h-1.5 rounded-full bg-white shadow-lg" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-xs font-black text-white shadow-xl shadow-blue-900/20 uppercase tracking-[0.2em] transition-all"
          >
            Buat Kategori
          </button>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
