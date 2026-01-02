
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Search, Menu, ShieldCheck, LayoutDashboard, Lock, 
  Clock, ShieldAlert, Key, Hash, Grid, Box, ChevronRight, 
  ShieldCheck as ShieldIcon, Globe, ExternalLink, Trash2,
  FolderPlus, Inbox, HelpCircle, Calendar
} from 'lucide-react';
import { VaultEntry, Category, EntryType, PortalLink } from './types.ts';
import Sidebar from './components/Sidebar.tsx';
import EntryCard from './components/EntryCard.tsx';
import EntryModal from './components/EntryModal.tsx';
import CategoryModal from './components/CategoryModal.tsx';
import DeleteConfirmModal from './components/DeleteConfirmModal.tsx';
import DeleteItemModal from './components/DeleteItemModal.tsx';
import LockScreen from './components/LockScreen.tsx';
import PortalCard from './components/PortalCard.tsx';
import ImportStatusModal from './components/ImportStatusModal.tsx';
import InteractiveTour from './components/InteractiveTour.tsx';

const STATIC_PORTALS: PortalLink[] = [
  { id: '1', title: 'OmniPro', url: 'https://omni-ruby.vercel.app/', description: 'OmniPro adalah pusat kendali produktivitas All-in-One: Kelola keuangan cerdas, timeline rapat profesional, dan sistem manajemen tugas dalam satu dashboard adaptif.', createdAt: Date.now() },
  { id: '2', title: 'DreamFund', url: 'https://wishlist-eight-mu.vercel.app/', description: 'DreamFund adalah platform cerdas untuk mengelola daftar barang impian (wishlist) dan memantau progres tabungan secara mandiri. Melalui visualisasi yang intuitif, Anda dapat mengatur prioritas target finansial dan merencanakan pembelian masa depan dengan lebih baik. Seluruh data Anda tersimpan 100% lokal di browser, menjamin privasi penuh.', createdAt: Date.now() },
];

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const INITIAL_CATEGORIES: Category[] = [
  { id: 'uncategorized', name: 'Umum', color: 'bg-slate-500' },
  { id: 'work', name: 'Pekerjaan', color: 'bg-blue-500' },
  { id: 'personal', name: 'Pribadi', color: 'bg-purple-500' },
  { id: 'crypto', name: 'Aset Crypto', color: 'bg-amber-500' },
];

interface ImportStatus {
  isActive: boolean;
  step: number;
  message: string;
  isError: boolean;
  logs: string[];
}

