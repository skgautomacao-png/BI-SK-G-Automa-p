
import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  colorClass?: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, subtitle, icon, colorClass = "text-blue-400" }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl shadow-lg flex items-center gap-4 transition-all hover:scale-[1.02]">
      <div className={`p-3 rounded-lg bg-slate-900/50 ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

export default KPICard;
