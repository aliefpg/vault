
import React from 'react';
import { Shield, Key, Hash, Grid, Box } from 'lucide-react';
import { VaultEntry, EntryType } from '../types';

interface StatsOverviewProps {
  entries: VaultEntry[];
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ entries }) => {
  const counts = {
    [EntryType.PASSWORD]: entries.filter(e => e.type === EntryType.PASSWORD).length,
    [EntryType.PIN]: entries.filter(e => e.type === EntryType.PIN).length,
    [EntryType.SEED_PHRASE]: entries.filter(e => e.type === EntryType.SEED_PHRASE).length,
    [EntryType.PATTERN]: entries.filter(e => e.type === EntryType.PATTERN).length,
  };

  const stats = [
    { type: EntryType.PASSWORD, icon: <Key size={20} />, color: 'blue', count: counts[EntryType.PASSWORD] },
    { type: EntryType.PIN, icon: <Hash size={20} />, color: 'purple', count: counts[EntryType.PIN] },
    { type: EntryType.SEED_PHRASE, icon: <Box size={20} />, color: 'amber', count: counts[EntryType.SEED_PHRASE] },
    { type: EntryType.PATTERN, icon: <Grid size={20} />, color: 'pink', count: counts[EntryType.PATTERN] },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div 
          key={stat.type}
          className="bg-slate-900/40 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 flex items-center gap-5 transition-all hover:translate-y-[-2px] hover:shadow-xl hover:shadow-black/20 group"
        >
          <div className={`
            bg-${stat.color}-500/10 p-4 rounded-2xl border border-${stat.color}-500/20 
            group-hover:scale-110 transition-transform duration-300
          `}>
            {/* Fix: cast to React.ReactElement with className prop to avoid 'className does not exist' error during cloning */}
            {React.cloneElement(stat.icon as React.ReactElement<{ className?: string }>, { className: `text-${stat.color}-500` })}
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white leading-none mb-1">{stat.count}</span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.type}s</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
