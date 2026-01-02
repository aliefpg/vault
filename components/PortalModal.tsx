
import React, { useState, useEffect } from 'react';
import { X, Globe, ExternalLink, Type } from 'lucide-react';
import { PortalLink } from '../types';

interface PortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<PortalLink>) => void;
  initialData?: PortalLink | null;
}

const PortalModal: React.FC<PortalModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<PortalLink>>({
    title: '',
    url: '',
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ title: '', url: '', description: '' });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.url) {
      alert("Harap isi Judul dan URL Website");
      return;
    }
    
    let finalUrl = formData.url;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    onSave({ ...formData, url: finalUrl });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <div className="bg-indigo-600/20 p-2 rounded-xl text-indigo-500">
              <Globe size={20} />
            </div>
            {initialData ? 'Edit Website' : 'Tambah Portal Baru'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Judul Website</label>
            <input 
              type="text" 
              required
              autoFocus
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
              placeholder="Contoh: Portfolio Saya, Web Toko..."
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">URL Website</label>
            <div className="relative group">
              <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={16} />
              <input 
                type="text" 
                required
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-5 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500/40 transition-all"
                placeholder="example.com"
                value={formData.url}
                onChange={e => setFormData(prev => ({ ...prev, url: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Keterangan Singkat</label>
            <textarea 
              rows={3}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all resize-none"
              placeholder="Jelaskan sedikit tentang web ini..."
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-4 border border-slate-700 rounded-2xl text-xs font-bold text-slate-400 uppercase tracking-widest hover:bg-slate-800 transition-all"
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-xs font-black text-white shadow-xl shadow-indigo-900/20 uppercase tracking-[0.2em] transition-all"
            >
              {initialData ? 'Simpan' : 'Tambahkan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PortalModal;
