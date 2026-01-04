
import React, { useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  ShieldCheck, 
  LayoutDashboard, 
  ShieldAlert,
  Inbox,
  X,
  Download,
  Upload,
  Globe,
  FolderPlus,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { Category } from '../types';

interface SidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  onAddCategory: () => void;
  onDeleteCategory: (id: string) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  onViewPortals: () => void;
  onOpenGuide: () => void;
  onOpenChangelog: () => void;
  currentView: 'vault' | 'portals';
  hasUpdate?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  onAddCategory,
  onDeleteCategory,
  onExport,
  onImport,
  isOpen,
  toggleSidebar,
  onViewPortals,
  onOpenGuide,
  onOpenChangelog,
  currentView,
  hasUpdate = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const systemCat = categories.find(c => c.id === 'uncategorized');
  const userCategories = categories.filter(c => c.id !== 'uncategorized');

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = '';
    }
  };

  return (
    <>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".json" 
        className="hidden" 
      />

      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[40] lg:hidden" onClick={toggleSidebar} />
      )}

      <aside 
        data-tour="sidebar-area"
        className={`
          fixed lg:static inset-y-0 left-0 z-[50]
          ${isOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0 lg:w-0'} 
          transition-all duration-300 ease-in-out
          flex flex-col h-full bg-slate-900 border-r border-slate-800 overflow-hidden
        `}>
        <div className="p-6 flex flex-col h-full min-w-[288px]">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/20">
                <ShieldCheck className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Vault</span>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
          </div>

          <nav className="space-y-8 flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-2">Navigasi Utama</p>
              <div className="space-y-1">
                <button 
                  onClick={() => { onSelectCategory(null); if(window.innerWidth < 1024) toggleSidebar(); }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${!selectedCategory && currentView === 'vault' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  <LayoutDashboard size={18} /> Dashboard
                </button>
                
                {systemCat && (
                  <button 
                    onClick={() => { onSelectCategory(systemCat.id); if(window.innerWidth < 1024) toggleSidebar(); }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${selectedCategory === systemCat.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-slate-800'}`}
                  >
                    <Inbox size={18} /> uncategorized
                  </button>
                )}

                <button 
                  onClick={() => { onViewPortals(); if(window.innerWidth < 1024) toggleSidebar(); }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${currentView === 'portals' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  <Globe size={18} /> Portal
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Folder Kustom</p>
              </div>
              <div className="space-y-1">
                {userCategories.length > 0 ? (
                  userCategories.map(cat => (
                    <div key={cat.id} className={`group flex items-center rounded-xl transition-all ${selectedCategory === cat.id ? 'bg-slate-800 ring-1 ring-slate-700 shadow-inner shadow-black/20' : 'hover:bg-slate-800/40'}`}>
                      <button onClick={() => onSelectCategory(cat.id)} className={`flex-1 flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-left ${selectedCategory === cat.id ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                        <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                        <span className="truncate">{cat.name}</span>
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); onDeleteCategory(cat.id); }} className="mr-2 opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 size={14} /></button>
                    </div>
                  ))
                ) : (
                  <p className="px-4 py-2 text-[10px] text-slate-600 italic">Belum ada folder kustom.</p>
                )}

                <button 
                  data-tour="add-folder-btn"
                  onClick={(e) => { e.stopPropagation(); onAddCategory(); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-500 hover:text-blue-400 hover:bg-blue-400/5 border border-dashed border-slate-800 mt-2 transition-all group"
                >
                  <FolderPlus size={18} className="group-hover:scale-110 transition-transform" /> Tambah Folder
                </button>
              </div>
            </div>

            <div data-tour="backup-area" className="pt-4 border-t border-slate-800/50">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-2">Alat Backup</p>
              <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={onExport} 
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all border border-transparent hover:border-slate-700"
                >
                  <Download size={16} className="text-blue-500" /> Ekspor Data
                </button>
                <button 
                  onClick={handleImportClick} 
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all border border-transparent hover:border-slate-700"
                >
                  <Upload size={16} className="text-emerald-500" /> Impor Data
                </button>
              </div>
            </div>
          </nav>

          <div className="mt-auto pt-6 space-y-2">
            <button 
              onClick={onOpenChangelog}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest relative ${hasUpdate ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30 ring-1 ring-indigo-400' : 'text-slate-300 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20'}`}
            >
              <div className="flex items-center gap-3">
                <Sparkles size={18} className={hasUpdate ? 'text-white' : 'text-indigo-400'} /> Update Terbaru
              </div>
              {hasUpdate ? (
                <div className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-slate-900"></span>
                </div>
              ) : (
                <span className="bg-indigo-500 text-[8px] px-1.5 py-0.5 rounded-sm">V.1.3.1</span>
              )}
            </button>
            <button 
              onClick={onOpenGuide}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-black text-slate-300 bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all uppercase tracking-widest"
            >
              <HelpCircle size={18} className="text-blue-400" /> Pusat Bantuan
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
