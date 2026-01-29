
import React, { useMemo } from 'react';
import { Month, SalesData } from '../types';
import { MONTHS } from '../constants';
import { User, Calendar, Calculator, LayoutDashboard, UserCheck, Rocket } from 'lucide-react';

interface SidebarProps {
  selectedMonth: Month;
  setSelectedMonth: (month: Month) => void;
  currentData: SalesData;
  handleInputChange: (seller: keyof SalesData, value: string) => void;
  activeTab: 'dashboard' | 'clients' | 'growth';
  setActiveTab: (tab: 'dashboard' | 'clients' | 'growth') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedMonth, setSelectedMonth, currentData, handleInputChange, activeTab, setActiveTab }) => {
  const totalMonth = useMemo(() => {
    return (Number(currentData.syllas) || 0) + 
           (Number(currentData.vendedora1) || 0) + 
           (Number(currentData.vendedora2) || 0) + 
           (Number(currentData.vendedora3) || 0);
  }, [currentData]);

  const formatBRL = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

  const onValueChange = (seller: keyof SalesData, rawValue: string) => {
    let cleanValue = rawValue.replace(/\./g, '').replace(',', '.');
    cleanValue = cleanValue.replace(/[^\d.]/g, '');
    const parts = cleanValue.split('.');
    if (parts.length > 2) cleanValue = parts.slice(0, -1).join('') + '.' + parts[parts.length - 1];
    handleInputChange(seller, cleanValue);
  };

  return (
    <aside className="w-full lg:w-80 bg-slate-900 border-r border-slate-700 p-6 flex flex-col gap-8 h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 mb-8">
          <img src="https://imgur.com/hURknEb.png" alt="SK-G Logo" className="w-10 h-10 object-contain" />
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-white leading-tight tracking-tighter">SK-G BI</h1>
            <span className="text-[9px] text-blue-500 font-bold uppercase tracking-widest">Intelligence System</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="space-y-1 mb-10">
           <button 
             onClick={() => setActiveTab('dashboard')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'dashboard' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
           >
             <LayoutDashboard className="w-4 h-4" /> Dashboard Geral
           </button>
           <button 
             onClick={() => setActiveTab('clients')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'clients' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
           >
             <UserCheck className="w-4 h-4" /> Top 20 Clientes
           </button>
           <button 
             onClick={() => setActiveTab('growth')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'growth' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
           >
             <Rocket className="w-4 h-4" /> Consultoria V4
           </button>
        </div>
        
        {activeTab !== 'clients' ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 shadow-inner">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                <Calendar className="w-3 h-3 text-blue-500" /> Período
              </label>
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value as Month)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer appearance-none transition-all"
              >
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="pt-2">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-5 px-1">Faturamento Vendedor</h2>
              <div className="space-y-5">
                {[{ id: 'syllas', label: 'Syllas (Dir.)', color: 'text-blue-400', border: 'border-blue-500/20' }, { id: 'vendedora1', label: 'Vendedora 01', color: 'text-pink-400', border: 'border-pink-500/20' }, { id: 'vendedora2', label: 'Vendedora 02', color: 'text-emerald-400', border: 'border-emerald-500/20' }, { id: 'vendedora3', label: 'Vendedora 03', color: 'text-purple-400', border: 'border-purple-500/20' }].map(seller => (
                  <div key={seller.id} className={`p-4 rounded-xl border ${seller.border} bg-slate-800/20 transition-all focus-within:bg-slate-800/40`}>
                    <label className={`text-xs font-bold text-slate-300 flex items-center gap-2 mb-3`}><User className={`w-3.5 h-3.5 ${seller.color}`} /> {seller.label}</label>
                    <div className="relative group">
                      <span className="absolute left-3 top-2.5 text-slate-500 text-xs font-mono group-focus-within:text-blue-500 transition-colors">R$</span>
                      <input type="text" value={currentData[seller.id as keyof SalesData] || ''} onChange={(e) => onValueChange(seller.id as keyof SalesData, e.target.value)} placeholder="Cole: 47.895,31" className="w-full bg-slate-900 border border-slate-700/50 rounded-lg p-2 pl-9 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono tracking-tight" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-slate-800/20 border border-slate-700/50 rounded-2xl flex flex-col items-center text-center gap-4 animate-in fade-in duration-500">
             <Rocket className="w-10 h-10 text-blue-500 opacity-50" />
             <p className="text-xs text-slate-400 font-medium">Você está no modo de <b>Análise Histórica</b>. Utilize a matriz na tela central para projetar os anos de 2026 a 2030.</p>
          </div>
        )}
      </div>

      {(activeTab === 'dashboard' || activeTab === 'growth') && (
        <div className="mt-auto space-y-4">
          <div className="p-6 bg-emerald-500 rounded-2xl shadow-xl shadow-emerald-500/10 border border-emerald-400">
            <p className="text-[10px] text-emerald-950 font-black uppercase tracking-widest mb-1 flex items-center gap-2"><Calculator className="w-3.5 h-3.5" /> Total do Mês ({selectedMonth})</p>
            <p className="text-2xl font-black text-slate-900 tracking-tighter">{formatBRL(totalMonth)}</p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
