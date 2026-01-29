
import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Rocket, ShieldAlert, Zap, TrendingUp, MessageSquare, 
  ListTodo, Share2, Sparkles, Loader2, ChevronRight, 
  Target, Globe, Calendar, Mail, Megaphone, Copy, Check, BarChart3, ArrowRight
} from 'lucide-react';
import { Month, ClientProfile } from '../types';

interface StrategyGrowthProps {
  monthStats: { revenue: number, target: number, percent: number };
  selectedMonth: Month;
  topClients: ClientProfile[];
  quarterStats?: { name: string, Meta: number, Realizado: number, Atingimento: number };
}

// Ícone local para evitar erro de importação caso não venha do Lucide
const RefreshCcw = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
    <path d="M3 21v-5h5"/>
  </svg>
);

export const StrategyGrowth: React.FC<StrategyGrowthProps> = ({ monthStats, selectedMonth, topClients, quarterStats }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const performanceStatus = useMemo(() => {
    if (monthStats.percent < 80) return 'ALERTA';
    if (monthStats.percent >= 100) return 'OPORTUNIDADE';
    return 'ESTABILIDADE';
  }, [monthStats]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateInsights = async () => {
    if (!process.env.API_KEY) {
      setInsight("Configuração pendente: API_KEY não encontrada.");
      return;
    }
    
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inactiveClients = topClients.filter(c => !c.history[2025] || c.history[2025] === 0).map(c => c.name).slice(0, 3).join(', ');
      
      const prompt = `
        Atue como o CCO (Chief Growth Officer) da V4 Company em consultoria exclusiva para a SK-G Automação. 
        Utilize a metodologia V4 (Tráfego, Engajamento, Conversão e Retenção).

        CONTEXTO ATUAL (${selectedMonth}):
        - Faturamento Real: R$ ${monthStats.revenue.toLocaleString('pt-BR')}
        - Atingimento: ${monthStats.percent.toFixed(1)}% (Status: ${performanceStatus})
        - Quarter Trend: ${quarterStats?.Atingimento.toFixed(1)}%
        - Clientes Inativos (Oportunidade de Retenção): ${inactiveClients}

        TAREFAS OBRIGATÓRIAS NA RESPOSTA (Formato Markdown Rico):

        1. INTELIGÊNCIA MACROECONÔMICA: Analise como a Taxa Selic e o IPCA atual impactam a decisão de compra de automação industrial hoje.
        2. CALENDÁRIO EDITORIAL SEMANAL (LINKEDIN): Sugira temas de posts para 4 semanas.
        3. MOTOR DE E-MAIL MARKETING: Rascunho para reativação de clientes.
        4. ORQUESTRADOR DE ADS: Onde alocar verba extra esta semana.

        Mantenha o tom profissional, direto e focado em execução.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });

      setInsight(response.text);
    } catch (error) {
      console.error("Erro ao gerar estratégias:", error);
      setInsight("Houve um erro ao conectar com o motor de inteligência industrial. Verifique a chave de API ou tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateInsights();
  }, [selectedMonth, performanceStatus]);

  const getStatusTheme = () => {
    switch (performanceStatus) {
      case 'ALERTA': return { gradient: 'from-rose-600 to-red-900', border: 'border-rose-500', icon: <ShieldAlert className="w-12 h-12" /> };
      case 'OPORTUNIDADE': return { gradient: 'from-emerald-600 to-green-900', border: 'border-emerald-500', icon: <Rocket className="w-12 h-12" /> };
      default: return { gradient: 'from-blue-600 to-indigo-900', border: 'border-blue-500', icon: <TrendingUp className="w-12 h-12" /> };
    }
  };

  const theme = getStatusTheme();

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <section className={`bg-gradient-to-br ${theme.gradient} p-12 rounded-[3.5rem] border-4 ${theme.border} shadow-2xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Zap className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-center gap-10">
           <div className="flex items-center gap-8">
              <div className="p-6 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20">
                 {theme.icon}
              </div>
              <div className="space-y-2">
                 <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Estratégia & Growth V4</h2>
                 <p className="text-white/70 font-black uppercase text-[10px] tracking-[0.4em]">Status de Operação: {performanceStatus}</p>
              </div>
           </div>
           <div className="flex flex-wrap justify-center gap-6">
              <div className="bg-black/20 backdrop-blur-md px-10 py-6 rounded-[2rem] border border-white/10 text-center">
                 <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Taxa de Atingimento</p>
                 <p className="text-4xl font-black text-white font-mono">{monthStats.percent.toFixed(1)}%</p>
              </div>
           </div>
        </div>
      </section>

      <section className="bg-slate-900/40 border border-slate-800 rounded-[4rem] p-16 shadow-2xl relative">
         <div className="flex items-center justify-between mb-16">
            <h3 className="text-3xl font-black text-white flex items-center gap-6">
               <Calendar className="w-10 h-10 text-blue-500" /> CALENDÁRIO & MARKETING
            </h3>
            <button 
              onClick={generateInsights}
              disabled={loading}
              className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all text-slate-200 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5" />} Sincronizar IA
            </button>
         </div>

         {loading ? (
           <div className="flex flex-col items-center justify-center py-48 gap-10">
              <Loader2 className="w-20 h-20 text-blue-600 animate-spin" />
              <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">Sincronizando estratégias V4...</p>
           </div>
         ) : (
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
              <div className="prose prose-invert prose-blue max-w-none">
                {insight && insight.split('\n').map((line, i) => (
                  <p key={i} className="text-[15px] text-slate-300 mb-2">{line}</p>
                ))}
              </div>
              <div className="space-y-10">
                 <div className="bg-slate-950/60 rounded-[3rem] border border-slate-800 p-12 space-y-8">
                    <h5 className="text-xl font-black text-white flex items-center gap-4">
                       <Mail className="w-7 h-7 text-emerald-500" /> E-MAIL MARKETING
                    </h5>
                    <button className="w-full bg-emerald-600 hover:bg-emerald-500 py-6 rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] transition-all text-white">
                       Gerar Texto Completo
                    </button>
                 </div>
              </div>
           </div>
         )}
      </section>
    </div>
  );
};
