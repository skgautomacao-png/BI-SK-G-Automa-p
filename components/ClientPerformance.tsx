
import React, { useMemo, useState, useEffect } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, BarChart, Bar, Cell, LabelList
} from 'recharts';
import { Target, Search, BarChart3, Activity, Zap, Calendar, ArrowUpRight, Heart, MessageSquare, Save } from 'lucide-react';
import { TOP_CLIENTS_HISTORY } from '../constants';

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

const formatBRLAbbr = (val: number) => {
  if (val >= 1000000) return `R$ ${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `R$ ${(val / 1000).toFixed(0)}k`;
  return formatCurrency(val);
};

export const ClientPerformance: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clientNotes, setClientNotes] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('skg_client_notes_v9');
    return saved ? JSON.parse(saved) : {};
  });

  const [userProjections, setUserProjections] = useState<Record<string, Record<number, number>>>(() => {
    const saved = localStorage.getItem('skg_client_projections_v9');
    return saved ? JSON.parse(saved) : {};
  });

  const saveNote = (id: string, note: string) => {
    const newNotes = { ...clientNotes, [id]: note };
    setClientNotes(newNotes);
    localStorage.setItem('skg_client_notes_v9', JSON.stringify(newNotes));
  };

  const handleProjectionChange = (clientId: string, year: number, rawValue: string) => {
    const cleanValue = rawValue.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, '');
    const numValue = parseFloat(cleanValue) || 0;
    
    const newProjections = {
      ...userProjections,
      [clientId]: {
        ...(userProjections[clientId] || {}),
        [year]: numValue
      }
    };
    setUserProjections(newProjections);
    localStorage.setItem('skg_client_projections_v9', JSON.stringify(newProjections));
  };

  const processedData = useMemo(() => {
    return TOP_CLIENTS_HISTORY.map(client => {
      const history = client.history;
      const histYears = [2021, 2022, 2023, 2024, 2025];
      const projYears = [2026, 2027, 2028, 2029, 2030];
      
      const historyValues = histYears.map(y => history[y] || 0);
      const totalHistory = historyValues.reduce((a, b) => a + b, 0);
      
      const projections: Record<number, number> = {};
      projYears.forEach(y => {
        projections[y] = userProjections[client.id]?.[y] || 0;
      });

      const totalProjections = projYears.reduce((a, b) => a + projections[b], 0);
      const estimatedLTV = totalHistory + totalProjections;
      const peakRevenue = Math.max(...historyValues, ...Object.values(projections));
      const currentRevenue = history[2025] || 0;

      let healthStatus: 'Saudável' | 'Risco' | 'Churn' = 'Saudável';
      if (currentRevenue === 0 && (history[2023] > 0 || history[2024] > 0)) healthStatus = 'Churn';
      else if (currentRevenue > 0 && currentRevenue < peakRevenue * 0.4) healthStatus = 'Risco';
      
      const growthFactor = totalHistory > 0 ? (totalProjections / totalHistory) * 100 : 50;

      return { 
        ...client, 
        healthStatus, 
        totalHistory, 
        estimatedLTV, 
        peakRevenue, 
        projections,
        currentRevenue,
        totalProjections,
        growthFactor,
        x: estimatedLTV,
        y: growthFactor
      };
    }).sort((a, b) => b.estimatedLTV - a.estimatedLTV);
  }, [userProjections]);

  const filteredData = useMemo(() => {
    return processedData.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.sector.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [processedData, searchTerm]);

  const yearlyBehaviorData = useMemo(() => {
    const allYears = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
    return allYears.map(year => {
      let total = 0;
      processedData.forEach(c => {
        total += year <= 2025 ? (c.history[year] || 0) : (c.projections[year] || 0);
      });
      return { 
        year: year.toString(), 
        Faturamento: total,
        tipo: year <= 2025 ? 'Histórico' : 'Planejado'
      };
    });
  }, [processedData]);

  const getCellColor = (value: number, isEditable: boolean = false) => {
    if (value === 0) return isEditable ? 'bg-slate-900/60 text-slate-700' : 'bg-slate-900/30 text-slate-700/50';
    if (value < 50000) return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
    if (value < 150000) return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
    return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
  };

  return (
    <div className="space-y-24 animate-in fade-in duration-1000">
      
      {/* 1. Header Estratégico & Busca */}
      <section className="flex flex-col xl:flex-row justify-between items-end gap-8 bg-slate-900/40 p-12 rounded-[3.5rem] border border-slate-700/50 shadow-2xl">
        <div className="space-y-4">
          <div className="flex items-center gap-6">
             <div className="bg-blue-600 p-5 rounded-[2rem] shadow-xl shadow-blue-600/30">
                <Target className="w-10 h-10 text-white" />
             </div>
             <div>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Inteligência Estratégica T20</h2>
                <p className="text-blue-500 font-black uppercase text-[10px] tracking-[0.4em] mt-3">Advanced Data Monitoring • SK-G Automação</p>
             </div>
          </div>
        </div>

        <div className="w-full xl:w-1/3 relative group">
           <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within:text-blue-500 transition-all" />
           <input 
              type="text" 
              placeholder="Buscar por cliente ou segmento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border-2 border-slate-800 rounded-[2.5rem] py-8 pl-18 pr-8 text-white font-black text-xl outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-800 uppercase tracking-tight"
           />
        </div>
      </section>

      {/* 2. Painéis Analíticos (Comportamento & Matriz) */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        <div className="xl:col-span-7 bg-slate-900/40 border border-slate-800 rounded-[4rem] p-16 shadow-2xl">
           <h3 className="text-3xl font-black text-white mb-16 flex items-center gap-6">
              <Activity className="w-10 h-10 text-emerald-500" /> EVOLUÇÃO E COMPORTAMENTO (2021-2030)
           </h3>
           <div className="h-[600px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyBehaviorData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="5 5" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="year" stroke="#475569" fontSize={14} fontWeight="900" axisLine={false} tickLine={false} dy={15} />
                  <YAxis stroke="#475569" fontSize={12} axisLine={false} tickLine={false} tickFormatter={(v) => `R$ ${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '24px' }}
                    itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                    formatter={(v: number) => formatCurrency(v)}
                  />
                  <Bar dataKey="Faturamento" radius={[15, 15, 0, 0]} barSize={55}>
                    {yearlyBehaviorData.map((entry, index) => (
                      <Cell key={index} fill={entry.tipo === 'Histórico' ? '#10b981' : '#3b82f6'} fillOpacity={0.8} />
                    ))}
                    <LabelList dataKey="Faturamento" position="top" formatter={formatBRLAbbr} style={{ fontSize: '13px', fill: '#94a3b8', fontWeight: '900' }} offset={15} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="xl:col-span-5 bg-slate-900/40 border border-slate-800 rounded-[4rem] p-16 shadow-2xl relative overflow-hidden">
           <h3 className="text-3xl font-black text-white mb-16 flex items-center gap-6">
              <Zap className="w-10 h-10 text-amber-400" /> MATRIZ DE POSICIONAMENTO
           </h3>
           <div className="h-[600px] w-full relative">
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-10 pointer-events-none border-2 border-slate-800 rounded-3xl">
                 <div className="border-r border-b border-slate-700/50 flex items-center justify-center font-black uppercase text-3xl text-emerald-500 tracking-tighter">FIDELIZAR</div>
                 <div className="border-b border-slate-700/50 flex items-center justify-center font-black uppercase text-3xl text-blue-500 tracking-tighter">VALORIZAR</div>
                 <div className="border-r border-slate-700/50 flex items-center justify-center font-black uppercase text-3xl text-rose-500 tracking-tighter">ENCANTAR</div>
                 <div className="flex items-center justify-center font-black uppercase text-3xl text-amber-500 tracking-tighter">DESENVOLVER</div>
              </div>
              
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
                  <CartesianGrid stroke="#1e293b" strokeDasharray="5 5" />
                  <XAxis type="number" dataKey="x" name="Revenue" hide />
                  <YAxis type="number" dataKey="y" name="Growth" hide />
                  <ZAxis type="number" dataKey="x" range={[200, 1500]} />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }} 
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '24px' }}
                    content={({ active, payload }) => {
                       if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                             <div className="bg-slate-950 p-6 border-2 border-slate-800 rounded-[2rem] shadow-2xl">
                                <p className="text-lg font-black text-white mb-2 uppercase tracking-tighter">{data.name}</p>
                                <p className="text-emerald-400 font-black text-sm">{formatCurrency(data.x)}</p>
                             </div>
                          );
                       }
                       return null;
                    }}
                  />
                  <Scatter name="Clientes" data={processedData.slice(0, 15)} fill="#3b82f6">
                    {processedData.slice(0, 15).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.healthStatus === 'Churn' ? '#f43f5e' : entry.healthStatus === 'Risco' ? '#fbbf24' : '#3b82f6'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
           </div>
        </div>
      </section>

      {/* 3. Mapeamento Decenal (Matriz Estratégica 21-30) */}
      <section className="bg-slate-900/40 border border-slate-800 rounded-[4rem] p-16 overflow-hidden shadow-2xl">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-20 gap-10">
           <div className="space-y-4">
             <h3 className="text-5xl font-black text-white flex items-center gap-8 tracking-tighter uppercase">
               <Calendar className="w-16 h-16 text-blue-600" /> MAPEAMENTO DECENAL 2021-2030
             </h3>
             <p className="text-slate-500 font-black text-xs uppercase tracking-[0.5em] flex items-center gap-3">
                <ArrowUpRight className="w-5 h-5 text-blue-500" /> Matriz estratégica com projeção de faturamento 
             </p>
           </div>
           
           <div className="bg-emerald-500/5 border-2 border-emerald-500/20 px-12 py-8 rounded-[2.5rem] text-right shadow-2xl backdrop-blur-xl">
              <span className="text-[12px] text-emerald-500 font-black uppercase block mb-2 tracking-[0.2em] opacity-60">LTV Potencial Carteira T10</span>
              <span className="text-5xl font-black text-white tracking-tighter">
                 {formatCurrency(processedData.slice(0, 10).reduce((a, b) => a + b.estimatedLTV, 0))}
              </span>
           </div>
        </div>
        
        <div className="overflow-x-auto pb-8">
          <table className="w-full border-separate border-spacing-y-3 min-w-[2000px]">
            <thead>
              <tr className="text-[11px] text-slate-600 font-black uppercase tracking-[0.4em]">
                <th className="text-left py-10 px-12 w-[500px]">Perfil de Cliente & Segmento</th>
                {[2021, 2022, 2023, 2024, 2025].map(y => <th key={y} className="py-10 text-center w-36">{y} Real</th>)}
                {[2026, 2027, 2028, 2029, 2030].map(y => <th key={y} className="py-10 text-center text-blue-500 bg-blue-600/5 rounded-t-[2.5rem] w-56">{y}* Planejado</th>)}
                <th className="py-10 text-right px-12 w-64">TOTAL LTV (21-30)</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, 20).map(c => (
                <tr key={c.id} className="group hover:translate-x-1 transition-all">
                  <td className="py-10 px-12 bg-slate-900/80 rounded-l-[3rem] border-l-2 border-y-2 border-slate-800/40">
                    <div className="flex flex-col gap-3">
                      <span className="text-xl font-black text-white uppercase tracking-tight line-clamp-1 group-hover:text-blue-400 transition-colors">{c.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="bg-blue-600/20 text-blue-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{c.sector}</span>
                        <div className={`w-3 h-3 rounded-full shadow-lg ${c.healthStatus === 'Saudável' ? 'bg-emerald-500 shadow-emerald-500/40' : c.healthStatus === 'Risco' ? 'bg-amber-500 shadow-amber-500/40' : 'bg-rose-500 shadow-rose-500/40'}`}></div>
                      </div>
                    </div>
                  </td>
                  
                  {[2021, 2022, 2023, 2024, 2025].map(y => {
                    const val = c.history[y] || 0;
                    return (
                      <td key={y} className={`p-4 text-center text-[16px] font-black rounded-[2rem] border-2 border-white/5 transition-all ${getCellColor(val)}`}>
                        {val > 0 ? formatCurrency(val) : '—'}
                      </td>
                    );
                  })}

                  {[2026, 2027, 2028, 2029, 2030].map(y => {
                    const val = c.projections[y] || 0;
                    return (
                      <td key={y} className={`p-3 bg-slate-950/80 focus-within:ring-[15px] focus-within:ring-blue-600/10 rounded-[2rem] border-2 border-slate-800/50 transition-all ${getCellColor(val, true)}`}>
                        <div className="flex items-center px-6">
                           <span className="text-[11px] text-slate-700 font-black mr-3 uppercase">BRL</span>
                           <input 
                              type="text"
                              value={val > 0 ? val.toLocaleString('pt-BR') : ''}
                              onChange={(e) => handleProjectionChange(c.id, y, e.target.value)}
                              placeholder="0,00"
                              className="w-full bg-transparent text-center text-lg font-black outline-none py-5 text-white placeholder:text-slate-900 tracking-tighter"
                           />
                        </div>
                      </td>
                    );
                  })}

                  <td className="py-10 px-12 text-right bg-slate-800/80 rounded-r-[3rem] border-r-2 border-y-2 border-slate-800/40">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-3xl font-black text-emerald-400 font-mono tracking-tighter">
                        {formatCurrency(c.estimatedLTV)}
                      </span>
                      <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">Consolidado LTV</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Cards de Gestão Estratégica CRM */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-16">
         {filteredData.slice(0, 9).map(c => (
           <div key={c.id} className="bg-slate-900/60 p-16 rounded-[5rem] border-2 border-slate-800/50 flex flex-col gap-10 group hover:border-blue-500/40 hover:bg-slate-800/20 transition-all duration-700 shadow-2xl">
              <div className="flex justify-between items-start">
                 <div className="space-y-2">
                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{c.name.split(' ')[0]} {c.name.split(' ')[1]}</h4>
                    <span className="text-[11px] text-blue-500 font-black uppercase tracking-[0.3em]">{c.sector}</span>
                 </div>
                 <div className={`p-5 rounded-[2rem] ${c.healthStatus === 'Churn' ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                    <Heart className="w-8 h-8" fill="currentColor" fillOpacity={0.2} />
                 </div>
              </div>
              
              <div className="grid grid-cols-1 gap-5">
                 <div className="bg-slate-950/80 p-6 rounded-[2.5rem] border-2 border-white/5 shadow-2xl flex justify-between items-center group/item hover:border-emerald-500/20 transition-all">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Potencial Decenal</span>
                    <span className="text-xl font-black text-white">{formatBRLAbbr(c.estimatedLTV)}</span>
                 </div>
                 <div className="bg-blue-600/5 p-6 rounded-[2.5rem] border-2 border-blue-500/10 shadow-2xl flex justify-between items-center group/item hover:border-blue-500/40 transition-all">
                    <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest">Gap de Recuperação</span>
                    <span className="text-xl font-black text-blue-400">{formatBRLAbbr(c.peakRevenue - c.currentRevenue)}</span>
                 </div>
              </div>

              <div className="relative group/note">
                 <MessageSquare className="absolute left-8 top-8 w-6 h-6 text-slate-600 group-focus-within/note:text-blue-500 transition-colors" />
                 <textarea 
                   value={clientNotes[c.id] || ''}
                   onChange={(e) => saveNote(c.id, e.target.value)}
                   placeholder="Defina a estratégia de atendimento..."
                   className="w-full bg-slate-950 border-4 border-slate-800 rounded-[3rem] p-10 pl-20 text-lg text-slate-200 focus:ring-[15px] focus:ring-blue-500/10 outline-none h-60 resize-none transition-all placeholder:text-slate-900 font-bold"
                 />
              </div>
              
              <button 
                onClick={() => saveNote(c.id, clientNotes[c.id] || '')}
                className="flex items-center justify-center gap-6 bg-blue-600 hover:bg-blue-500 py-10 rounded-[3rem] text-[13px] font-black uppercase tracking-[0.4em] transition-all text-white shadow-2xl shadow-blue-600/30"
              >
                 <Save className="w-6 h-6" /> Consolidar Plano
              </button>
           </div>
         ))}
      </section>

    </div>
  );
};
