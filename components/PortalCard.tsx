
import React from 'react';
import { Globe, ExternalLink, Calendar } from 'lucide-react';
import { PortalLink } from '../types';

interface PortalCardProps {
  portal: PortalLink;
}

const PortalCard: React.FC<PortalCardProps> = ({ portal }) => {
  return (
    <div className="group bg-slate-900/40 border border-slate-800 hover:border-indigo-500/30 rounded-[2rem] p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-900/10 flex flex-col h-full relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
        <Globe size={120} className="text-indigo-500" />
      </div>

      <div className="flex items-start justify-between mb-6 relative z-10">
        <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
          <Globe className="text-indigo-400" size={24} />
        </div>
      </div>

      <div className="flex-1 relative z-10">
        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors truncate">
          {portal.title}
        </h3>
        
        {portal.description ? (
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-6 bg-slate-800/20 p-4 rounded-2xl border border-slate-800/40 italic">
            "{portal.description}"
          </p>
        ) : (
          <div className="h-20" />
        )}
      </div>

      <div className="pt-6 border-t border-slate-800/50 flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between text-[10px] font-black text-slate-600 uppercase tracking-tighter">
          <span className="flex items-center gap-1.5">
            <Calendar size={12} /> {new Date(portal.createdAt).toLocaleDateString()}
          </span>
          <span className="text-indigo-500/40">Private Portal</span>
        </div>

        <a 
          href={portal.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20 transition-all group/btn"
        >
          Kunjungi Website <ExternalLink size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
        </a>
      </div>
    </div>
  );
};

export default PortalCard;
