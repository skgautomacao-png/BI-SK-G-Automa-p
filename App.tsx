
import React, { useState, useMemo, useEffect } from 'react';
import { TrendingUp, Users, Award, DollarSign, BarChart3, PieChart as PieIcon, Table as TableIcon, LayoutDashboard, History, UserCheck, ChevronDown, ChevronUp, Database, ArrowRightLeft, Target, Rocket } from 'lucide-react';
import { Month, SalesData, SalesState } from './types';
import { MONTHS, TARGETS, INITIAL_SALES, ANNUAL_TOTAL_GOAL, QUARTERS, TOP_CLIENTS_HISTORY } from './constants';
import KPICard from './components/KPICard';
import Sidebar from './components/Sidebar';
import { MonthlyComparisonChart, QuarterlyAnalysisChart, GoalIndicator } from './components/Charts';
import { ClientPerformance } from './components/ClientPerformance';
import { StrategyGrowth } from './components/StrategyGrowth';

type Tab = 'dashboard' | 'clients' | 'growth';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedMonth, setSelectedMonth] = useState<Month>('Jan');
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  
  const [sales, setSales] = useState<SalesState>(() => {
    const saved = localStorage.getItem('skg_sales_data_v8');
    return saved ? JSON.parse(saved) : INITIAL_SALES;
  });

  useEffect(() => {
    localStorage.setItem('skg_sales_data_v8', JSON.stringify(sales));
  }, [sales]);

  const handleInputChange = (seller: keyof SalesData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setSales(prev => ({
      ...prev,
      [selectedMonth]: {
        ...prev[selectedMonth],
        [seller]: numValue
      }
    }));
  };

  const formatBRL = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);

  const stats = useMemo(() => {
    let totalRevenue = 0;
    MONTHS.forEach((m) => {
      const ms = sales[m];
      totalRevenue += (Number(ms.syllas) + Number(ms.vendedora1) + Number(ms.vendedora2) + Number(ms.vendedora3));
    });
    const totalGoalPercent = (totalRevenue / ANNUAL_TOTAL_GOAL) * 100;
    const monthSales = sales[selectedMonth];
    const sellerScores = [
      { name: 'Syllas', value: Number(monthSales.syllas) },
      { name: 'Vend 01', value: Number(monthSales.vendedora1) },
      { name: 'Vend 02', value: Number(monthSales.vendedora2) },
      { name: 'Vend 03', value: Number(monthSales.vendedora3) },
    ].sort((a, b) => b.value - a.value);
    
    let currentQ = 'Q1';
    if (QUARTERS.Q2.includes(selectedMonth)) currentQ = 'Q2';
    else if (QUARTERS.Q3.includes(selectedMonth)) currentQ = 'Q3';
    else if (QUARTERS.Q4.includes(selectedMonth)) currentQ = 'Q4';

    return { 
      totalRevenue, 
      totalGoalPercent, 
      currentQuarter: currentQ, 
      bestSeller: sellerScores[0].value > 0 ? sellerScores[0] : { name: 'Pendente', value: 0 } 
    };
  }, [sales, selectedMonth]);

  const monthStats = useMemo(() => {
    const ms = sales[selectedMonth];
    const targetData = TARGETS[MONTHS.indexOf(selectedMonth)];
    const revenue = (Number(ms.syllas) || 0) + (Number(ms.vendedora1) || 0) + (Number(ms.vendedora2) || 0) + (Number(ms.vendedora3) || 0);
    const target = (targetData.syllas || 0) + (targetData.vendedora1 || 0) + (targetData.vendedora2 || 0) + (targetData.vendedora3 || 0);
    const percent = target > 0 ? (revenue / target) * 100 : (revenue > 0 ? 100 : 0);
    return { revenue, target, percent };
  }, [sales, selectedMonth]);

  const quarterlyData = useMemo(() => {
    return Object.entries(QUARTERS).map(([qName, qMonths]) => {
      let qMeta = 0;
      let qReal = 0;
      qMonths.forEach(m => {
        const target = TARGETS[MONTHS.indexOf(m as Month)];
        qMeta += (target.syllas + target.vendedora1 + target.vendedora2 + target.vendedora3);
        const ms = sales[m as Month];
        qReal += (Number(ms.syllas) + Number(ms.vendedora1) + Number(ms.vendedora2) + Number(ms.vendedora3));
      });
      return { name: qName, Meta: qMeta, Realizado: qReal, Atingimento: qMeta > 0 ? (qReal / qMeta) * 100 : (qReal > 0 ? 100 : 0) };
    });
  }, [sales]);

  const comparisonData = useMemo(() => {
    return MONTHS.map((m, idx) => {
      const target = TARGETS[idx];
      const monthTarget = target.syllas + target.vendedora1 + target.vendedora2 + target.vendedora3;
      const ms = sales[m];
      const actual = Number(ms.syllas) + Number(ms.vendedora1) + Number(ms.vendedora2) + Number(ms.vendedora3);
      return { month: m, Meta: monthTarget, Realizado: actual };
    });
  }, [sales]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#020617] text-slate-100 font-sans">
      <Sidebar 
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        currentData={sales[selectedMonth]}
        handleInputChange={handleInputChange}
        activeTab={activeTab === 'growth' ? 'clients' : activeTab} // Sidebar visual adjustment
        setActiveTab={(tab) => setActiveTab(tab as Tab)}
      />

      <main className="flex-1 px-6 lg:px-10 py-8 space-y-12 overflow-y-auto overflow-x-hidden w-full">
        
        {/* Bloco 1: KPIs Horizontais (4 Colunas) */}
        <header className="space-y-8">
          <div className="flex flex-col xl:flex-row justify-between items-center gap-6 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-5">
              <img src="https://imgur.com/hURknEb.png" alt="Logo" className="w-12 h-12" />
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white uppercase flex items-center gap-3">
                  <LayoutDashboard className="w-8 h-8 text-blue-500" /> Dashboard de BI Corporativo
                </h1>
                <p className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.4em] ml-1">SK-G Automação • Unidade de Performance 2026</p>
              </div>
            </div>
            
            <div className="flex bg-slate-900 border border-slate-700 p-1 rounded-2xl shadow-xl">
               <button onClick={() => setActiveTab('dashboard')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Painel Analítico</button>
               <button onClick={() => setActiveTab('clients')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'clients' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>T20 Clientes</button>
               <button onClick={() => setActiveTab('growth')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'growth' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Consultoria V4</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <KPICard title="Revenue Acumulado" value={formatBRL(stats.totalRevenue)} subtitle="YTD Realizado" icon={<DollarSign />} colorClass="text-emerald-400" />
            <KPICard title="Goal Atingido" value={`${stats.totalGoalPercent.toFixed(1)}%`} subtitle="Target 2026" icon={<TrendingUp />} colorClass="text-blue-400" />
            <KPICard title="Quarter Status" value={stats.currentQuarter} subtitle={`${quarterlyData.find(q => q.name === stats.currentQuarter)?.Atingimento.toFixed(1)}% QTD`} icon={<BarChart3 />} colorClass="text-purple-400" />
            <KPICard title="Top Seller (Mês)" value={stats.bestSeller.name} subtitle={formatBRL(stats.bestSeller.value)} icon={<Award />} colorClass="text-amber-400" />
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            {/* Dashboard content */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden">
               <button onClick={() => setIsInputExpanded(!isInputExpanded)} className="w-full flex items-center justify-between p-6 hover:bg-slate-800 transition-all">
                  <div className="flex items-center gap-4">
                     <Database className="w-5 h-5 text-blue-500" />
                     <span className="text-sm font-black text-white uppercase tracking-widest">Entrada de Dados - {selectedMonth} 2026</span>
                  </div>
                  {isInputExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
               </button>
               {isInputExpanded && (
                 <div className="p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-950/50 border-t border-slate-800">
                    {[{ id: 'syllas', label: 'Syllas (Dir.)' }, { id: 'vendedora1', label: 'Vendedora 01' }, { id: 'vendedora2', label: 'Vendedora 02' }, { id: 'vendedora3', label: 'Vendedora 03' }].map(s => (
                       <div key={s.id} className="space-y-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{s.label}</label>
                          <div className="relative">
                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-bold">R$</span>
                             <input type="text" value={sales[selectedMonth][s.id as keyof SalesData] || ''} onChange={(e) => handleInputChange(s.id as keyof SalesData, e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white text-sm font-bold" placeholder="0,00" />
                          </div>
                       </div>
                    ))}
                 </div>
               )}
            </section>
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
               <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-10">
                  <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                     <TrendingUp className="w-5 h-5 text-emerald-500" /> PERFORMANCE MENSAL VS META
                  </h3>
                  <MonthlyComparisonChart data={comparisonData} />
               </div>
               <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-10">
                  <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                     <ArrowRightLeft className="w-5 h-5 text-blue-500" /> ATINGIMENTO POR TRIMESTRE
                  </h3>
                  <QuarterlyAnalysisChart data={quarterlyData} />
               </div>
            </section>
            <section className="space-y-8">
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                 <GoalIndicator label="Syllas" current={sales[selectedMonth].syllas} target={TARGETS[MONTHS.indexOf(selectedMonth)].syllas} />
                 <GoalIndicator label="Vend 01" current={sales[selectedMonth].vendedora1} target={TARGETS[MONTHS.indexOf(selectedMonth)].vendedora1} />
                 <GoalIndicator label="Vend 02" current={sales[selectedMonth].vendedora2} target={TARGETS[MONTHS.indexOf(selectedMonth)].vendedora2} />
                 <GoalIndicator label="Vend 03" current={sales[selectedMonth].vendedora3} target={TARGETS[MONTHS.indexOf(selectedMonth)].vendedora3} />
               </div>
               <div className="bg-slate-900/30 border border-slate-800 rounded-[2.5rem] p-10">
                  <h3 className="text-xl font-black text-white mb-10 flex items-center gap-4">
                    <TableIcon className="w-5 h-5 text-blue-500" /> RELATÓRIO CONSOLIDADO ANUAL
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                       <thead>
                          <tr className="text-slate-600 text-[10px] uppercase font-black tracking-widest">
                             <th className="py-4 px-8">Mês</th>
                             <th className="py-4 px-8">Meta Projetada</th>
                             <th className="py-4 px-8">Realizado</th>
                             <th className="py-4 px-8 text-right">Performance</th>
                          </tr>
                       </thead>
                       <tbody>
                          {comparisonData.map(row => {
                             const ating = row.Meta > 0 ? (row.Realizado / row.Meta) * 100 : 0;
                             return (
                                <tr key={row.month} className="bg-slate-900/60 rounded-xl hover:bg-slate-800 transition-colors">
                                   <td className="py-6 px-8 font-black text-white">{row.month}</td>
                                   <td className="py-6 px-8 text-slate-400 font-mono text-xs">{formatBRL(row.Meta)}</td>
                                   <td className="py-6 px-8 font-bold font-mono text-xs text-white">{formatBRL(row.Realizado)}</td>
                                   <td className="py-6 px-8 text-right">
                                      <span className={`px-4 py-1 rounded-full text-[10px] font-black ${ating >= 100 ? 'bg-emerald-500/10 text-emerald-400' : ating >= 80 ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                         {ating.toFixed(1)}%
                                      </span>
                                   </td>
                                </tr>
                             );
                          })}
                       </tbody>
                    </table>
                  </div>
               </div>
            </section>
          </div>
        )}

        {activeTab === 'clients' && <ClientPerformance />}
        
        {activeTab === 'growth' && (
          <StrategyGrowth 
            monthStats={monthStats} 
            selectedMonth={selectedMonth} 
            topClients={TOP_CLIENTS_HISTORY}
            quarterStats={quarterlyData.find(q => q.name === stats.currentQuarter)}
          />
        )}
      </main>
    </div>
  );
};

export default App;
