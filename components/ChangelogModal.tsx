
import React from 'react';
import { X, Sparkles, Rocket, Zap, Bug, ChevronRight, CheckCircle2 } from 'lucide-react';
import { ReleaseNote } from '../types.ts';

const RELEASE_NOTES: ReleaseNote[] = [
 {
    version: '1.3.1',
    date: '4 Januari 2026',
    title: 'Sensor Cerdas & Placeholder Kontekstual',
    changes: [
      { type: 'feature', text: 'Placeholder Dinamis: Kolom input rahasia kini menyesuaikan teks petunjuk (placeholder) secara otomatis berdasarkan tipe data yang dipilih (Password, PIN, Seed, dll).' },
      { type: 'improvement', text: 'Sensor Pola Terintegrasi: Identitas (Username/Email) pada tipe Pattern kini otomatis terbuka saat Anda mengklik tombol "Lihat Pola" untuk efisiensi akses.' },
      { type: 'improvement', text: 'Visual Entry Card: Penambahan ikon identitas (User) dan layanan (Globe) pada kartu rahasia agar informasi lebih mudah dibaca sekilas.' },
      { type: 'fix', text: 'Perbaikan sensor manual pada kartu Pattern yang sebelumnya tidak memiliki tombol kontrol mandiri untuk identitas.' }
    ]
  },
  {
    version: '1.3.0',
    date: '2 Januari 2026',
    title: 'Secret Key & Notifikasi Pintar',
    changes: [
      { type: 'feature', text: 'Secret Key Support: Tipe data baru khusus untuk menyimpan API Key, Recovery Key, atau token rahasia dengan ikon Emerald yang elegan.' },
      { type: 'feature', text: 'Smart Sidebar Badge: Indikator titik merah (pulsing dot) akan muncul di menu Sidebar jika ada fitur baru tanpa mengganggu kenyamanan Anda dengan pop-up otomatis.' },
      { type: 'improvement', text: 'Visual Dashboard: Penambahan "Pintasan Cepat" di dashboard untuk akses instan ke pembuatan Secret Key.' },
      { type: 'improvement', text: 'Auto-Read Logic: Notifikasi pembaruan akan otomatis hilang setelah Anda membuka menu rilis ini.' }
    ]
  },
  {
    version: '1.2.0',
    date: '01 Januari 2026',
    title: 'Privasi & Keamanan Berlapis',
    changes: [
      { type: 'feature', text: 'Mode Sensor Default: Nama pengguna, issuer, dan nilai rahasia kini disensor secara otomatis saat brankas dibuka.' },
      { type: 'improvement', text: 'New Card Design: Tampilan kartu yang lebih modern dengan aksen warna sesuai tipe data (Blue untuk Password, Purple untuk PIN, dll).' },
      { type: 'improvement', text: 'Keamanan Pattern: Perbaikan rendering pada jalur pola kunci agar lebih presisi dan stabil.' }
    ]
  },
  {
    version: '1.1.0',
    date: '30 Desember 2025',
    title: 'Ekosistem Backup & Onboarding',
    changes: [
      { type: 'feature', text: 'Backup JSON: Ekspor seluruh data brankas Anda ke file lokal untuk cadangan permanen.' },
      { type: 'feature', text: 'Restore System: Impor data dari file backup dengan bar progres interaktif dan log aktivitas sistem.' },
      { type: 'feature', text: 'Interactive Tour: Panduan langkah demi langkah bagi pengguna baru untuk memahami cara kerja brankas.' }
    ]
  },
  {
    version: '1.0.0',
    date: '29 Desember 2025',
    title: 'Peluncuran Perdana Vault',
    changes: [
      { type: 'feature', text: 'Master Password: Perlindungan akses utama dengan enkripsi lokal end-to-end.' },
      { type: 'feature', text: 'Multi-Format: Mendukung penyimpanan Password, PIN, Pola, dan Seed Phrase.' },
      { type: 'feature', text: 'Custom Folders: Kelola data Anda dengan kategori warna-warni yang bisa ditambah dan dihapus.' }
    ]
  }
];

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangelogModal: React.FC<ChangelogModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600/10 rounded-2xl text-indigo-500 ring-1 ring-indigo-500/20">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white leading-tight">Apa Yang Baru?</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Riwayat Pembaruan VaultPro</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-12">
          {RELEASE_NOTES.map((release, idx) => (
            <div key={release.version} className="relative pl-8">
              {/* Timeline Line */}
              {idx !== RELEASE_NOTES.length - 1 && (
                <div className="absolute left-[11px] top-8 bottom-[-48px] w-0.5 bg-slate-800" />
              )}
              
              {/* Version Bubble */}
              <div className={`absolute left-0 top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 ${idx === 0 ? 'bg-indigo-600 border-indigo-400' : 'bg-slate-900 border-slate-700'}`}>
                {idx === 0 ? <Rocket size={10} className="text-white" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${idx === 0 ? 'text-indigo-400' : 'text-slate-500'}`}>
                      Versi {release.version} • {release.date}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">{release.title}</h3>
                  </div>
                  {idx === 0 && (
                    <span className="bg-indigo-500/10 text-indigo-400 text-[9px] font-black px-3 py-1 rounded-full border border-indigo-500/20 animate-pulse">LATEST</span>
                  )}
                </div>

                <div className="grid gap-3">
                  {release.changes.map((change, cIdx) => (
                    <div key={cIdx} className="flex gap-3 bg-slate-800/20 p-4 rounded-2xl border border-slate-800/40 group hover:border-slate-700 transition-colors">
                      <div className="mt-0.5">
                        {change.type === 'feature' ? <Zap size={14} className="text-amber-500" /> : 
                         change.type === 'improvement' ? <CheckCircle2 size={14} className="text-blue-500" /> : 
                         <Bug size={14} className="text-red-500" />}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-200 transition-colors">
                        {change.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-800 bg-slate-900/80 flex justify-center shrink-0">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase rounded-2xl transition-all shadow-xl shadow-indigo-900/20 tracking-[0.2em]"
          >
            Mengerti, Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangelogModal;
