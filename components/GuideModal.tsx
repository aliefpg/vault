
import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Key, 
  Hash, 
  Grid, 
  Box, 
  Download, 
  Upload, 
  Lock, 
  ChevronRight,
  FolderPlus,
  Inbox,
  Globe,
  // Added ShieldAlert to fix "Cannot find name 'ShieldAlert'" error
  ShieldAlert
} from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'security' | 'backup'>('basics');

  if (!isOpen) return null;

  const tabs = [
    { id: 'basics', label: 'Dasar', icon: <Inbox size={16} /> },
    { id: 'security', label: 'Keamanan', icon: <Lock size={16} /> },
    { id: 'backup', label: 'Backup', icon: <Database size={16} /> }
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white leading-tight">Panduan Penggunaan</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Pelajari Cara Mengamankan Data Anda</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex p-2 bg-slate-950/50 border-b border-slate-800 shrink-0">
          {(['basics', 'security', 'backup'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {tab === 'basics' && <Inbox size={14} />}
              {tab === 'security' && <Lock size={14} />}
              {tab === 'backup' && <Upload size={14} />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === 'basics' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <section className="space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Jenis Data Yang Bisa Disimpan
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: <Key size={18} />, title: 'Password', desc: 'Akun medsos, email, atau portal kerja.', color: 'text-blue-400' },
                    { icon: <Hash size={18} />, title: 'PIN', desc: 'Kode ATM, kunci pintu, atau brankas fisik.', color: 'text-purple-400' },
                    { icon: <Grid size={18} />, title: 'Pattern', desc: 'Kunci pola kunci layar yang kompleks.', color: 'text-pink-400' },
                    { icon: <Box size={18} />, title: 'Seed Phrase', desc: '12-24 kata rahasia untuk dompet crypto.', color: 'text-amber-400' },
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-slate-800/30 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
                      <div className={`mb-2 ${item.color}`}>{item.icon}</div>
                      <p className="text-xs font-black text-white mb-1">{item.title}</p>
                      <p className="text-[10px] text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Manajemen Folder
                </h3>
                <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800 flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                    <FolderPlus size={20} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">Buat Folder Kustom</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Gunakan tombol "Tambah Folder" di sidebar untuk mengelompokkan data berdasarkan Pekerjaan, Pribadi, atau proyek tertentu. Anda bisa menghapus folder kapan saja; data di dalamnya akan dipindahkan ke folder "Umum".
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-blue-500" size={24} />
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Master Password</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Vault menggunakan satu kata sandi utama untuk membuka brankas. Sangat penting bagi Anda untuk mengingatnya karena **kami tidak menyimpan sandi Anda di server**. Jika lupa, data tidak dapat dipulihkan.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { title: 'Enkripsi Lokal', desc: 'Data Anda dienkripsi menggunakan standar militer AES-256 langsung di perangkat Anda.' },
                  { title: 'Privasi Penuh', desc: 'Kami tidak pernah mengirim data atau aktivitas Anda ke internet. Apa yang di brankas tetap di brankas.' },
                  { title: 'Pattern Visual', desc: 'Gunakan fitur Playback untuk melihat urutan pola yang Anda simpan jika sewaktu-waktu lupa.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 hover:bg-slate-800/20 rounded-2xl transition-all group">
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-blue-500 shrink-0 group-hover:scale-110 transition-transform">
                      {i + 1}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white">{item.title}</p>
                      <p className="text-[10px] text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Ekspor & Impor
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-slate-800/30 p-5 rounded-3xl border border-slate-800 flex items-start gap-4">
                    <Download className="text-blue-500 shrink-0" size={20} />
                    <div>
                      <p className="text-xs font-bold text-white mb-1">Cara Backup (Ekspor)</p>
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        Klik tombol "Ekspor Data" untuk mengunduh file .json. File ini berisi seluruh rahasia dan folder Anda. Simpan di tempat aman seperti Flashdisk atau Cloud terenkripsi.
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-800/30 p-5 rounded-3xl border border-slate-800 flex items-start gap-4">
                    <Upload className="text-emerald-500 shrink-0" size={20} />
                    <div>
                      <p className="text-xs font-bold text-white mb-1">Cara Restore (Impor)</p>
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        Klik "Impor Data" dan pilih file .json cadangan Anda. Sistem akan memverifikasi struktur file secara otomatis lewat bar progres. Data baru akan ditambahkan tanpa menghapus data yang sudah ada.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex items-start gap-4">
                <ShieldAlert className="text-amber-500 shrink-0" size={20} />
                <p className="text-[10px] text-amber-200/70 leading-relaxed italic">
                  <strong>Peringatan:</strong> File backup (.json) berisi data sensitif dalam teks mentah jika dibuka di editor teks biasa. Selalu simpan file ini di media penyimpanan yang aman atau dienkripsi lebih lanjut.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-800 bg-slate-900/80 flex justify-center shrink-0">
          <button 
            onClick={onClose}
            className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase rounded-2xl transition-all shadow-xl shadow-blue-900/20 tracking-[0.2em]"
          >
            Mengerti, Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;

interface DatabaseProps {
  size: number;
}
const Database: React.FC<DatabaseProps> = ({ size }) => <Box size={size} />;
