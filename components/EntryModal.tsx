
import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, RotateCcw, User } from 'lucide-react';
import { EntryType, Category, VaultEntry } from '../types';
import PatternGrid from './PatternGrid';

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<VaultEntry>) => void;
  categories: Category[];
  initialData?: Partial<VaultEntry> | null;
}

const EntryModal: React.FC<EntryModalProps> = ({ isOpen, onClose, onSave, categories, initialData }) => {
  const [formData, setFormData] = useState<Partial<VaultEntry>>({
    title: '',
    type: EntryType.PASSWORD,
    categoryId: 'uncategorized',
    username: '',
    value: '',
    notes: '',
  });

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (isOpen && !hasInitialized.current) {
      const base = initialData || {};
      setFormData({
        title: base.title || '',
        type: base.type || EntryType.PASSWORD,
        categoryId: base.categoryId || categories[0]?.id || 'uncategorized',
        username: base.username || '',
        value: base.value || '',
        notes: base.notes || '',
        id: base.id
      });
      hasInitialized.current = true;
    } else if (!isOpen) {
      hasInitialized.current = false;
    }
  }, [isOpen, initialData, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || (!formData.value && formData.type !== EntryType.PATTERN)) {
      alert("Harap isi Judul dan Nilai Rahasia");
      return;
    }
    
    let finalValue = formData.value || '';
    if (formData.type === EntryType.SEED_PHRASE) {
      finalValue = finalValue.replace(/\s+/g, ' ').trim().toLowerCase();
    }

    onSave({ ...formData, value: finalValue });
  };

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let retVal = "";
    for (let i = 0, n = charset.length; i < 16; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    setFormData(prev => ({ ...prev, value: retVal }));
  };

  const handleTypeChange = (newType: EntryType) => {
    if (newType === formData.type) return;
    // Reset nilai hanya jika tipe berubah secara drastis
    setFormData(prev => ({ ...prev, type: newType, value: '' }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/50">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <div className="bg-blue-600/20 p-2 rounded-xl">
              <Lock className="text-blue-500" size={20} />
            </div>
            {formData.id ? 'Edit Rahasia' : `Simpan ${formData.type} Baru`}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Judul Item</label>
                <input 
                  type="text" required autoFocus
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-blue-500/40 transition-all text-white"
                  placeholder="Contoh: Akun Instagram, Gmail Kantor..."
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Tipe Data</label>
                <select 
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-blue-500/40 appearance-none text-white cursor-pointer"
                  value={formData.type}
                  onChange={e => handleTypeChange(e.target.value as EntryType)}
                >
                  {Object.values(EntryType).map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Kategori Folder</label>
                <select 
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-blue-500/40 appearance-none text-white cursor-pointer"
                  value={formData.categoryId}
                  onChange={e => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                >
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {formData.type === EntryType.PASSWORD && (
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Username / Email</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500" size={16} />
                    <input 
                      type="text" 
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:ring-2 focus:ring-blue-500/40 transition-all"
                      placeholder="nama@email.com atau username"
                      value={formData.username || ''}
                      onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  {formData.type === EntryType.SEED_PHRASE
                      ? 'Input Seed Phrase'
                      : formData.type === EntryType.PASSWORD
                      ? 'Input Password'
                      : formData.type === EntryType.PIN
                      ? 'Input PIN'
                      : formData.type === EntryType.PATTERN
                      ? 'Input Pattern'
                      : ''
                    }
                </label>
                {formData.type === EntryType.PASSWORD && (
                  <button type="button" onClick={generatePassword} className="text-[10px] text-blue-400 flex items-center gap-1.5 font-black uppercase">
                    <RotateCcw size={12} /> Auto Generate
                  </button>
                )}
              </div>
              
              {formData.type === EntryType.PATTERN ? (
                <div className="bg-slate-950/40 p-8 rounded-[2rem] border border-slate-800 flex flex-col items-center">
                  <PatternGrid value={formData.value || ''} onChange={val => setFormData(prev => ({ ...prev, value: val }))} />
                </div>
              ) : formData.type === EntryType.SEED_PHRASE ? (
                <textarea 
                  required
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-4 text-xs font-mono text-amber-200 focus:ring-2 focus:ring-blue-500/40 min-h-[120px] resize-none"
                  placeholder="Tempelkan 12 atau 24 kata seed Anda di sini..."
                  value={formData.value}
                  onChange={e => setFormData(prev => ({ ...prev, value: e.target.value }))}
                />
              ) : (
                <input 
                  type={formData.type === EntryType.PIN ? "number" : "text"} required
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm font-mono text-white focus:ring-2 focus:ring-blue-500/40"
                  placeholder={formData.type === EntryType.PIN ? "0000" : "Ketik Password..."}
                  value={formData.value}
                  onChange={e => setFormData(prev => ({ ...prev, value: e.target.value }))}
                />
              )}
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Catatan</label>
              <textarea 
                rows={2}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-300 focus:ring-2 focus:ring-blue-500/40 resize-none"
                placeholder="Petunjuk tambahan..."
                value={formData.notes}
                onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>

          <div className="p-6 border-t border-slate-800 bg-slate-900/80 flex gap-3 shrink-0">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-4 border border-slate-700 rounded-2xl text-xs font-bold text-slate-400 uppercase tracking-widest hover:bg-slate-800 transition-colors">
              Batal
            </button>
            <button type="submit" className="flex-1 px-4 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-xs font-black text-white shadow-xl shadow-blue-900/20 uppercase tracking-[0.2em] transition-all">
              {formData.id ? 'Simpan Perubahan' : 'Simpan Rahasia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntryModal;