const App: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Data State
  const [entries, setEntries] = useState<VaultEntry[]>(() => {
    const saved = localStorage.getItem('vault_entries');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('vault_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  // UI State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [view, setView] = useState<'vault' | 'portals'>('vault');
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    isActive: false, step: 0, message: '', isError: false, logs: []
  });

  // Modal States
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  
  const [editingEntry, setEditingEntry] = useState<VaultEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<VaultEntry | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [quickType, setQuickType] = useState<EntryType>(EntryType.PASSWORD);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isUnlocked) {
      localStorage.setItem('vault_entries', JSON.stringify(entries));
      localStorage.setItem('vault_categories', JSON.stringify(categories));
      
      const hasSeenTour = localStorage.getItem('vault_seen_tour');
      if (!hasSeenTour) {
        setIsTourActive(true);
        localStorage.setItem('vault_seen_tour', 'true');
      }
    }
  }, [entries, categories, isUnlocked]);

  const handleSaveEntry = (data: Partial<VaultEntry>) => {
    if (editingEntry) {
      setEntries(prev => prev.map(e => e.id === editingEntry.id ? {
        ...editingEntry, ...data, lastModified: Date.now()
      } as VaultEntry : e));
    } else {
      const newEntry: VaultEntry = {
        id: generateId(),
        title: data.title || 'Tanpa Judul',
        type: data.type || EntryType.PASSWORD,
        categoryId: data.categoryId || 'uncategorized',
        username: data.username,
        value: data.value || '',
        notes: data.notes,
        createdAt: Date.now(),
        lastModified: Date.now()
      };
      setEntries(prev => [newEntry, ...prev]);
    }
    setIsEntryModalOpen(false);
    setEditingEntry(null);
  };

  const handleExport = () => {
    const dataToExport = {
      entries,
      categories,
      exportDate: new Date().toISOString(),
      app: "SecureVault"
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_vault_${entries.length}_item_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = useCallback(async (file: File) => {
    const updateLog = (msg: string, step: number, isError = false) => {
      setImportStatus(prev => ({
        ...prev, isActive: true, step, message: msg, isError, logs: [...prev.logs, msg]
      }));
    };

    setImportStatus({ isActive: true, step: 1, message: 'Memulai...', isError: false, logs: ['Menyiapkan sistem impor...'] });

    const reader = new FileReader();
    reader.onerror = () => updateLog("Gagal membaca file dari disk.", 1, true);

    reader.onload = async (e) => {
      try {
        await new Promise(r => setTimeout(r, 600)); 
        const result = e.target?.result;
        if (typeof result !== 'string') throw new Error("File tidak terbaca sebagai teks.");
        updateLog("File terbaca. Menganalisis struktur JSON...", 2);
        await new Promise(r => setTimeout(r, 600));

        let content;
        try {
          content = JSON.parse(result);
        } catch (pErr) {
          throw new Error("Format file JSON rusak atau tidak valid.");
        }

        if (!content || !Array.isArray(content.entries)) {
          throw new Error("Struktur data tidak lengkap.");
        }

        updateLog(`Ditemukan ${content.entries.length} data. Memulai validasi item...`, 3);
        await new Promise(r => setTimeout(r, 800));

        updateLog("Sinkronisasi folder/kategori...", 4);
        const importedCats: Category[] = Array.isArray(content.categories) ? content.categories : [];
        const finalCategories = [...categories];
        
        importedCats.forEach(cat => {
          if (cat && cat.id && !finalCategories.find(c => c.id === cat.id)) {
            finalCategories.push({
              id: String(cat.id),
              name: String(cat.name || 'Folder Impor'),
              color: String(cat.color || 'bg-slate-500')
            });
          }
        });
        const validCatIds = new Set(finalCategories.map(c => c.id));

        const cleanedEntries: VaultEntry[] = content.entries.map((item: any, idx: number) => {
          if (!item) return null;
          const rawType = String(item.type || '').toUpperCase();
          let vType = EntryType.PASSWORD;
          if (rawType.includes('PIN')) vType = EntryType.PIN;
          else if (rawType.includes('SEED')) vType = EntryType.SEED_PHRASE;
          else if (rawType.includes('PATTERN')) vType = EntryType.PATTERN;

          return {
            id: String(item.id || generateId()),
            title: String(item.title || `Impor #${idx + 1}`),
            type: vType,
            categoryId: (item.categoryId && validCatIds.has(item.categoryId)) ? String(item.categoryId) : 'uncategorized',
            username: item.username ? String(item.username) : '',
            value: String(item.value || ''),
            notes: item.notes ? String(item.notes) : '',
            createdAt: Number(item.createdAt) || Date.now(),
            lastModified: Number(item.lastModified) || Date.now()
          };
        }).filter((i): i is VaultEntry => i !== null);

        updateLog("Menyimpan data ke brankas lokal...", 5);
        await new Promise(r => setTimeout(r, 600));

        setCategories(finalCategories);
        setEntries(prev => {
          const map = new Map<string, VaultEntry>();
          prev.forEach(p => map.set(p.id, p));
          cleanedEntries.forEach(c => map.set(c.id, c));
          return Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
        });

        updateLog("Selesai! Data berhasil diamankan.", 7);
        setSelectedCategoryId(null);
        setSearchQuery('');
        setView('vault');

      } catch (err: any) {
        updateLog(err.message || "Terjadi kesalahan fatal.", 1, true);
      }
    };
    reader.readAsText(file);
  }, [categories]);

  const handleDeleteCategory = (id: string, targetCategoryId?: string) => {
    if (id === 'uncategorized') return;
    if (targetCategoryId) {
      setEntries(prev => prev.map(entry => 
        entry.categoryId === id ? { ...entry, categoryId: targetCategoryId } : entry
      ));
    }
    setCategories(prev => prev.filter(c => c.id !== id));
    setCategoryToDelete(null);
    if (selectedCategoryId === id) setSelectedCategoryId(null);
  };

  const filteredEntries = entries.filter(entry => {
    const matchesCategory = !selectedCategoryId || entry.categoryId === selectedCategoryId;
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!isUnlocked) return <LockScreen onUnlock={() => setIsUnlocked(true)} />;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden relative">
      <Sidebar 
        categories={categories}
        selectedCategory={selectedCategoryId}
        onSelectCategory={(id) => { setSelectedCategoryId(id); setView('vault'); }}
        onAddCategory={() => setIsCategoryModalOpen(true)}
        onDeleteCategory={(id) => setCategoryToDelete(categories.find(c => c.id === id) || null)}
        onExport={handleExport} 
        onImport={handleImport}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onViewPortals={() => { setView('portals'); setSelectedCategoryId(null); }}
        onOpenGuide={() => setIsTourActive(true)}
        currentView={view}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <header className="h-20 border-b border-slate-900 flex items-center justify-between px-6 bg-slate-950/50 backdrop-blur-xl shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 hover:bg-slate-900 rounded-xl text-slate-400 lg:hidden">
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-xl font-black text-white leading-tight">
                {selectedCategoryId ? categories.find(c => c.id === selectedCategoryId)?.name : view === 'portals' ? 'Web Portal' : 'Dashboard Brankas'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsTourActive(true)}
              className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-all md:flex items-center gap-2 hidden"
            >
              <HelpCircle size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Bantuan</span>
            </button>

            <div className={`relative group ${isTourActive ? 'flex' : 'hidden md:flex'}`} data-tour="search-bar">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500" size={16} />
              <input 
                type="text" placeholder="Cari..." 
                className="bg-slate-900/50 border border-slate-800 rounded-2xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 w-32 md:w-48 lg:w-64 transition-all"
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            {(view === 'vault' || isTourActive) && (
              <button 
                data-tour="add-entry-btn"
                onClick={() => { setQuickType(EntryType.PASSWORD); setEditingEntry(null); setIsEntryModalOpen(true); }}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all"
              >
                <Plus size={18} /> <span className="hidden sm:inline">Tambah Data</span>
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative z-20">
          <div className="max-w-6xl mx-auto space-y-10">
            {!selectedCategoryId && !searchQuery && view === 'vault' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl group">
                  <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                    <ShieldIcon size={240} className="text-white" />
                  </div>
                  <div className="relative z-10 space-y-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md border border-white/20 flex items-center gap-2">
                        <Calendar size={18} className="text-white" />
                        <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest">
                          {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md border border-white/20 flex items-center gap-2">
                        <Clock size={18} className="text-white" />
                      </div>
                      <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest">
                          {currentTime.toLocaleTimeString('id-ID')}
                        </span>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-4xl font-black text-white">Halo, Selamat Datang!</h2>
                      <p className="text-blue-100/70 text-lg font-medium max-w-sm">Semua rahasia Anda aman terenkripsi.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 flex flex-col justify-between shadow-xl">
                  <div>
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Pintasan Cepat</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setView('portals')} className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 hover:border-indigo-500 transition-colors flex flex-col items-center gap-2">
                        <Globe size={20} className="text-indigo-400" />
                        <span className="text-[10px] font-bold uppercase">Web Portal</span>
                      </button>
                      <button onClick={() => { setQuickType(EntryType.PASSWORD); setEditingEntry(null); setIsEntryModalOpen(true); }} className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 hover:border-blue-500 transition-colors flex flex-col items-center gap-2">
                        <Key size={20} className="text-blue-400" />
                        <span className="text-[10px] font-bold uppercase">Password</span>
                      </button>
                    </div>
                  </div>
                  <div className="mt-8 flex items-center justify-between p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl">
                    <span className="text-xs font-bold text-blue-400">Total</span>
                    <span className="text-xl font-black text-white">{entries.length}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-black flex items-center gap-3">
                  {view === 'portals' ? <Globe className="text-indigo-500" size={22} /> : <ShieldCheck className="text-blue-500" size={22} />}
                  {view === 'portals' ? 'Web Portal' : selectedCategoryId ? `Folder: ${categories.find(c => c.id === selectedCategoryId)?.name}` : 'Daftar Rahasia'}
                </h3>
              </div>

              {view === 'portals' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {STATIC_PORTALS.map(p => <PortalCard key={p.id} portal={p} />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
                  {filteredEntries.map(entry => (
                    <EntryCard 
                      key={entry.id} entry={entry} 
                      category={categories.find(c => c.id === entry.categoryId)} 
                      onDelete={() => setEntryToDelete(entry)} 
                      onEdit={() => { setEditingEntry(entry); setIsEntryModalOpen(true); }} 
                    />
                  ))}
                  {filteredEntries.length === 0 && (
                    <div className="col-span-full py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-[3rem] text-center">
                      <ShieldAlert size={48} className="mx-auto text-slate-700 mb-4" />
                      <p className="text-slate-500 font-bold">Tidak ada data ditemukan.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* MODALS */}
      {importStatus.isActive && (
        <ImportStatusModal status={importStatus} onClose={() => setImportStatus(prev => ({ ...prev, isActive: false }))} />
      )}

      {isTourActive && (
        <InteractiveTour 
          isActive={isTourActive} 
          onClose={() => setIsTourActive(false)}
          setSidebarOpen={setIsSidebarOpen}
          setView={setView}
          setSelectedCategory={setSelectedCategoryId}
        />
      )}

      {isEntryModalOpen && (
        <EntryModal 
          isOpen={isEntryModalOpen} 
          onClose={() => { setIsEntryModalOpen(false); setEditingEntry(null); }} 
          onSave={handleSaveEntry} 
          categories={categories} 
          initialData={editingEntry || { type: quickType } as VaultEntry} 
        />
      )}
      
      {isCategoryModalOpen && (
        <CategoryModal 
          isOpen={isCategoryModalOpen} 
          onClose={() => setIsCategoryModalOpen(false)} 
          onSave={(name, color) => {
            const newCat = { id: generateId(), name, color };
            setCategories(prev => [...prev, newCat]);
            setIsCategoryModalOpen(false);
          }} 
        />
      )}

      {entryToDelete && (
        <DeleteItemModal 
          isOpen={!!entryToDelete} 
          onClose={() => setEntryToDelete(null)} 
          onConfirm={() => {
            if (entryToDelete) {
              setEntries(prev => prev.filter(e => e.id !== entryToDelete.id));
              setEntryToDelete(null);
            }
          }} 
          itemTitle={entryToDelete.title} 
        />
      )}

      {categoryToDelete && (
        <DeleteConfirmModal 
          isOpen={!!categoryToDelete} onClose={() => setCategoryToDelete(null)} 
          onConfirm={(targetId) => handleDeleteCategory(categoryToDelete.id, targetId)} 
          title="Hapus Folder?" message={`Folder "${categoryToDelete.name}" akan dihapus.`} 
          itemCount={entries.filter(e => e.categoryId === categoryToDelete.id).length} 
          availableCategories={categories.filter(c => c.id !== categoryToDelete.id)} 
        />
      )}
    </div>
  );
};

export default App;
